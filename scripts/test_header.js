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
    padding: 10mm;
    font-family: Arial, sans-serif;
}
.page {
    width: 190mm;
    height: 277mm;
    page-break-after: always;
    border: 1.5px solid #000;
    padding: 20px;
    position: relative;
    box-sizing: border-box;
}
.footer {
    position: absolute;
    bottom: 15px;
    left: 0;
    width: 100%;
    text-align: center;
}
</style>
</head>
<body>
<div class="page">
    <h1>Page 1 with margin 0</h1>
    <div class="footer">1</div>
</div>
</body>
</html>`;

const htmlPath = path.join(__dirname, '../report_assets/test_margin0.html');
const pdfPath = path.join(__dirname, '../report_assets/test_margin0.pdf');
fs.writeFileSync(htmlPath, html);

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const fileUrl = `file:///${htmlPath.replace(/\\/g, '/')}`;
const cmd = `"${chromePath}" --headless=new --disable-gpu --no-sandbox --print-to-pdf="${pdfPath}" "${fileUrl}"`;
execSync(cmd);

const pdfContent = fs.readFileSync(pdfPath).toString('latin1');
console.log('Contains test_margin0.html?', pdfContent.includes('test_margin0.html'));
console.log('Contains date/time stamp like PM/AM?', /1[0-2]:[0-5][0-9]\s*(AM|PM)/i.test(pdfContent));
