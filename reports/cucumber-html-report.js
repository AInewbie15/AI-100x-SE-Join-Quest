const reporter = require('cucumber-html-reporter');

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
