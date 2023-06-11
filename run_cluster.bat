@echo off

REM Check if the network "memories" exists
docker network inspect memories > nul 2>&1
if %errorlevel% equ 0 (
    REM Delete the existing network "memories"
    docker network rm memories
)

REM Create the network "memories"
docker network create memories

REM Remove the existing containers
docker rm -f ms_authservice
docker rm -f api_gateway

REM Start ms_authservice container
docker run -d --network=memories --name=ms_authservice -p 2902:4000 ms_authservice:latest

REM Wait for ms_authservice container to be fully running (adjust the duration as needed)
echo Waiting for ms_authservice to be fully running...
timeout /t 30 >nul

REM Start api_gateway container
docker run -d --network=memories --name=api_gateway -p 3000:3000 -e ENV=production api_gateway:latest

echo Cluster started successfully!
