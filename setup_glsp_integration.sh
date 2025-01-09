# Detect OS
OS=$(uname -s)
ARCH=$(uname -m)

# Look for the Eclipse executable in the products folder
PRODUCTS_DIR="glsp-eclipse-integration/server/releng/org.eclipse.glsp.ide.repository/target/products/"

if [[ "$OS" == "Linux" ]]; then
    ECLIPSE_EXEC=$(find "$PRODUCTS_DIR" -maxdepth 1 -type f -name "eclipse" | head -n 1)
elif [[ "$OS" == "Darwin" ]]; then
    ECLIPSE_EXEC=$(find "$PRODUCTS_DIR" -maxdepth 1 -type f -name "Eclipse.app" | head -n 1)
elif [[ "$OS" =~ CYGWIN|MINGW|MSYS ]]; then
    ECLIPSE_EXEC=$(find "$PRODUCTS_DIR" -maxdepth 1 -type f -name "eclipse.exe" | head -n 1)
else
    echo "Unsupported OS: $OS"
    exit 1
fi

# If the executable wasn't found, proceed with setup
if [[ -z "$ECLIPSE_EXEC" ]]; then
    echo "Eclipse executable not found. Proceeding with the full process..."
    
    # Navigate to the eclipse integration folder
    cd glsp-eclipse-integration || { echo "Could not find the glsp-eclipse-integration folder"; exit 1; }

    # Navigate to the client folder and run yarn install
    echo "Installing client dependencies..."
    cd client || { echo "Could not find the glsp-eclipse-integration/client folder"; exit 1; }
    yarn install

    # Navigate to the server folder and run mvn clean install
    echo "Building the server..."
    cd ../server || { echo "Could not find the glsp-eclipse-integration/server folder"; exit 1; }
    mvn clean install

    # Navigate to the server folder and unzip the appropriate package
    cd releng/org.eclipse.glsp.ide.repository/target/products/
    
    echo "Looking for the appropriate package to unzip..."
    case "$OS" in
        Linux)
            ZIP_FILE=$(ls *linux*.zip | head -n 1)
            ;;
        Darwin)
            if [[ "$ARCH" == "arm64" ]]; then
                ZIP_FILE=$(ls *macosx.cocoa.aarch64*.zip | head -n 1)
            else
                ZIP_FILE=$(ls *macosx.cocoa.x86_64*.zip | head -n 1)
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

    # Check if a zip file was found
    if [[ -z "$ZIP_FILE" ]]; then
        echo "No appropriate zip file found for your OS."
        exit 1
    fi

    echo "Extracting package: $ZIP_FILE"
    unzip -o "$ZIP_FILE"

    # Recheck for the executable after extraction
    cd ../../../../../../ 
    ECLIPSE_EXEC=$(find "$PRODUCTS_DIR" -maxdepth 1 -type f \( -name "eclipse" -o -name "Eclipse.app" -o -name "eclipse.exe" \) | head -n 1)
    
fi

echo $(pwd) 
# Ensure the executable is found before proceeding
if [[ -z "$ECLIPSE_EXEC" ]]; then
    echo "Eclipse executable still not found. Exiting."
    exit 1
fi

# Log the current directory before setting the workspace path
echo "Eclipse executable found: $ECLIPSE_EXEC"
echo "Current directory: $(pwd)"

# Directly use the relative path to the workspace
WORKSPACE_PATH=$(cd resources/workspace/ && pwd)
echo "Workspace path is: $WORKSPACE_PATH"

# Convert to Windows path if needed
if [[ "$OS" =~ CYGWIN|MINGW|MSYS|Windows ]]; then
    WORKSPACE_PATH=$(cygpath -w "$WORKSPACE_PATH")
fi

# Ensure the workspace directory has correct permissions
echo "Setting write permissions on the workspace directory..."
chmod -R u+w "$WORKSPACE_PATH"

# Check if the workspace path exists
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
    *.app) open -a "$ECLIPSE_EXEC" --args -nosplash -data "$WORKSPACE_PATH" ;;  # macOS
    *.exe) "$ECLIPSE_EXEC" -nosplash -data "$WORKSPACE_PATH" ;;                 # Windows
    *) ./"$ECLIPSE_EXEC" -nosplash -data "$WORKSPACE_PATH" ;;                   # Linux
esac

echo "Eclipse has been started successfully!"
