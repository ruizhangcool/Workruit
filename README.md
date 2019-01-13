Before we start processing the code., we have to do the below steps to configure the codebase
 
# Prerequisites : #

Install below softwares

* Node.js v0.10.x+
* npm (which comes bundled with Node) v2.1.0+
* git

You can check if you have Node and npm installed by typing:

```
#!javascript

node --version && npm --version
```

You can check if you have Git installed by typing:


```
#!javascript

git --version
```

# Install the Yeoman toolset #
Once you’ve got Node installed, install the Yeoman toolset:

```
#!javascript

npm install --global yo bower grunt-cli
```
## Install a Yeoman generator ##
In a traditional web development workflow, you would need to spend a lot of time setting up boilerplate code for your webapp, downloading dependencies, and manually creating your web folder structure. Yeoman generators to the rescue! Let's install a generator for AngularJS projects.


```
#!javascript

npm install --global generator-angular@0.9.2
```

Select **Install Generator** and Hit **Enter**


Now we have the required softwares installed.

=====================================================================

For the initial project configuration please follow the below steps, As we have project is in repo we dont need to do the below steps.
Below are the steps to configure the project

1. Clone the project from bitbucket 

2. Name the directory as **workruit** 

3. Goto command prompt and goto the cloned directory(workruit) 

4. Now type **yo** - 
If you have a few generators installed, you'll be able to interactively choose from them. Highlight Run the Angular generator. Hit enter to run the generator.

5. . After this step it will start asking for the project related requirements
```
#!javascript

* Would you like to use saas - NO
* Which modules would you like to install - Hit enter
```
=====================================================================

Install libraries 
```
#!javascript

bower install & npm install
```

---  Done, Project Configured

=====================================================================

### Now Start the server ###
* Open command prompt 

* Goto Workruit directory

* HIt the command **grunt serve**

You we see the brower automatically open and running the web application by default the server will run on 
**localhost:9000**


**Note :** You don't need to restart or copy the files changes, the project is configured to work as a reload 
i.e., change the file and see the change on the browser

======================================================================

Tesing commands :

```
#!javascript

grunt test
```

======================================================================

Production Command :

Building code for production deployment 

```
#!javascript

grunt
```

Testing the production generated code before we deploy to the production

```
#!javascript

grunt serve:dist
```