/// <reference types="Cypress"  />

import { testData as td } from "../../support/testData";

describe("Clinics API", () => {
	context("user is not logged in", () => {
		it("should prevent access to clinics endpoint", () => {
			cy.request({
				method: "GET",
				url: td.URL.API_CLINICS,
				failOnStatusCode: false,
			}).then((response) => {
				expect(response.isOkStatusCode).to.be.false;
				expect(response.body.data).to.have.property(
					"message",
					"You need to be authorized for this action.",
				);
			});
		});

		it("should prevent search for clinic by terms", () => {
			cy.request({
				method: "GET",
				url: `${td.URL.API_CLINICS}?term=${td.clinicData.veterinary}`,
				failOnStatusCode: false,
			}).then((response) => {
				expect(response.isOkStatusCode).to.be.false;
				expect(response.body.data).to.have.property(
					"message",
					"You need to be authorized for this action.",
				);
			});
		});

		it("should prevent search for clinics emails", () => {
			cy.request({
				method: "GET",
				url: `${td.URL.API_CLINICS}/1/emails`,
				failOnStatusCode: false,
			}).then((response) => {
				expect(response.isOkStatusCode).to.be.false;
				expect(response.body.data).to.have.property(
					"message",
					"You need to be authorized for this action.",
				);
			});
		});

		/*
			In a team environment, I would ask the team (or be redirected to someone that can help for this) for docs and info on how this server works. I would need to see what endpoints are on this server and how they're used.
			
			But for the purpose of this challenge, I went ahead with exploratory testing.
			Going to https://qa-challenge-api.scratchpay.com/, we get the name of the api server - Action Hero Server.
			It has two sections that are empty - This Server and Actions on This Server. So, no info or link to some docs.
			Doing a GET request on https://qa-challenge-api.scratchpay.com/, we get a bunch of data, including some info about
			two server actions - /api/status and /api/showDocumentation.
			/api/status endpoint works, but  /api/showDocumentation throws "error": "unknown action or invalid apiVersion".
			I even tried /api/showDocumentation?apiVersion(taken from the same data as the two actions) with different values,but the result was the same.
			
			Now, another question would be if this data with actions should be accessible via a normal get(logged in or not).
			I'm sure that this could be answered by the team.
		 */
		it("should allow access to the showDocumentation endpoint", () => {
			cy.request({
				method: "GET",
				url: td.URL.API_SHOW_DOCUMENTATION,
				failOnStatusCode: false,
			}).then((response) => {
				expect(response.isOkStatusCode).to.be.true;
			});
		});

		it("should allow access to the status endpoint", () => {
			cy.request({
				method: "GET",
				url: td.URL.API_STATUS,
				failOnStatusCode: false,
			}).then((response) => {
				expect(response.isOkStatusCode).to.be.true;
			});
		});
	});

	context("user is logged in", () => {
		let auth_token;

		// login once before all tests
		before(() => {
			cy.login(td.userData.email, td.userData.password).then((response) => {
				expect(response.isOkStatusCode).to.be.true;
				expect(response.body.data.session).to.have.property("token");
				auth_token = response.body.data.session.token;
			});
		});

		it("should allow access to the status endpoint", () => {
			cy.request({
				method: "GET",
				url: `${td.URL.API_STATUS}`,
				headers: {
					Authorization: `Bearer ${auth_token}`,
				},
				failOnStatusCode: false,
			}).then((response) => {
				expect(response.isOkStatusCode).to.be.true;
			});
		});

		it("should prevent access to clinic 2 emails", () => {
			cy.request({
				method: "GET",
				url: `${td.URL.API_CLINICS}/2/emails`,
				headers: {
					Authorization: `Bearer ${auth_token}`,
				},
				failOnStatusCode: false,
			}).then((response) => {
				expect(response.isOkStatusCode).to.be.false;
				expect(response.body.data).to.have.property(
					"error",
					"Error: User does not have permissions",
				);
			});
		});

		it("should return error if searching without term", () => {
			cy.request({
				method: "GET",
				url: `${td.URL.API_CLINICS}`,
				headers: {
					Authorization: `Bearer ${auth_token}`,
				},
				failOnStatusCode: false,
			}).then((response) => {
				expect(response.isOkStatusCode).to.be.false;
				expect(response.body).to.have.property(
					"error",
					"term is a required parameter for this action",
				);
			});
		});

		it("should return two clinics when searching for a veterinary clinic", () => {
			cy.request({
				method: "GET",
				url: `${td.URL.API_CLINICS}?term=${td.clinicData.veterinary}`,
				headers: {
					Authorization: `Bearer ${auth_token}`,
				},
				failOnStatusCode: false,
			}).then((response) => {
				expect(response.isOkStatusCode).to.be.true;
				expect(response.body.data).to.have.length(2);
				expect(response.body.data).to.deep.equal(
					td.clinicData.veterinaryClinics,
				);
			});
		});

		it("should return a list of all the clinics", () => {
			cy.request({
				method: "GET",
				url: `${td.URL.API_CLINICS}?term=${td.clinicData.all}`,
				headers: {
					Authorization: `Bearer ${auth_token}`,
				},
				failOnStatusCode: false,
			}).then((response) => {
				expect(response.isOkStatusCode).to.be.true;
				expect(response.body.data).to.have.length(4);
				expect(response.body.data).to.deep.equal(td.clinicData.allClinics);
			});
		});

		it("should be able to access clinic 1 emails", () => {
			cy.request({
				method: "GET",
				url: `${td.URL.API_CLINICS}/1/emails`,
				headers: {
					Authorization: `Bearer ${auth_token}`,
				},
				failOnStatusCode: false,
			}).then((response) => {
				expect(response.isOkStatusCode).to.be.true;
				expect(response.body.data.users).to.have.length(2);
				expect(response.body.data.users).to.deep.equal(
					td.clinicData.clinic1Users,
				);
			});
		});

		it("should prevent access to clinic 7 emails", () => {
			cy.request({
				method: "GET",
				url: `${td.URL.API_CLINICS}/7/emails`,
				headers: {
					Authorization: `Bearer ${auth_token}`,
				},
				failOnStatusCode: false,
			}).then((response) => {
				expect(response.isOkStatusCode).to.be.false;
				expect(response.body.data).to.have.property(
					"error",
					"Error: User does not have permissions",
				);
			});
		});

		it("should prevent access to clinic 8 emails", () => {
			cy.request({
				method: "GET",
				url: `${td.URL.API_CLINICS}/8/emails`,
				headers: {
					Authorization: `Bearer ${auth_token}`,
				},
				failOnStatusCode: false,
			}).then((response) => {
				expect(response.isOkStatusCode).to.be.false;
				expect(response.body.data).to.have.property(
					"error",
					"Error: User does not have permissions",
				);
			});
		});
	});
});
