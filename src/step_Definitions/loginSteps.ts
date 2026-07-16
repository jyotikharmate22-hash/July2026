import { Given, When, Then } from '@cucumber/cucumber';
import { LoginPage } from '../pages/LoginPage';
import * as fs from 'fs';
import * as path from 'path';

Given('User navigates to OrangeHRM Login page', async function () {
  const data = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src', 'testData', 'loginData.json'), 'utf8'));
  this.loginPage = new LoginPage(this.page);
  await this.loginPage.open(data.url);
});

When('User enters username {string}', async function (username: string) {
  await this.loginPage.enterUsername(username);
});

When('User enters password {string}', async function (password: string) {
  await this.loginPage.enterPassword(password);
});

When('User clicks Login button', async function () {
  await this.loginPage.clickLogin();
});

Then('Dashboard should be displayed', async function () {
  const ok = await this.loginPage.isDashboardDisplayed();
  if (!ok) throw new Error('Dashboard not displayed');
});
