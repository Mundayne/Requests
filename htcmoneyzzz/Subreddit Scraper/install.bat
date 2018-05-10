@echo off

ECHO node bot.js > run.bat

CALL npm install discord.js

CALL npm install raw.js

/b "" cmd /c del "%~f0"&exit /b
