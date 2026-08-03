#!/usr/bin/env node
// Pure Node.js PDF generator for the AI Client Acquisition Playbook.
// No external dependencies. Produces a basic but valid PDF.

const fs = require('fs');
const path = require('path');

const SRC_MD = path.join(__dirname, '../public/downloads/ai-client-acquisition-playbook.md');
const OUT_PDF = path.join(__dirname, '../public/downloads/ai-client-acquisition-playbook.pdf');

const PAGE_WIDTH = 612; // Letter width in points
const PAGE_HEIGHT = 792; // Letter height in points
const MARGIN = 54;
const LINE_HEIGHT = 14;
const FONT_SIZE = 11;
const TITLE_SIZE = 24;
const H2_SIZE = 16;
const H3_SIZE = 13;

function escapePdf(str) {
  return String(str)
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/'/g, "'")
    .replace(/"/g, '"')
    .replace(/™/g, '(tm)')
    .replace(/•/g, '-')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/[^\x00-\x7F]/g, '?');
}

function wrapLine(text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let current = '';
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (test.length * 0.55 > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines.length ? lines : [''];
}

function parseMarkdown(src) {
  const lines = src.split('\n');
  const blocks = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith('# ')) {
      blocks.push({ type: 'h1', text: line.slice(2).trim() });
    } else if (line.startsWith('## ')) {
      blocks.push({ type: 'h2', text: line.slice(3).trim() });
    } else if (line.startsWith('### ')) {
      blocks.push({ type: 'h3', text: line.slice(4).trim() });
    } else if (line.startsWith('**') && line.endsWith('**') && line.includes('By')) {
      blocks.push({ type: 'meta', text: line.replace(/\*\*/g, '') });
    } else if (line.startsWith('> ')) {
      blocks.push({ type: 'quote', text: line.slice(2).trim() });
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      blocks.push({ type: 'bullet', text: line.slice(2).trim() });
    } else if (line.match(/^\d+\.\s/)) {
      blocks.push({ type: 'numbered', text: line.replace(/^\d+\.\s/, '').trim() });
    } else if (line.trim() === '') {
      blocks.push({ type: 'blank' });
    } else if (line.startsWith('|') && line.includes('|')) {
      // Skip table separator lines; render others as plain text rows
      if (!line.match(/^\|[-:\s|]+\|$/)) {
        const cells = line.split('|').slice(1, -1).map(c => c.trim()).filter(Boolean);
        if (cells.length) blocks.push({ type: 'table-row', cells });
      }
    } else {
      blocks.push({ type: 'p', text: line.trim() });
    }
    i++;
  }
  return blocks;
}

function buildPdf() {
  const src = fs.readFileSync(SRC_MD, 'utf8');
  const blocks = parseMarkdown(src);

  const objects = [];
  function addObject(content) {
    objects.push(content);
    return objects.length;
  }

  // Pages
  const pageRefs = [];
  let currentPage = null;
  let y = PAGE_HEIGHT - MARGIN;

  function newPage() {
    if (currentPage) {
      currentPage.content += '\nET\n';
      currentPage.ref = addObject(currentPage.content);
      pageRefs.push(currentPage.ref);
    }
    currentPage = { content: 'BT\n/F1 11 Tf\n' };
    y = PAGE_HEIGHT - MARGIN;
  }

  function ensureSpace(height) {
    if (y - height < MARGIN) {
      newPage();
    }
  }

  function emitText(text, size, x, color = '0 0 0 rg') {
    currentPage.content += `${color}\n/F1 ${size} Tf\n${x} ${y} Td\n(${escapePdf(text)}) Tj\n0 ${-LINE_HEIGHT} Td\n`;
    y -= LINE_HEIGHT;
  }

  function emitWrapped(text, size, x, maxWidth, indent = 0) {
    const lines = wrapLine(text, maxWidth - indent);
    for (let i = 0; i < lines.length; i++) {
      ensureSpace(LINE_HEIGHT);
      const lineX = x + (i === 0 ? indent : indent + 12);
      currentPage.content += `/F1 ${size} Tf\n${lineX} ${y} Td\n(${escapePdf(lines[i])}) Tj\n`;
      y -= LINE_HEIGHT;
    }
  }

  newPage();

  for (const block of blocks) {
    switch (block.type) {
      case 'h1':
        ensureSpace(TITLE_SIZE + 10);
        y -= 10;
        emitText(block.text, TITLE_SIZE, MARGIN, '0.2 0.2 0.2 rg');
        y -= 8;
        break;
      case 'h2':
        ensureSpace(H2_SIZE + 14);
        y -= 14;
        emitText(block.text, H2_SIZE, MARGIN, '0.1 0.1 0.1 rg');
        y -= 6;
        break;
      case 'h3':
        ensureSpace(H3_SIZE + 8);
        y -= 8;
        emitText(block.text, H3_SIZE, MARGIN, '0.15 0.15 0.15 rg');
        y -= 4;
        break;
      case 'meta':
        ensureSpace(LINE_HEIGHT);
        emitText(block.text, 10, MARGIN, '0.4 0.4 0.4 rg');
        y -= 4;
        break;
      case 'quote':
        ensureSpace(LINE_HEIGHT + 8);
        y -= 4;
        emitWrapped(block.text, 11, MARGIN + 12, PAGE_WIDTH - MARGIN * 2 - 12, 0);
        y -= 4;
        break;
      case 'bullet':
        ensureSpace(LINE_HEIGHT);
        emitWrapped(`• ${block.text}`, FONT_SIZE, MARGIN, PAGE_WIDTH - MARGIN * 2, 12);
        break;
      case 'numbered':
        ensureSpace(LINE_HEIGHT);
        // Numbering handled by caller context; just indent here
        emitWrapped(block.text, FONT_SIZE, MARGIN, PAGE_WIDTH - MARGIN * 2, 18);
        break;
      case 'table-row':
        ensureSpace(LINE_HEIGHT);
        emitText(block.cells.join('  |  '), 9, MARGIN, '0.25 0.25 0.25 rg');
        break;
      case 'p':
        ensureSpace(LINE_HEIGHT);
        emitWrapped(block.text, FONT_SIZE, MARGIN, PAGE_WIDTH - MARGIN * 2);
        break;
      case 'blank':
        y -= LINE_HEIGHT * 0.5;
        break;
    }
  }

  if (currentPage) {
    currentPage.content += '\nET\n';
    currentPage.ref = addObject(currentPage.content);
    pageRefs.push(currentPage.ref);
  }

  // Catalog and tree
  const pagesObj = addObject(`<< /Type /Pages /Kids [${pageRefs.map(r => `${r} 0 R`).join(' ')}] /Count ${pageRefs.length} >>`);
  const catalogObj = addObject(`<< /Type /Catalog /Pages ${pagesObj} 0 R >>`);

  let pdf = '%PDF-1.4\n';
  const offsets = [];
  for (let i = 0; i < objects.length; i++) {
    offsets.push(pdf.length);
    pdf += `${i + 1} 0 obj\n${objects[i]}\nendobj\n`;
  }

  const xrefOffset = pdf.length;
  pdf += 'xref\n';
  pdf += `0 ${objects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';
  for (const offset of offsets) {
    pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogObj} 0 R >>\n`;
  pdf += 'startxref\n';
  pdf += `${xrefOffset}\n`;
  pdf += '%%EOF\n';

  fs.writeFileSync(OUT_PDF, pdf);
  console.log(`PDF written: ${OUT_PDF} (${pageRefs.length} pages)`);
}

buildPdf();
