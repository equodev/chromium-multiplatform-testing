# Detect OS
OS=$(uname -s)
ARCH=$(uname -m)

# Navigate to the products folder
cd glsp-eclipse-integration/server/releng/org.eclipse.glsp.ide.repository/target/products/editor || {
    echo "Could not find the products folder. Proceeding with the full script."
    # Proceed with the full script if products folder is not found
    PRODUCTS_FOUND=false
    # Continue with the script after setting PRODUCTS_FOUND to false
}

# If the products folder was found, execute the block to find and launch Eclipse
if [[ "$PRODUCTS_FOUND" == false ]]; then
    # Proceed with the full script if Eclipse does not exist

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
    cd ../../

fi
    echo "Products folder found, checking for Eclipse executable..."

    cd glsp-eclipse-integration/server/releng/org.eclipse.glsp.ide.repository/target/products/editor
    # If Eclipse executable exists, launch it
    if [[ "$OS" == "Linux" ]]; then
        ECLIPSE_EXEC=$(find . -type f -name "eclipse" | head -n 1)
    elif [[ "$OS" == "Darwin" ]]; then
        ECLIPSE_EXEC=$(find . -type f -name "Eclipse.app" | head -n 1)
    elif [[ "$OS" =~ CYGWIN|MINGW|MSYS ]]; then
        ECLIPSE_EXEC=$(find . -type f -name "eclipse.exe" | head -n 1)
    else
        echo "Unsupported OS: $OS"
        exit 1
    fi

    # Check if Eclipse executable is found
    if [[ -z "$ECLIPSE_EXEC" ]]; then
        echo "No Eclipse executable found. Proceeding with the full process."
    else
        echo "Eclipse executable found: $ECLIPSE_EXEC"
    fi
    echo "Eclipse executable found, launching with workspace..."

    # Log the current directory before setting the workspace path
    echo "Current directory: $(pwd)"

    # Directly use the relative path to the workspace
    WORKSPACE_PATH=$(cd ../../../../../../../resources/workspace/ && pwd)

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
