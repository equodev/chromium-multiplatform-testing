#!/bin/bash

# Detect OS
OS=$(uname -s)
ARCH=$(uname -m)

# Look for the Eclipse executable in the products folder
PRODUCTS_DIR="glsp-eclipse-integration/server/releng/org.eclipse.glsp.ide.repository/target/products/"
if [[ "$OS" == "Linux" ]]; then
    # Find the Eclipse executable for Linux
    ECLIPSE_EXEC=$(find "$PRODUCTS_DIR" -maxdepth 1 -type f -name "eclipse" | head -n 1)
elif [[ "$OS" == "Darwin" ]]; then
    # Find the Eclipse executable for macOS
    ECLIPSE_EXEC=$(find "$PRODUCTS_DIR" -maxdepth 1 -type d -name "Eclipse.app" | head -n 1)
elif [[ "$OS" =~ CYGWIN|MINGW|MSYS ]]; then
    # Find the Eclipse executable for Windows
    ECLIPSE_EXEC=$(find "$PRODUCTS_DIR" -maxdepth 1 -type f -name "eclipse.exe" | head -n 1)
else
    echo "Unsupported OS: $OS"
    exit 1
fi

# If the executable wasn't found, proceed with setup
if [[ -z "$ECLIPSE_EXEC" ]]; then
    echo "Eclipse executable not found. Proceeding with the full process..."
    
    # Navigate to the integration directory
    cd glsp-eclipse-integration || { echo "Could not find the glsp-eclipse-integration folder"; exit 1; }

    echo "Installing client dependencies..."
    cd client || { echo "Could not find the glsp-eclipse-integration/client folder"; exit 1; }
    yarn install

    echo "Building the server..."
    cd ../server || { echo "Could not find the glsp-eclipse-integration/server folder"; exit 1; }
    mvn clean install

    # Navigate to the products directory
    cd releng/org.eclipse.glsp.ide.repository/target/products/ || { echo "Could not find products folder"; exit 1; }
    
    echo "Looking for the appropriate package to extract..."
    # Determine the appropriate package based on OS
    case "$OS" in
        Linux)
            ZIP_FILE=$(ls *linux*.tar.gz | head -n 1)
            ;;
        Darwin)
            if [[ "$ARCH" == "arm64" ]]; then
                ZIP_FILE=$(ls *macosx.cocoa.aarch64*.tar.gz | head -n 1)
            else
                ZIP_FILE=$(ls *macosx.cocoa.x86_64*.tar.gz | head -n 1)
            fi
            ;;
        CYGWIN*|MINGW*|MSYS*|Windows)
            ZIP_FILE=$(ls *win32*.zip | head -n 1)
            ;;
        *)
            echo "Unsupported OS: $OS"
            exit 1
            ;;
    esac

    if [[ -z "$ZIP_FILE" ]]; then
        echo "No appropriate package found for your OS."
        exit 1
    fi

    echo "Extracting package: $ZIP_FILE"
    # Extract the package
    if [[ "$ZIP_FILE" == *.tar.gz ]]; then
        tar -xzf "$ZIP_FILE"
    else
        unzip -o "$ZIP_FILE"
    fi

    cd ../../../../../../ 
    # Find the newly extracted Eclipse executable
    ECLIPSE_EXEC=$(find "$PRODUCTS_DIR" -maxdepth 2 -type f \( -name "eclipse" -o -name "Eclipse.app" -o -name "eclipse.exe" \) | head -n 1)
    
    if [[ -z "$ECLIPSE_EXEC" ]]; then
        echo "Eclipse executable still not found after extraction. Exiting."
        exit 1
    fi
fi

# Ensure the executable is found before proceeding
echo "Eclipse executable found: $ECLIPSE_EXEC"
echo "Current directory: $(pwd)"

# Set workspace path
WORKSPACE_PATH=$(cd resources/workspace/ && pwd)
echo "Workspace path is: $WORKSPACE_PATH"

# Convert to Windows path if needed
if [[ "$OS" =~ CYGWIN|MINGW|MSYS|Windows ]]; then
    WORKSPACE_PATH=$(cygpath -w "$WORKSPACE_PATH")
fi

# Ensure the workspace directory has correct permissions
echo "Setting write permissions on the workspace directory..."
chmod -R u+w "$WORKSPACE_PATH"

if [[ ! -d "$WORKSPACE_PATH" ]]; then
    echo "Workspace path does not exist: $WORKSPACE_PATH"
    exit 1
fi

# Set executable permissions on Eclipse
echo "Setting executable permissions on $ECLIPSE_EXEC..."
chmod +x "$ECLIPSE_EXEC"

# Run Eclipse with the specified workspace
echo "Launching Eclipse with workspace at $WORKSPACE_PATH..."
case "$ECLIPSE_EXEC" in
    *.app) 
        # Launch Eclipse on macOS
        ABSOLUTE_EXEC=$(cd "$(dirname "$ECLIPSE_EXEC")" && pwd)/$(basename "$ECLIPSE_EXEC")
        open -a "$ABSOLUTE_EXEC" --args -nosplash -data "$WORKSPACE_PATH"
        ;;
    *.exe) 
        # Launch Eclipse on Windows
        "$ECLIPSE_EXEC" -nosplash -data "$WORKSPACE_PATH"
        ;;  
    *) 
        # Launch Eclipse on Linux
        "$ECLIPSE_EXEC" -nosplash -data "$WORKSPACE_PATH"
        ;;    
esac

echo "Eclipse has been started successfully and the project has been imported!"
