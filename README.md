# Withings Dropshipment Api Code Snippets

This collection of Javascript code snippets was created to help you integrate Withings Dropshipment APIs.

**Required :**

 - NodeJS


### File Organization

Code snippets are organized in the following way:

`wsname / action / action.js`

Every action file is associated with a test file in the same directory.

### Usage

After cloning the repo, install the npm packages with `npm install`

**Prerequisite** :

Before using a snippet : 

- Change the `CLIENT_ID` and `CLIENT_SECRET` constants in the `config.js` file with your credentials. 
- Change the `API_URL` constant with the correct endpoint for your case (by default it will it will use the Public API endpoint: `https://wbsapi.withings.net/`).

Then, uncomment the main function of the action file you're interested in and launch it with `node filename.js`

### Tests

To launch tests use : `npx jest`

**Warning** : tests won't run properly when the `main()` function of the file is uncommented.

### Changelog

- v1 : First version of the code snippets
