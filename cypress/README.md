## [scratchpay challenge](https://gitlab.scratchpay.com/-/snippets/39)

This is a challenge for Scratchpay, with tests written in [Cypress](https://www.cypress.io/), using different techinques including test parameterization.
The tests for the first part of the challenge can be found [here](./e2e/app-tests/), and for the second part [here](./e2e/api-tests/).

## To run the tests:

- have Node.js installed
- clone the repo locally
- install the packages with command - **_npm i_**
- run the all tests with command - **_npm run tests-all_**
- run only the app tests with command - **_npm run tests-app_**
- run only the api tests with command - **_npm run tests-api_**

## Testing Insights

For detailed information about testing, including test challenges, reasoning and assumptions, please refer to the [Testing Insights](./testing_insights.md) file.

### Package.json scripts

```json
        // start cypress in ui mode
        "cy-ui": "npx cypress open",

        // starts the app server
        "start-server": "npm run start",

        // setting up the scripts to run tests
		"cy:set-all-tests": "npx cypress run --headless",
		"cy:set-app-tests": "npx cypress run --spec cypress/e2e/app-tests/**/* --headless",
		"cy:set-api-tests": "npx cypress run --config baseUrl=https://qa-challenge-api.scratchpay.com/api/ --spec cypress/e2e/api-tests/**/* --headless",

        // starts the server and then runs all tests in the cypress folder
		"tests-all": "npm run start-server | npm run cy:set-all-tests",

        // starts the server and then runs only the app tests
		"tests-app": "npm run start-server | npm run cy:set-app-tests",

        // runs only the api tests; there's no need to start the server for this script
		"tests-api": "npm run cy:set-api-tests"

        // open the html report; a browser must be installed
        "open-html-report": "open-cli cypress/reports/html/index.html"

```

### TODO

Add tests for the dates.js file? Usually, this is done by the dev, but if I have the time, I wouldn't mind doing it.  
Add coverage for the tests
