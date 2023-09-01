/// <reference types="Cypress"  />

import { testData as td } from "../../support/testData";

describe("Business Day Route", () => {
	for (let country of [td.USA, td.CANADA]) {
		context(`check Business Day and Weekend Day for ${country}`, () => {
			it(`should return false if not a business day for ${country}`, () => {
				cy.request({
					method: "GET",
					url: `${td.URL.BD}?date=${td.WEEKEND_DATE}&country=${country}`,
				}).then((response) => {
					expect(response.isOkStatusCode).to.be.true;
					expect(response.body).to.have.property("results", false);
				});
			});

			it(`should return true if Business Day for ${country}`, () => {
				cy.request({
					method: "GET",
					url: `${td.URL.BD}?date=${td.BUSINESS_DATE}&country=${country}`,
				}).then((response) => {
					expect(response.isOkStatusCode).to.be.true;
					expect(response.body).to.have.property("results", true);
				});
			});
		});
	}

	// Every test in this context should return false, as public days are not business days
	context("check several public holidays in the US and Canada", () => {
		for (let date of td.US_PUBLIC_HOLIDAYS) {
			/*
            Tests fail for the following dates:
            2023-05-29 - Memorial Day
            2023-07-04 - Independence Day
            */

			it("should return false if public day for USA", () => {
				cy.request({
					method: "GET",
					url: `${td.URL.BD}?date=${date}&country=${td.USA}`,
				}).then((response) => {
					expect(response.isOkStatusCode).to.be.true;
					expect(response.body).to.have.property("results", false);
				});
			});
		}

		for (let date of td.CA_PUBLIC_HOLIDAYS) {
			/*
            Tests fail for the following dates:
            2023-04-07 - Good Friday
            2023-05-22 - Victoria Day
            2023-09-04 - Labour Day
            */

			it("should return false if public day for Canada", () => {
				cy.request({
					method: "GET",
					url: `${td.URL.BD}?date=${date}&country=${td.CANADA}`,
				}).then((response) => {
					expect(response.isOkStatusCode).to.be.true;
					expect(response.body).to.have.property("results", false);
				});
			});
		}
	});

	context("Check invalid inputs and missing params", () => {
		context("date param", () => {
			it("should return false for inexistent date", () => {
				cy.request({
					method: "GET",
					url: `${td.URL.BD}?date=${td.INEXISTENT_DATE}`,
				}).then((response) => {
					expect(response.isOkStatusCode).to.be.true;
					expect(response.body).to.have.property("results", false);
				});
			});

			it("should return false for incorrect format date", () => {
				cy.request({
					method: "GET",
					url: `${td.URL.BD}?date=${td.INCORRECT_FORMAT_DATE}`,
				}).then((response) => {
					expect(response.isOkStatusCode).to.be.true;
					expect(response.body).to.have.property("results", false);
				});
			});

			it("should return errorMessage for missing date param", () => {
				cy.request({
					method: "GET",
					url: `${td.URL.BD}`,
				}).then((response) => {
					expect(response.isOkStatusCode).to.be.true;
					expect(response.body).to.have.property(
						"errorMessage",
						"A valid date is required",
					);
				});
			});

			it("should return false for invalid date", () => {
				cy.request({
					method: "GET",
					url: `${td.URL.BD}?date=${td.INVALID_DATE}`,
				}).then((response) => {
					expect(response.isOkStatusCode).to.be.true;
					expect(response.body).to.have.property("results", false);
				});
			});
		});

		context("country param", () => {
			/**
			 * If an invalid code is used, it should return an error or false.
			 *
			 * As it stands, if we use the Christmas Day for the date, and with/without an US country code,
			 * it will return false, as it's not a business day.
			 *
			 * If we use instead the same Christmas Day, but with an invalid country code
			 * it will return true.
			 *
			 * I will assume that I talked with the team, and we agreed that it should indeed return null.
			 * The following tests cover this.
			 */
			it("should return null for invalid country code string when using date as holiday", () => {
				cy.request({
					method: "GET",
					url: `${td.URL.BD}?date=${td.XMAS_DAY}?country=${td.INVALID_COUNTRY_CODE_STRING}`,
				}).then((response) => {
					expect(response.isOkStatusCode).to.be.true;
					expect(response.body).to.have.property("results", null);
				});
			});

			it("should return null for invalid country code string", () => {
				cy.request({
					method: "GET",
					url: `${td.URL.BD}?date=${td.BUSINESS_DATE}?country=${td.INVALID_COUNTRY_CODE_STRING}`,
				}).then((response) => {
					expect(response.isOkStatusCode).to.be.true;
					expect(response.body).to.have.property("results", null);
				});
			});

			it("should return null for invalid country code number when using date as holiday", () => {
				cy.request({
					method: "GET",
					url: `${td.URL.BD}?date=${td.XMAS_DAY}?country=${td.INVALID_COUNTRY_CODE_NUM}`,
				}).then((response) => {
					expect(response.isOkStatusCode).to.be.true;
					expect(response.body).to.have.property("results", null);
				});
			});

			it("should return null for invalid country code number", () => {
				cy.request({
					method: "GET",
					url: `${td.URL.BD}?date=${td.BUSINESS_DATE}?country=${td.INVALID_COUNTRY_CODE_NUM}`,
				}).then((response) => {
					expect(response.isOkStatusCode).to.be.true;
					expect(response.body).to.have.property("results", null);
				});
			});

			// if no country code is specified, it will use the US country code instead
			it("should return true for missing country param", () => {
				cy.request({
					method: "GET",
					url: `${td.URL.BD}?date=${td.BUSINESS_DATE}`,
				}).then((response) => {
					expect(response.isOkStatusCode).to.be.true;
					expect(response.body).to.have.property("results", true);
				});
			});
		});
	});
});
