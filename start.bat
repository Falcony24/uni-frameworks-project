@echo off
cd /d "%~dp0"

echo Startowanie backendu...
cd back
start cmd /k "npm run serve"

timeout /t 5 /nobreak

echo Startowanie frontendu...
cd ../front
start cmd /k "npm start"

echo Aplikacja została uruchomiona!
exit
