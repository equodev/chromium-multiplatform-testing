# Project Setup

First install the project dependencies by running the following command:

```sh
yarn install
```

## Initializing GLSP Submodules

Submodules are required to run GLSP on the different IDEs. Each of them are the correspondent integrations for the IDEs where the tests take place.  

```sh
git submodule update --init
```

##  Disclaimer:
The following lines will explain how to easily setup the submodules required to run our test examples. At least one of them is required to run the project. The other two will be optional. If you required more information about the GLSP projects and their integration you can check their correspondent readme inside the official GLSP Github. We simplified the setup providing a straightforward way to setup each one.

> https://github.com/eclipse-glsp/glsp

## VSCode GLSP Integration Setup

Head over to the [vscode_setup.ts](./tests/vscode_setup.ts) file and modify the vscode binary location (results var) to point to your local binary.

Open a terminal and input the following line:

```sh
code serve-web
```

This command will start a local web server that serves the web interface of your VS Code. This allows you to access VS Code through a web browser allowing the tests to interact directly with it.

During the VSCode test runs it will install the required GLSP extension to render the graphics.

<b><u>Sidenote</b></u>: Here's the required GLSP extension thats being installed during the tests and used to render the graphics:

> https://marketplace.visualstudio.com/items?itemName=Eclipse-GLSP.workflow-web-extension-demo


Then proceed import the glsp-vscode-integration folder.

Run the following command to install its dependencies.

```sh
yarn install
```

> To verify the installation was successfull open the example1.wf file within the example/workspace folder.

## Eclipse Theia GLSP Integration setup

<b><u>NOTE</u>: The Theia example can be both run inside the Theia IDE and VSCode since it mounts the IDE software on a localhost same as the previous VSCode example.</b>

Open the glsp-theia-integration submodule folder and run the following line to install its dependencies:

```sh
yarn install
```

Then run the following command to initialize the project and start the application:

```sh
yarn start
```

> By default the application will run on the <b>localhost:3000</b> port.

Open the `example1.wf` to assert GLSP is working as expected.


## Eclipse GLSP Integration setup
Inside the glsp-eclipse-integration sudmodule, switch to the client folder and run the following command to install the client dependencies:

```sh
yarn install
```

Then head over to the server folder and run the following command:

```sh
mvn clean install
```

Open Eclipse and import the following projects:

| Projects                                                   
| -------------------------------------------------------|
| - server/plugins/org.eclipse.glsp.ide.editor
| - server/example/org.eclipse.glsp.ide.workflow.editor
| - server/releng/org.eclipse.glsp.ide.releng.target

Proceed with the following:

- Open `server/releng/org.eclipse.glsp.ide.releng.target/xxxxx.target`

- Wait for all dependencies to be downloaded and then click on `Reload target platform`

- Start an Eclipse Application WorkflowEditor.launch

- Import server/example/runtime/test

- Open `example.wf` and it should be displayed

### Add debugging port

Inside Eclipse head over to `Run < Run Configuration < Arguments < VM Arguments` and add the following line:

```sh
-Dchromium_remote_debugging_port=8888
```

/home/fran/Desktop/glsp/glsp-eclipse-integration/server/

mvn clean package

