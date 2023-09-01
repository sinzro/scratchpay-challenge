/// <reference types="Cypress"  />

import { testData as td } from "../../support/testData";

describe("Login API", () => {
	it("should return correct user data on successful login", () => {
		cy.login(td.userData.email, td.userData.password).then((response) => {
			expect(response.isOkStatusCode).to.be.true;
			expect(response.body.data.session).to.have.property("loggedIn", true);
			expect(response.body.data.session).to.have.property("userId");
			expect(response.body.data.session).to.have.property(
				"role",
				td.userData.role,
			);
		});
	});

	it("should return a token on successful login", () => {
		cy.login(td.userData.email, td.userData.password).then((response) => {
			expect(response.isOkStatusCode).to.be.true;
			expect(response.body.data.session).to.have.property("token");
			cy.wrap(response.body.data.session.token).should("not.be.null");
		});
	});

	it("should return true if user has specifc number of permissions", () => {
		cy.login(td.userData.email, td.userData.password).then((response) => {
			expect(response.isOkStatusCode).to.be.true;
			cy.wrap(response.body.data.permissions).should(
				"have.length",
				td.userData.numOfPermisions,
			);
		});
	});

	it("should return an error message if email and password params are missing", () => {
		cy.login().then((response) => {
			expect(response.isOkStatusCode).to.be.false;
			expect(response.body.data).to.have.property(
				"message",
				"Invalid login credentials",
			);
		});
	});

	it("should return an error message if email and password are incorrect", () => {
		cy.login("one", "two").then((response) => {
			expect(response.isOkStatusCode).to.be.false;
			expect(response.body.data).to.have.property(
				"message",
				"Invalid login credentials",
			);
		});
	});
});
