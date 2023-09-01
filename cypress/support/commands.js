// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import { testData as td } from "./testData";

/**
 * @param date:string - date in format of "2023-08-28T21:00:00Z"
 * @returns the first 10 letters of string date
 */
Cypress.Commands.add("formatDate", (date) => {
	return new Cypress.Promise((resolve) => {
		resolve(date.substring(0, 10));
	});
});

Cypress.Commands.add("login", (email, password) => {
	cy.request({
		method: "GET",
		url: td.URL.API_AUTH,
		qs: {
			email: email,
			password: password,
		},
		failOnStatusCode: false,
	});
});
