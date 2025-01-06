# Project Setup

To set up the project, start by installing the necessary dependencies using the following command in the root folder:

```sh
yarn install
```

## Initializing GLSP Submodules

GLSP (Graphical Language Server Platform) submodules are required to run GLSP on different IDEs. Each submodule corresponds to a specific IDE integration for testing purposes. Initialize the submodules by executing:

```sh
git submodule update --init
```

##  Disclaimer:
The following sections explain how to set up the required submodules to run our test examples. At least one submodule must be set up to run the project, while the other two are optional. For more detailed information about GLSP projects and their integrations, please refer to the respective README files in the official [GLSP GitHub repository](https://github.com/eclipse-glsp/glsp). We have provided a simplified setup process to streamline the configuration of each submodule. 


## Before running the tests
Before running the tests, you need to modify the IDE variable in the `example.spec.ts` file located in the tests folder. This variable allows you to select the IDE on which the tests will run.

It is essential to have the latest release of [Visual Studio Code](https://code.visualstudio.com/) installed, as it is required to run the `code-server-web` command effectively. Keeping your VS Code installation up to date ensures compatibility with the latest features, security patches, and extensions.

## VSCode GLSP Integration Setup

1. Navigate to the glsp-vscode-integration folder and install its dependencies by running:

```sh
yarn install
```

2. Open the [vscode_setup.ts](./tests/vscode_setup.ts) file and update the vscode binary location (specified in the results variable) to point to your local VS Code binary file and modify the vscode binary location (results var) to point to your local vscode binary.

3. In a terminal, start the VS Code web server by running:

```sh
code serve-web
```

This command launches a local web server that serves the web interface of your VS Code, allowing you to access VS Code through a web browser and enabling the tests to interact directly with it. During the VS Code test runs, the required GLSP extension will be installed to render the graphics.

<b><u>Sidenote</b></u>: [GLSP extension](https://marketplace.visualstudio.com/items?itemName=Eclipse-GLSP.workflow-web-extension-demo) is installed during the tests to render the graphics:

4. Import the glsp-vscode-integration folder as needed.

After completing these steps, you should be able to run the example tests.

> To verify the installation was successful, open the `example1.wf` file within the example/workspace folder.

## Eclipse Theia GLSP Integration setup

<b><u>NOTE</u>: The Theia example can be run inside both the Theia IDE and VS Code, as it mounts the IDE software on a localhost, similar to the previous VS Code example.</b>

1. Open the glsp-theia-integration submodule folder and install its dependencies by running:

```sh
yarn browser install
```

2. Start the application by running:

```sh
yarn browser start
```

> By default the application will run on the <b>localhost:3000</b> port.

3. Open the `example1.wf` file to confirm that GLSP is working as expected.


## Eclipse GLSP Integration setup
A script is provided to streamline the Eclipse setup process. In the parent `chromium-multiplatform-testing` folder, execute the following command in a bash terminal to install all dependencies:

```sh
./setup_glsp_integration.sh
```

### Quick note

If you are having trouble running the Eclipse app using MacOS or a Unix based system, try the following command to enable extended attributes in case the app seems to be damaged.

```sh
xattr -cr /path/to/Eclipse.app
```

### Add debugging port

To add a debugging port in Eclipse, follow these steps:

1. Navigate to Run > Run Configuration > Arguments > VM Arguments.
2. Add the following line to the VM arguments:

```sh
-Dchromium_remote_debugging_port=8888
```



