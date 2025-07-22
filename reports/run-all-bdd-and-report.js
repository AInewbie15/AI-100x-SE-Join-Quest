const { execSync } = require('child_process');
const reporter = require('cucumber-html-reporter');

// 執行三個 BDD 測試並產生 JSON 報告
console.log('Running: npm run chess');
execSync('npm run chess', { stdio: 'inherit' });
console.log('Running: npm run 11');
execSync('npm run 11', { stdio: 'inherit' });
console.log('Running: npm run order');
execSync('npm run order', { stdio: 'inherit' });

// 合併 JSON 報告
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

// 產生 HTML 報告
reporter.generate({
  theme: 'bootstrap',
  jsonFile: 'reports/merged.json',
  output: 'reports/merged.html',
  reportSuiteAsScenarios: true,
  launchReport: false,
  name: 'All Features',
  brandTitle: 'Cucumber BDD 測試報告',
  storeScreenshots: false
});
console.log('HTML report generated at reports/merged.html');
