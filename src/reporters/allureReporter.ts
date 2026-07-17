import { AllureRuntime } from 'allure-js-commons';
import { CucumberJSAllureFormatter, CucumberJSAllureFormatterConfig } from 'allure-cucumberjs';
import type { IFormatterOptions } from '@cucumber/cucumber';

export default class AllureReporter extends CucumberJSAllureFormatter {
  constructor(options: IFormatterOptions) {
    const config: CucumberJSAllureFormatterConfig = {
      labels: [
        { pattern: [/@feature:(.*)/], name: 'epic' },
        { pattern: [/@severity:(.*)/], name: 'severity' },
      ],
      links: [
        {
          pattern: [/@issue=(.*)/],
          type: 'issue',
          urlTemplate: 'http://localhost:8080/issue/%s',
        },
        {
          pattern: [/@tms=(.*)/],
          type: 'tms',
          urlTemplate: 'http://localhost:8080/tms/%s',
        },
      ],
    };

    super(options, new AllureRuntime({ resultsDir: './allure-results' }), config);
  }
}
