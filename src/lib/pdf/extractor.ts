import crypto from 'crypto';

export interface PDFExtractionResult {
  fileHash: string;
  extractedText: string;
  pageCount: number;
}

/**
 * Extracts plain text from a PDF Buffer and computes cryptographic SHA-256 hash.
 * Includes a robust stream/regex extractor capable of extracting text strings from PDF streams
 * without fragile external native binary dependencies.
 */
export function extractTextFromPDFBuffer(buffer: Buffer): PDFExtractionResult {
  const hash = crypto.createHash('sha256').update(buffer).digest('hex');

  const raw = buffer.toString('latin1');
  let extractedText = '';
  let pageCount = 1;

  // Count /Page objects
  const pagesMatches = raw.match(/\/Type\s*\/Page\b/g);
  if (pagesMatches && pagesMatches.length > 0) {
    pageCount = pagesMatches.length;
  }

  // Extract text within BT ... ET blocks (standard PDF text representation)
  const btRegex = /BT\s*([\s\S]*?)\s*ET/g;
  let match;
  const chunks: string[] = [];

  while ((match = btRegex.exec(raw)) !== null) {
    const block = match[1];
    // Extract Tj string literals: (Text) Tj
    const tjRegex = /\(([\s\S]*?)\)\s*Tj/g;
    let tjMatch;
    while ((tjMatch = tjRegex.exec(block)) !== null) {
      chunks.push(cleanPdfString(tjMatch[1]));
    }

    // Extract TJ array literals: [(Text) 10 (More)] TJ
    const tjArrayRegex = /\[([\s\S]*?)\]\s*TJ/g;
    let tjArrMatch;
    while ((tjArrMatch = tjArrayRegex.exec(block)) !== null) {
      const arrContent = tjArrMatch[1];
      const innerStrRegex = /\(([\s\S]*?)\)/g;
      let innerMatch;
      while ((innerMatch = innerStrRegex.exec(arrContent)) !== null) {
        chunks.push(cleanPdfString(innerMatch[1]));
      }
    }
  }

  if (chunks.length > 0) {
    extractedText = chunks.join(' ').replace(/\s+/g, ' ').trim();
  }

  // If standard BT/ET block extraction didn't yield text (e.g. stream compression or raw metadata),
  // extract ASCII text sequences
  if (!extractedText || extractedText.length < 20) {
    const asciiMatches = raw.match(/[A-Za-z0-9\s,.:;\/\-]{20,}/g);
    if (asciiMatches && asciiMatches.length > 0) {
      extractedText = asciiMatches
        .filter((s) => !s.includes('obj') && !s.includes('endobj') && !s.includes('stream') && !s.includes('xref'))
        .join('\n')
        .replace(/\s+/g, ' ')
        .trim();
    }
  }

  return {
    fileHash: hash,
    extractedText: extractedText || 'No plain text could be extracted. The document may be an image-only scan.',
    pageCount,
  };
}

function cleanPdfString(str: string): string {
  return str
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t')
    .replace(/\\\(/g, '(')
    .replace(/\\\)/g, ')')
    .replace(/\\\\/g, '\\');
}
