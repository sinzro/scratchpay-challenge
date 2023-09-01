/// <reference types="Cypress"  />

import { testData as td } from "../../support/testData";

/*
	It seems that this api doesn't return to correct settlementDate. 
	For example, for initialDate = 2023-08-28 (which is a Monday), with a delay of 1, it returns businessDate = 2023-08-27, which is one day behind and on a Sunday. The same initialDate, with a delay of 2, it returns businessDate = 2023-08-28, which is the same date as the initialDate.

	To properly test this, I would need to better understand how this api should work. This means that I would need to talk with the team and business in order to do so.

	I also have some concerns about the delay being negative or zero. I can't see it being negative, as a settlement date can't be behind the initialDate.
	For the delay to be zero, it may be possible to have the settlementDate in the same day as InitialDate. For example, you order something in the morning, and you'll get it by the end of the day.
	But if you order it later in the day, you'll have to wait at least until the next business date.
	I think that a better (and safer) option would be to have the delay at least 1.

	I would definetly need to talk this with the team and with the business to better understand what they're expecting and come to an agreement.
	Other questions would be:
		- from the code, I got the impression that delay is an integer. Can it be something else like float?
		- what is the maximum delay that should we use? Is it 30 days? 60 days? 365 days or more?  

	For the purpose of this exercise, I will make the following assumptions:
		- the delay will be added directly to the initialDate, taking into account weekends and holidays. So, if the initialDate is 2023-08-28 (Monday), and delay is 1, then businessDate is 2023-08-29 (Tuesday).
		- the delay can't be negative or zero, and an error should be triggered if these values are used.
		- the delay should be an integer
		- the delay should be 365 days max

*/

