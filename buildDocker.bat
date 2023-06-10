@echo off

REM Check if the image exists
docker inspect api_gateway > nul 2>&1
if %errorlevel% equ 0 (
    REM Delete the existing image
    docker rmi api_gateway
)

REM Build the image
docker build -t api_gateway .

REM Check if the image was created
echo Current images:
docker images
