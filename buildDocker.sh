#!/bin/bash

# Check if the image exists
if [[ "$(docker images -q api_gateway 2> /dev/null)" != "" ]]; then
    # Delete the existing image
    docker rmi api_gateway
fi

# Build the image
docker build -t api_gateway .

# Print the "Current images: " and list all the images
echo "Current images: "
docker images
