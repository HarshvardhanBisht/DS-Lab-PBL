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
.page-container {
    width: 210mm;
    height: 297mm;
    page-break-after: always;
    page-break-inside: avoid;
    padding: 10mm 14mm;
    box-sizing: border-box;
}
.page {
    width: 100%;
    height: 100%;
    border: 1.5px solid #000;
    padding: 24px 28px;
    position: relative;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
}
.page-footer {
    position: absolute;
    bottom: 14px;
    left: 0;
    width: 100%;
    text-align: center;
    font-size: 11pt;
}
</style>
</head>
<body>
<div class="page-container">
    <div class="page">
        <h1 style="text-align:center;">Page 1 Test (No Browser Headers)</h1>
        <div class="page-footer">1</div>
    </div>
</div>
<div class="page-container">
    <div class="page">
        <h1 style="text-align:center;">Page 2 Test (No Browser Headers)</h1>
        <div class="page-footer">2</div>
    </div>
</div>
</body>
</html>`;

const htmlPath = path.join(__dirname, '../report_assets/test_no_headers.html');
const pdfPath = path.join(__dirname, '../report_assets/test_no_headers.pdf');
fs.writeFileSync(htmlPath, html);

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const fileUrl = `file:///${htmlPath.replace(/\\/g, '/')}`;
const cmd = `"${chromePath}" --headless=new --disable-gpu --no-sandbox --print-to-pdf="${pdfPath}" "${fileUrl}"`;
execSync(cmd);

const pdfContent = fs.readFileSync(pdfPath).toString('latin1');
const matches = [...pdfContent.matchAll(/\/Type\s*\/Page[^s]/g)];
console.log('Page count:', matches.length);
console.log('Contains test_no_headers.html in text stream?', pdfContent.includes('/Title (test_no_headers.html)'));
