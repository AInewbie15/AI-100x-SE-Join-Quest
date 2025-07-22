// 合併多個 cucumber JSON 報告為一份
const fs = require('fs');

const files = [
  'reports/chess.json',
  'reports/11.json',
  'reports/order.json',
];

let merged = [];
for (const file of files) {
  if (fs.existsSync(file)) {
    const arr = JSON.parse(fs.readFileSync(file, 'utf-8'));
    merged = merged.concat(arr);
  }
}
fs.writeFileSync('reports/merged.json', JSON.stringify(merged, null, 2));
console.log('Merged report written to reports/merged.json');
