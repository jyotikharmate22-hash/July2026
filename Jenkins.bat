@echo off
title Playwright Automation

echo ===============================
echo Starting Automation
echo ===============================

@echo off
title Jenkins Automation

cd /d D:\July2026

echo Current Directory:
cd

echo.
echo Node Version:
node -v

echo.
echo NPM Version:
npm -v

echo.
echo Running Cucumber Tests...
call npx cucumber-js

echo.
echo Exit Code: %ERRORLEVEL%
pause