describe("Settlement Date Route", () => {
	context(
		"check settlementDate for when initialDate is during week, weekend or holiday",
		() => {
			it("should return settlementDate for initialDate during week and no weekend in the delay range", () => {
				cy.request({
					method: "GET",
					url: `${td.URL.SD}?initialDate=${td.BUSINESS_DATE}&delay=${td.delay.one}`,
				}).then((response) => {
					expect(response.isOkStatusCode).to.be.true;

					const expectedDate = "2023-08-31";
					cy.formatDate(response.body.results.businessDate).then(
						(actualDate) => {
							expect(actualDate).to.eq(expectedDate);
						},
					);
				});
			});

			it("should return settlementDate when there's a weekend in the delay range", () => {
				cy.request({
					method: "GET",
					url: `${td.URL.SD}?initialDate=${td.BUSINESS_DATE}&delay=${td.delay.three}`,
				}).then((response) => {
					expect(response.isOkStatusCode).to.be.true;

					const expectedDate = "2023-09-04";
					cy.formatDate(response.body.results.businessDate).then(
						(actualDate) => {
							expect(actualDate).to.eq(expectedDate);
						},
					);
				});
			});

			it("should return settlementDate for initialDate during weekend", () => {
				cy.request({
					method: "GET",
					url: `${td.URL.SD}?initialDate=${td.WEEKEND_DATE}&delay=${td.delay.one}`,
				}).then((response) => {
					expect(response.isOkStatusCode).to.be.true;

					const expectedDate = "2023-09-04";
					cy.formatDate(response.body.results.businessDate).then(
						(actualDate) => {
							expect(actualDate).to.eq(expectedDate);
						},
					);
				});
			});

			it("should return settlementDate for initialDate during holiday in US", () => {
				cy.request({
					method: "GET",
					url: `${td.URL.SD}?initialDate=${td.HOLIDAY_DATE}&delay=${td.delay.one}`,
				}).then((response) => {
					expect(response.isOkStatusCode).to.be.true;

					const expectedDate = "2023-12-26";
					cy.formatDate(response.body.results.businessDate).then(
						(actualDate) => {
							expect(actualDate).to.eq(expectedDate);
						},
					);
				});
			});

			it("should return settlementDate for initialDate during holiday in CA", () => {
				cy.request({
					method: "GET",
					url: `${td.URL.SD}?initialDate=${td.HOLIDAY_DATE}&delay=${td.delay.one}&country=${td.CANADA}`,
				}).then((response) => {
					expect(response.isOkStatusCode).to.be.true;

					const expectedDate = "2023-12-26"; // Boxing day is a Holiday only in Ontario
					cy.formatDate(response.body.results.businessDate).then(
						(actualDate) => {
							expect(actualDate).to.eq(expectedDate);
						},
					);
				});
			});
		},
	);

	/**
	 * Again, asking the team and business if it wouldn't be better to return an error code for invalid/missing params alongside businessDate null.
	 */
	context("Check invalid inputs and missing params", () => {
		context("initialDate param", () => {
			it("should return null for businessDate for a missing initialDate param", () => {
				cy.request({
					method: "GET",
					url: `${td.URL.SD}?delay=${td.delay.one}`,
				}).then((response) => {
					expect(response.isOkStatusCode).to.be.true;

					const expectedDate = null;
					const actualDate = response.body.results.businessDate;
					expect(actualDate).to.eq(expectedDate);
				});
			});

			it("should return null for businessDate for an incorrect initialDate param", () => {
				cy.request({
					method: "GET",
					url: `${td.URL.SD}?initialDate=${td.INCORRECT_FORMAT_DATE}&delay=${td.delay.one}`,
				}).then((response) => {
					expect(response.isOkStatusCode).to.be.true;

					const expectedDate = null;
					const actualDate = response.body.results.businessDate;
					expect(actualDate).to.eq(expectedDate);
				});
			});

			it("should return null for businessDate for a invalid initialDate param", () => {
				cy.request({
					method: "GET",
					url: `${td.URL.SD}?initialDate=${td.INVALID_DATE}&delay=${td.delay.one}`,
				}).then((response) => {
					expect(response.isOkStatusCode).to.be.true;

					const expectedDate = null;
					const actualDate = response.body.results.businessDate;
					expect(actualDate).to.eq(expectedDate);
				});
			});
		});

		context("delay param", () => {
			it("should return null for businessDate for a negative delay", () => {
				cy.request({
					method: "GET",
					url: `${td.URL.SD}?initialDate=${td.BUSINESS_DATE}&delay=${td.delay.negative}`,
				}).then((response) => {
					expect(response.isOkStatusCode).to.be.true;

					const expectedDate = null;
					const actualDate = response.body.results.businessDate;
					expect(actualDate).to.eq(expectedDate);
				});
			});

			it("should return null for businessDate for a zero delay", () => {
				cy.request({
					method: "GET",
					url: `${td.URL.SD}?initialDate=${td.BUSINESS_DATE}&delay=${td.delay.zero}`,
				}).then((response) => {
					expect(response.isOkStatusCode).to.be.true;

					const expectedDate = null;
					const actualDate = response.body.results.businessDate;
					expect(actualDate).to.eq(expectedDate);
				});
			});

			it("should return null for businessDate for a float delay", () => {
				cy.request({
					method: "GET",
					url: `${td.URL.SD}?initialDate=${td.BUSINESS_DATE}&delay=${td.delay.float}`,
				}).then((response) => {
					expect(response.isOkStatusCode).to.be.true;

					const expectedDate = null;
					const actualDate = response.body.results.businessDate;
					expect(actualDate).to.eq(expectedDate);
				});
			});

			it("should return null for businessDate for a string delay", () => {
				cy.request({
					method: "GET",
					url: `${td.URL.SD}?initialDate=${td.BUSINESS_DATE}&delay=${td.delay.string}`,
					failOnStatusCode: false,
				}).then((response) => {
					expect(response.isOkStatusCode).to.be.true;

					const expectedDate = null;
					const actualDate = response.body.results.businessDate;
					expect(actualDate).to.eq(expectedDate);
				});
			});

			it("should return null for businessDate for a missing delay param", () => {
				cy.request({
					method: "GET",
					url: `${td.URL.SD}?initialDate=${td.BUSINESS_DATE}`,
					failOnStatusCode: false,
				}).then((response) => {
					expect(response.isOkStatusCode).to.be.true;
					const expectedDate = null;
					const actualDate = response.body.results.businessDate;
					expect(actualDate).to.eq(expectedDate);
				});
			});

			// remember that we went with the assumption that maxDelay can be 365. We could also trigger an error message.
			it("should return null for businessDate for a delay greater than 365", () => {
				cy.request({
					method: "GET",
					url: `${td.URL.SD}?initialDate=${td.BUSINESS_DATE}&delay=${td.delay.overMaxDelay}`,
				}).then((response) => {
					expect(response.isOkStatusCode).to.be.true;
					const expectedDate = null;
					const actualDate = response.body.results.businessDate;
					expect(actualDate).to.eq(expectedDate);
				});
			});
		});

		context("country code param", () => {
			/**
			 * Just like for the businessDate test file, I will assume that the talk with the team revealed that an invalid country code
			 * should return null for businessDate.
			 *
			 * The following tests cover this.
			 */
			it("should return null for businessDate for invalid country code string", () => {
				cy.request({
					method: "GET",
					url: `${td.URL.SD}?initialDate=${td.BUSINESS_DATE}&delay=${td.delay.one}&country=${td.INVALID_COUNTRY_CODE_STRING}`,
				}).then((response) => {
					expect(response.isOkStatusCode).to.be.true;
					const expectedDate = null;
					const actualDate = response.body.results.businessDate;
					expect(actualDate).to.eq(expectedDate);
				});
			});

			it("should return null for businessDate for invalid country code number", () => {
				cy.request({
					method: "GET",
					url: `${td.URL.SD}?initialDate=${td.BUSINESS_DATE}&delay=${td.delay.one}&country=${td.INVALID_COUNTRY_CODE_STRING}`,
				}).then((response) => {
					expect(response.isOkStatusCode).to.be.true;
					const expectedDate = null;
					const actualDate = response.body.results.businessDate;
					expect(actualDate).to.eq(expectedDate);
				});
			});
		});
	});
});
