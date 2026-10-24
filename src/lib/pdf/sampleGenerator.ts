/**
 * Pure TypeScript PDF binary builder.
 * Generates valid, downloadable, parseable PDF files without relying on native compilation or heavy binaries.
 */

export interface SampleDocConfig {
  title: string;
  subtitle: string;
  authority: string;
  referenceNumber: string;
  issueDate: string;
  expiryDate?: string;
  institutionName: string;
  trustName: string;
  bodyParagraphs: string[];
  sealText: string;
}

export function buildSyntheticPDF(config: SampleDocConfig): Buffer {
  const lines: string[] = [
    `GOVERNMENT OF INDIA - REGULATORY COMPLIANCE ARCHIVE`,
    `DEPARTMENT: ${config.authority.toUpperCase()}`,
    `--------------------------------------------------------------------------------`,
    `DOCUMENT TYPE: ${config.title.toUpperCase()}`,
    `REFERENCE NUMBER: ${config.referenceNumber}`,
    `DATE OF ISSUE: ${config.issueDate}`,
    config.expiryDate ? `VALID UP TO: ${config.expiryDate}` : `VALIDITY: PERMANENT / INDEFINITE`,
    `APPLICANT ENTITY: ${config.institutionName}`,
    `SPONSORING TRUST/SOCIETY: ${config.trustName}`,
    `--------------------------------------------------------------------------------`,
    ``,
    ...config.bodyParagraphs,
    ``,
    `--------------------------------------------------------------------------------`,
    `OFFICIAL SEAL: [${config.sealText}]`,
    `STATUS: DIGITALLY RECORDED IN STATE REGULATORY REPOSITORY`,
  ];

  // Build PDF stream text
  let streamText = `BT\n/F1 10 Tf\n40 750 Td\n14 TL\n`;
  lines.forEach((line) => {
    // Escape parenthesis in PDF string literals
    const safeLine = line.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
    streamText += `(${safeLine}) '\n`;
  });
  streamText += `ET\n`;

  const streamLength = Buffer.byteLength(streamText, 'latin1');

  const obj1 = `1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n`;
  const obj2 = `2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n`;
  const obj3 = `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n`;
  const obj4 = `4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n`;
  const obj5 = `5 0 obj\n<< /Length ${streamLength} >>\nstream\n${streamText}\nendstream\nendobj\n`;

  const header = `%PDF-1.4\n`;
  const offset0 = 0;
  const offset1 = header.length;
  const offset2 = offset1 + obj1.length;
  const offset3 = offset2 + obj2.length;
  const offset4 = offset3 + obj3.length;
  const offset5 = offset4 + obj4.length;
  const startXref = offset5 + obj5.length;

  const xref = `xref\n0 6\n0000000000 65535 f \n${String(offset1).padStart(10, '0')} 00000 n \n${String(offset2).padStart(10, '0')} 00000 n \n${String(offset3).padStart(10, '0')} 00000 n \n${String(offset4).padStart(10, '0')} 00000 n \n${String(offset5).padStart(10, '0')} 00000 n \n`;
  const trailer = `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${startXref}\n%%EOF\n`;

  const fullPdfStr = `${header}${obj1}${obj2}${obj3}${obj4}${obj5}${xref}${trailer}`;
  return Buffer.from(fullPdfStr, 'latin1');
}

export const SAMPLE_PRESETS: Record<string, SampleDocConfig> = {
  validLandDeed: {
    title: 'Registered Land Ownership Title Deed',
    subtitle: 'Sub-Registrar Conveyance Order',
    authority: 'Department of Revenue & Land Registry',
    referenceNumber: 'REG-LAND-2025-9941',
    issueDate: '2025-11-12',
    institutionName: 'Aryabhatta Institute of Technology & Management',
    trustName: 'Aryabhatta Shiksha Samiti',
    bodyParagraphs: [
      'This conveyance certifies that Aryabhatta Shiksha Samiti is the absolute and undisputed owner in possession',
      'of non-agricultural educational campus land measuring 10.20 Acres located at Khasra No. 418/2.',
      'The land is contiguous, encumbrance free, and demarcated exclusively for Higher Technical Education.',
    ],
    sealText: 'GOVERNMENT SUB-REGISTRAR SEAL & SIGNATURE VERIFIED',
  },
  expiredFireNoc: {
    title: 'Fire & Life Safety No-Objection Certificate',
    subtitle: 'Municipal Fire Services Directorate',
    authority: 'Directorate of Fire Prevention & Emergency Safety',
    referenceNumber: 'PMRDA/FIRE/2023/REC/1044',
    issueDate: '2023-01-16',
    expiryDate: '2026-01-15',
    institutionName: 'Saraswati College of Engineering & Research',
    trustName: 'Saraswati Vidya Pratishthan',
    bodyParagraphs: [
      'Inspection of institutional campus blocks was executed under NBC 2016 Part IV regulations.',
      'Valid Through: 15-Jan-2026. (Three Years validity period from issue).',
      'WARNING: Certificate must be renewed prior to 15-Jan-2026 to remain compliant.',
    ],
    sealText: 'CHIEF FIRE OFFICER - LAPSED ON 15-JAN-2026',
  },
  mismatchStateNoc: {
    title: 'State Government Clearance NOC',
    subtitle: 'Directorate of Technical Education',
    authority: 'Department of Higher & Technical Education',
    referenceNumber: 'ED-312-TEC-2025',
    issueDate: '2026-01-08',
    institutionName: 'Dronacharya Institute of Engineering & Technology',
    trustName: 'Drona Vidya Samiti (Reg: DVS-9912-BLR/2022)',
    bodyParagraphs: [
      'State government accords permission to Drona Vidya Samiti to establish Dronacharya Institute of',
      'Engineering & Technology at Nelamangala for academic session 2026-2027.',
    ],
    sealText: 'STATE TECHNICAL EDUCATION SECRETARIAT SEAL',
  },
};
