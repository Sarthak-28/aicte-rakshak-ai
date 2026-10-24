import { ExtractedFieldDetail, DocumentType } from '@/types';

export interface ExtractionResult {
  documentType: DocumentType;
  fields: Record<string, ExtractedFieldDetail>;
  summary: string;
  source: 'GEMINI_AI' | 'OFFLINE_HEURISTIC_ENGINE';
}

export async function extractDocumentFields(
  rawText: string,
  fileName: string
): Promise<ExtractionResult> {
  const geminiKey = process.env.GEMINI_API_KEY;

  if (geminiKey) {
    try {
      const geminiResult = await extractWithGemini(rawText, fileName, geminiKey);
      if (geminiResult) return geminiResult;
    } catch (err) {
      console.warn('[AIProvider] Gemini API call failed or timed out, falling back to heuristic engine:', err);
    }
  }

  // Built-in Deterministic Heuristic Extractor (100% offline fallback)
  return extractWithHeuristics(rawText, fileName);
}

async function extractWithGemini(
  rawText: string, 
  fileName: string, 
  apiKey: string
): Promise<ExtractionResult | null> {
  const prompt = `You are an AI document analysis engine for AICTE (All India Council for Technical Education).
Analyze this text extracted from document "${fileName}" and return a JSON object with:
- documentType: one of ["LAND_TITLE_DEED", "BUILDING_PLAN_APPROVAL", "FIRE_SAFETY_CERTIFICATE", "STATE_GOVT_NOC", "AFFILIATING_UNIVERSITY_NOC", "TRUST_SOCIETY_REGISTRATION", "AUDITED_BALANCE_SHEET"]
- summary: brief 1-2 sentence description
- fields: an object where each key has { "value": string, "confidence": number between 0 and 1, "sourceQuote": string, "pageNumber": 1 }
Keys to extract where present: institutionName, trustName, referenceNumber, issueDate (YYYY-MM-DD), expiryDate (YYYY-MM-DD), landAreaAcres, builtUpArea.

Document Text:
${rawText.slice(0, 4000)}

Respond strictly in valid JSON without markdown fences.`;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json' }
    }),
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!textContent) return null;

  const parsed = JSON.parse(textContent);
  return {
    documentType: parsed.documentType || inferDocumentType(fileName, rawText),
    fields: parsed.fields || {},
    summary: parsed.summary || 'Extracted via Google Gemini AI model',
    source: 'GEMINI_AI',
  };
}

