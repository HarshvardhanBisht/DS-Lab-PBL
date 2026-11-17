const fs = require('fs');
const path = require('path');

const sampleHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
@page {
    size: A4 portrait;
    margin: 10mm;
}
* { box-sizing: border-box; }
body {
    margin: 0;
    padding: 0;
    font-family: 'Segoe UI', Arial, sans-serif;
    color: #000;
    background: #fff;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
}
.page {
    width: 190mm;
    height: 275mm;
    page-break-after: always;
    page-break-inside: avoid;
    border: 1.5px solid #000;
    padding: 24px 28px;
    position: relative;
    margin: 0 auto;
}
.footer {
    position: absolute;
    bottom: 15px;
    left: 0;
    width: 100%;
    text-align: center;
    font-size: 11pt;
}
</style>
</head>
<body>
<div class="page">
    <h1 style="text-align: center;">Page 1 Test</h1>
    <div class="footer">1</div>
</div>
<div class="page">
    <h1 style="text-align: center;">Page 2 Test</h1>
    <div class="footer">2</div>
</div>
</body>
</html>`;

fs.writeFileSync(path.join(__dirname, '../report_assets/sample_test.html'), sampleHtml);
console.log('sample_test.html written successfully');
