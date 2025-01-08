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

# Check if unzip is installed
if ! command -v unzip &> /dev/null; then
    echo "unzip is not installed. Attempting to install it..."
    
    OS=$(uname -s)
    if [[ "$OS" == "Linux" ]]; then
        sudo apt-get update && sudo apt-get install -y unzip || { echo "Failed to install unzip. Please install it manually."; exit 1; }
    elif [[ "$OS" == "Darwin" ]]; then
        brew install unzip || { echo "Failed to install unzip. Please install it manually."; exit 1; }
    else
        echo "Automatic installation of unzip is not supported on this OS. Please install unzip manually."
        exit 1
    fi
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

# Navigate to the products folder
cd glsp-eclipse-integration/server/releng/org.eclipse.glsp.ide.repository/target/products || { echo "Could not find the products folder"; exit 1; }

# Find the zip file
ZIP_FILE=$(ls *.zip | head -n 1)
if [[ -z "$ZIP_FILE" ]]; then
    echo "No zip file found in the products folder."
    exit 1
fi

# Detect the OS and extract the appropriate zip file
OS=$(uname -s)
ARCH=$(uname -m)

case "$OS" in
    Linux)
        echo "Extracting Linux package..."
        unzip -o "*linux*.zip"
        ;;
    Darwin)
        if [[ "$ARCH" == "arm64" ]]; then
            echo "Extracting macOS ARM package..."
            unzip -o "*macosx.cocoa.aarch64*.zip"
        else
            echo "Extracting macOS x86_64 package..."
            unzip -o "*macosx.cocoa.x86_64*.zip"
        fi
        ;;
    CYGWIN*|MINGW*|MSYS*)
        echo "Extracting Windows package..."
        unzip -o "*win32*.zip"
        ;;
    *)
        echo "Unsupported OS: $OS"
        exit 1
        ;;
esac

# Find and run the Eclipse executable
ECLIPSE_EXEC=$(find . -type f \( -name "eclipse" -o -name "eclipse.exe" -o -name "Eclipse.app" \) | head -n 1)
if [[ -z "$ECLIPSE_EXEC" ]]; then
    echo "Eclipse executable not found."
    exit 1
fi

echo "Setting executable permissions on $ECLIPSE_EXEC..."
chmod +x "$ECLIPSE_EXEC"

echo "Running Eclipse..."
case "$ECLIPSE_EXEC" in
    *.app) open -a "$ECLIPSE_EXEC" ;;  # macOS
    *.exe) "$ECLIPSE_EXEC" ;;          # Windows
    *) ./"$ECLIPSE_EXEC" -import /home/fran/Desktop/ELISSUE/chromium-multiplatform-testing/test-workflow;;            # Linux
esac

echo "Eclipse has been started successfully!"