export function extractWithHeuristics(rawText: string, fileName: string): ExtractionResult {
  const fields: Record<string, ExtractedFieldDetail> = {};
  const docType = inferDocumentType(fileName, rawText);

  // 1. Institution Name Pattern
  const instMatch = rawText.match(/(?:for|to|named|approved for|issued to|institution\s*:)\s*([A-Z][A-Za-z0-9\s&,.'-]{5,65}(?:Institute|College|Academy|University|Polytechnic|Engineering|Technology|Sciences))/i)
    || rawText.match(/([A-Z][A-Za-z0-9\s&,.'-]{5,60}(?:Institute of Technology|College of Engineering|Polytechnic College|Academy of Applied Sciences))/);

  if (instMatch) {
    fields['institutionName'] = {
      value: instMatch[1].trim(),
      confidence: 0.94,
      sourceQuote: instMatch[0].trim(),
      pageNumber: 1,
    };
  }

  // 2. Sponsoring Trust / Society Name Pattern
  const trustMatch = rawText.match(/(?:promoted by|favor of|society|trust\s*:|accorded to)\s*([A-Z][A-Za-z0-9\s&,.'-]{5,50}(?:Trust|Samiti|Society|Foundation|Pratishthan|Mandal))/i);
  if (trustMatch) {
    fields['trustName'] = {
      value: trustMatch[1].trim(),
      confidence: 0.92,
      sourceQuote: trustMatch[0].trim(),
      pageNumber: 1,
    };
  }

  // 3. Reference / Registration / Sanction Number Pattern
  const refMatch = rawText.match(/(?:Reg(?:istration)?\s*(?:No|Number)|Ref(?:\s*No)?|Notification\s*No|Order\s*No|Sanction\s*(?:File\s*)?Ref|Certificate\s*Ref)\s*[:.]?\s*([A-Z0-9\/-]{5,35})/i);
  if (refMatch) {
    fields['referenceNumber'] = {
      value: refMatch[1].trim(),
      confidence: 0.95,
      sourceQuote: refMatch[0].trim(),
      pageNumber: 1,
    };
    fields['registrationNumber'] = {
      value: refMatch[1].trim(),
      confidence: 0.95,
      sourceQuote: refMatch[0].trim(),
      pageNumber: 1,
    };
  }

  // 4. Issue Date Pattern
  const issueMatch = rawText.match(/(?:Date\s*of\s*Issue|Dated|Date\s*of\s*Sanction|Issued\s*on|Inspected\s*on)\s*[:.]?\s*(\d{1,2}[-\/.]\w{3,9}[-\/.]\d{2,4}|\d{4}[-\/]\d{2}[-\/]\d{2}|\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})/i);
  if (issueMatch) {
    fields['issueDate'] = {
      value: normalizeDate(issueMatch[1]),
      confidence: 0.93,
      sourceQuote: issueMatch[0].trim(),
      pageNumber: 1,
    };
  }

  // 5. Expiry Date Pattern
  const expiryMatch = rawText.match(/(?:Valid\s*(?:Up\s*to|Through|Until)|Expires\s*on|Lapsed\s*on)\s*[:.]?\s*(\d{1,2}[-\/.]\w{3,9}[-\/.]\d{2,4}|\d{4}[-\/]\d{2}[-\/]\d{2}|\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4}|Permanent|Indefinite)/i);
  if (expiryMatch) {
    const rawVal = expiryMatch[1].trim();
    fields['expiryDate'] = {
      value: rawVal.toLowerCase().includes('permanent') || rawVal.toLowerCase().includes('indefinite') ? 'Permanent' : normalizeDate(rawVal),
      confidence: 0.96,
      sourceQuote: expiryMatch[0].trim(),
      pageNumber: 1,
    };
  }

  // 6. Land / Built-Up Area Patterns
  const areaMatch = rawText.match(/(\d+(?:\.\d+)?\s*(?:Acres|Hectares|sq\.\s*meters|sq\.m))/i);
  if (areaMatch) {
    fields['area'] = {
      value: areaMatch[1].trim(),
      confidence: 0.90,
      sourceQuote: areaMatch[0].trim(),
      pageNumber: 1,
    };
  }

  return {
    documentType: docType,
    fields,
    summary: `Heuristic parsing identified ${Object.keys(fields).length} key regulatory metadata fields.`,
    source: 'OFFLINE_HEURISTIC_ENGINE',
  };
}

function inferDocumentType(fileName: string, text: string): DocumentType {
  const combined = `${fileName} ${text}`.toLowerCase();
  if (combined.includes('land') || combined.includes('deed') || combined.includes('khasra') || combined.includes('sub-registrar')) {
    return 'LAND_TITLE_DEED';
  }
  if (combined.includes('building') || combined.includes('sanction') || combined.includes('jda') || combined.includes('built-up')) {
    return 'BUILDING_PLAN_APPROVAL';
  }
  if (combined.includes('fire') || combined.includes('cfo') || combined.includes('hazard') || combined.includes('extinguisher')) {
    return 'FIRE_SAFETY_CERTIFICATE';
  }
  if (combined.includes('university') || combined.includes('affiliation') || combined.includes('rtu') || combined.includes('vtu')) {
    return 'AFFILIATING_UNIVERSITY_NOC';
  }
  if (combined.includes('dte') || combined.includes('technical education') || combined.includes('state') || combined.includes('secretariat')) {
    return 'STATE_GOVT_NOC';
  }
  if (combined.includes('trust') || combined.includes('society') || combined.includes('registration act')) {
    return 'TRUST_SOCIETY_REGISTRATION';
  }
  return 'LAND_TITLE_DEED';
}

function normalizeDate(raw: string): string {
  try {
    const d = new Date(raw);
    if (!isNaN(d.getTime())) {
      return d.toISOString().split('T')[0];
    }
  } catch (e) {}

  // Parse formats like 15-Jan-2026 or 15/01/2026
  const months: Record<string, string> = {
    jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
    jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12',
  };

  const parts = raw.replace(/[,\/.]/g, '-').split('-');
  if (parts.length === 3) {
    let day = parts[0].padStart(2, '0');
    let monthPart = parts[1].toLowerCase().slice(0, 3);
    let month = months[monthPart] || parts[1].padStart(2, '0');
    let year = parts[2].length === 2 ? `20${parts[2]}` : parts[2];
    return `${year}-${month}-${day}`;
  }

  return raw;
}
