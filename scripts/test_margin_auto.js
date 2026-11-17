const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
@page {
    size: A4 portrait;
    margin: 0;
}
* { box-sizing: border-box; }
body {
    margin: 0;
    padding: 0;
    font-family: 'Segoe UI', Arial, sans-serif;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
}
.page {
    width: 184mm;
    height: 277mm;
    margin: 10mm auto;
    page-break-after: always;
    page-break-inside: avoid;
    border: 1.5px solid #000;
    padding: 24px 28px;
    position: relative;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
}
.page-footer {
    position: absolute;
    bottom: 12px;
    left: 0;
    width: 100%;
    text-align: center;
    font-size: 11pt;
}
</style>
</head>
<body>
<div class="page">
    <h1 style="text-align:center;">Page 1: Direct margin on .page</h1>
    <div class="page-footer">1</div>
</div>
<div class="page">
    <h1 style="text-align:center;">Page 2: Direct margin on .page</h1>
    <div class="page-footer">2</div>
</div>
</body>
</html>`;

const htmlPath = path.join(__dirname, '../report_assets/test_margin_auto.html');
const pdfPath = path.join(__dirname, '../report_assets/test_margin_auto.pdf');
fs.writeFileSync(htmlPath, html);

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const fileUrl = `file:///${htmlPath.replace(/\\/g, '/')}`;
const cmd = `"${chromePath}" --headless=new --disable-gpu --no-sandbox --print-to-pdf="${pdfPath}" "${fileUrl}"`;
execSync(cmd);

const pdfContent = fs.readFileSync(pdfPath).toString('latin1');
const matches = [...pdfContent.matchAll(/\/Type\s*\/Page[^s]/g)];
console.log('Page count:', matches.length);
