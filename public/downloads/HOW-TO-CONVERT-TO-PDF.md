# How to Convert the Playbook to PDF

The playbook is provided as:
- `ai-client-acquisition-playbook.md` — Markdown source
- `ai-client-acquisition-playbook.txt` — Plain text source

Because this environment does not include a PDF renderer, use one of the methods below to generate the final PDF.

## Option 1: Pandoc (recommended)

Install [Pandoc](https://pandoc.org/installing.html), then run:

```bash
pandoc ai-client-acquisition-playbook.md \
  -o ai-client-acquisition-playbook.pdf \
  --pdf-engine=xelatex \
  -V geometry:margin=1in \
  --toc \
  --metadata title="AI Client Acquisition Playbook"
```

If you do not have LaTeX installed, use the built-in HTML engine:

```bash
pandoc ai-client-acquisition-playbook.md \
  -o ai-client-acquisition-playbook.pdf \
  --pdf-engine=weasyprint
```

## Option 2: VS Code / Markdown PDF extension

1. Open `ai-client-acquisition-playbook.md` in VS Code.
2. Install the **Markdown PDF** extension.
3. Open the command palette and run `Markdown PDF: Export (pdf)`.

## Option 3: Any Markdown-to-PDF service

Upload the `.md` file to any of these:
- [md2pdf.netlify.app](https://md2pdf.netlify.app)
- [pandoc online](https://pandoc.org/try/)
- Google Docs (import the `.txt` file, then export as PDF)

## Option 4: Node script with Playwright or Puppeteer

If you want to generate the PDF as part of the build pipeline, install one of these packages:

```bash
npm install puppeteer
```

Then run a script like:

```js
const puppeteer = require('puppeteer');
const fs = require('fs');
const markdownIt = require('markdown-it');

(async () => {
  const md = fs.readFileSync('ai-client-acquisition-playbook.md', 'utf8');
  const html = new markdownIt().render(md);
  const styled = `<style>body{font-family:system-ui,sans-serif;max-width:700px;margin:40px auto;line-height:1.6;color:#111;}h1,h2,h3{color:#0a0a0f;}table{border-collapse:collapse;width:100%;}th,td{border:1px solid #ddd;padding:8px;text-align:left;}</style>${html}`;
  fs.writeFileSync('playbook-temp.html', styled);
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('file://' + __dirname + '/playbook-temp.html', { waitUntil: 'networkidle0' });
  await page.pdf({ path: 'ai-client-acquisition-playbook.pdf', format: 'Letter', printBackground: true });
  await browser.close();
  fs.unlinkSync('playbook-temp.html');
})();
```

## Naming Convention

The landing page looks for the file at:

```
/downloads/ai-client-acquisition-playbook.pdf
```

After generating the PDF, place it at `public/downloads/ai-client-acquisition-playbook.pdf` so Next.js serves it from `/downloads/ai-client-acquisition-playbook.pdf`.

Until the PDF is generated, the landing page will fall back to offering the `.md` and `.txt` downloads.
