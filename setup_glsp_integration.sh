#!/bin/bash

# Check if yarn is installed
if ! command -v yarn &> /dev/null; then
    echo "yarn is not installed. Please install yarn before proceeding."
    exit 1
fi

# Check if maven is installed
if ! command -v mvn &> /dev/null; then
    echo "maven is not installed. Please install maven before proceeding."
    exit 1
fi

# Navigate to eclipse integration folder
cd glsp-eclipse-integration || { echo "Could not find the glsp-eclipse-integration folder"; exit 1; }

# Navigate to the client folder and run yarn install
echo "Installing client dependencies..."
cd client || { echo "Could not find the glsp-eclipse-integration/client folder"; exit 1; }
yarn install

# Navigate to the server folder and run mvn clean install
echo "Building the server..."
cd ../server || { echo "Could not find the glsp-eclipse-integration/server folder"; exit 1; }
mvn clean install

# Package mvn
echo "Packaging the server..."
mvn clean package

echo "Setup completed successfully."
