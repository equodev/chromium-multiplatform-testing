# Project Setup

First install the project dependencies by running the following command:

```sh
yarn install
```

Initialiing 

Initialize Git Submodule
Git Submodule contains all the dependencies required to run the GLSP project in each IDE.

git submodule update --init

Note:
The following lines will exaplain how to easily setup the submodules to run our test examples. If you required more information about the projects and their integratio you can check their readme.

VSCode GLSP Integration setup

With VSCode installed on your machine open a terminal and the following line

code serve-web

Your terminal will output a localhost link with a token you have to access to download the VSCode server to run it on your browser.

Then proceed to install the Workflow GLSP Example extension
https://marketplace.visualstudio.com/items?itemName=Eclipse-GLSP.workflow-web-extension-demo

Import the glsp-vscode-integration folder

Run the following command to install its dependencies

yarn install

To verify the installation was successfull open the example1.wf file within the example/workspace folder.


Eclipse Theia GLSP Integration setup

NOTE: The Theia example can be both run inside the Theia IDE and VSCode since it mounts the software on a localhost same as the previous VSCode example.

Open the glsp-theia-integration submodule folder and run the following line to install its dependencies

yarn install

Then run the following command to initialize the project and start the application

yarn start

By default the application will run on the localhost:3000 port

You can open the example1.wf to assert its working as expected


GLSP Eclipse Integration setup

Inside the glsp-eclipse-integration sudmodule, switch to the client folder and run the following command to install the client dependencies

yarn install

Then proceed to do the same with the server folder.

mvn clean install

Open Eclipse and import the following

server/plugins/org.eclipse.glsp.ide.editor
server/example/org.eclipse.glsp.ide.workflow.editor
server/releng/org.eclipse.glsp.ide.releng.target

Open server/releng/org.eclipse.glsp.ide.releng.target/xxxxx.target

Wait for all dependencies to be downloaded and then click on Reload target platform

Start an Eclipse Application WorkflowEditor.launch

Import server/example/runtime/test

Open example.wf and it should be displayed

You need to add the following line in the 
-Dchromium_remote_debugging_port=8888







