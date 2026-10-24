import { NextRequest, NextResponse } from 'next/server';
import { getApplicationById, addDocumentToApplication, getApplications, updateApplication } from '@/lib/storage/db';
import { extractTextFromPDFBuffer } from '@/lib/pdf/extractor';
import { extractDocumentFields } from '@/lib/ai/provider';
import { runDeterministicValidation } from '@/lib/validation/engine';
import { buildSyntheticPDF, SAMPLE_PRESETS } from '@/lib/pdf/sampleGenerator';
import { ApplicationDocument } from '@/types';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const app = getApplicationById(params.id);
    if (!app) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    let fileBuffer: Buffer | null = null;
    let fileName = '';
    let fileSize = 0;
    let mimeType = 'application/pdf';

    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      const presetKey = formData.get('preset') as string | null;

      if (presetKey && SAMPLE_PRESETS[presetKey]) {
        const config = SAMPLE_PRESETS[presetKey];
        fileBuffer = buildSyntheticPDF(config);
        fileName = `${presetKey}_${Date.now()}.pdf`;
        fileSize = fileBuffer.length;
      } else if (file) {
        if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
          return NextResponse.json({ error: 'Invalid file type. Only PDF documents are supported.' }, { status: 400 });
        }
        if (file.size > 10 * 1024 * 1024) {
          return NextResponse.json({ error: 'File size exceeds maximum allowed limit of 10MB.' }, { status: 400 });
        }
        const bytes = await file.arrayBuffer();
        fileBuffer = Buffer.from(bytes);
        fileName = file.name;
        fileSize = file.size;
        mimeType = file.type || 'application/pdf';
      }
    } else {
      // JSON payload with preset
      const body = await request.json();
      if (body.preset && SAMPLE_PRESETS[body.preset]) {
        const config = SAMPLE_PRESETS[body.preset];
        fileBuffer = buildSyntheticPDF(config);
        fileName = `${body.preset}_sample.pdf`;
        fileSize = fileBuffer.length;
      }
    }

    if (!fileBuffer) {
      return NextResponse.json({ error: 'No valid file or preset provided' }, { status: 400 });
    }

    // 1. Server-side PDF extraction & hashing
    const { fileHash, extractedText } = extractTextFromPDFBuffer(fileBuffer);

    // 2. Provider-independent field extraction (Gemini / Heuristic fallback)
    const extractionResult = await extractDocumentFields(extractedText, fileName);

    const newDoc: ApplicationDocument = {
      id: `DOC-${Date.now().toString().slice(-4)}-${Math.floor(Math.random() * 900 + 100)}`,
      documentType: extractionResult.documentType,
      title: fileName.replace(/\.pdf$/i, '').replace(/_/g, ' '),
      fileName,
      fileSize,
      mimeType,
      fileHash,
      uploadedAt: new Date().toISOString(),
      extractedText,
      extractedFields: extractionResult.fields,
      isMandatory: true,
      status: 'EXTRACTED',
    };

    // 3. Add to application
    addDocumentToApplication(app.id, newDoc);

    // 4. Re-run deterministic validation
    const refreshedApp = getApplicationById(app.id)!;
    const allApps = getApplications();
    const updatedFindings = runDeterministicValidation(refreshedApp, allApps);

    let updatedValStatus = 'VALIDATED_CLEAN';
    if (updatedFindings.some((f) => f.severity === 'CRITICAL' && f.reviewStatus === 'OPEN')) {
      updatedValStatus = 'ANOMALIES_DETECTED';
    } else if (updatedFindings.some((f) => f.severity === 'WARNING' && f.reviewStatus === 'OPEN')) {
      updatedValStatus = 'VALIDATION_WARNINGS';
    }

    const finalApp = updateApplication(app.id, {
      findings: updatedFindings,
      validationStatus: updatedValStatus as any,
    });

    return NextResponse.json({
      success: true,
      document: newDoc,
      extractionSource: extractionResult.source,
      findingsGenerated: updatedFindings.length,
      application: finalApp,
    });
  } catch (error) {
    console.error('[API /api/applications/[id]/documents] Error:', error);
    return NextResponse.json({ error: 'Failed to process document upload' }, { status: 500 });
  }
}
