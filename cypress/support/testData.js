export const testData = {
	US_PUBLIC_HOLIDAYS: [
		"2023-01-01",
		"2023-01-02",
		"2023-05-29",
		"2023-07-04",
		"2023-12-25",
	],

	CA_PUBLIC_HOLIDAYS: [
		"2023-01-01",
		"2023-04-07",
		"2023-05-22",
		"2023-07-01",
		"2023-09-04",
	],

	BUSINESS_DATE: "2023-08-30",
	WEEKEND_DATE: "2023-09-03",
	HOLIDAY_DATE: "2023-12-25",
	INEXISTENT_DATE: "2023-02-30",
	XMAS_DAY: "2023-12-25",
	INVALID_DATE: 5000,
	INCORRECT_FORMAT_DATE: "01012023",
	CANADA: "CA",
	USA: "US",
	INVALID_COUNTRY_CODE_STRING: "WWWWWWWWWWWWWWWWWWWWW",
	INVALID_COUNTRY_CODE_NUM: 7200,

	URL: {
		API_AUTH: "https://qa-challenge-api.scratchpay.com/api/auth",
		API_CLINICS: "https://qa-challenge-api.scratchpay.com/api/clinics",
		API_STATUS: "https://qa-challenge-api.scratchpay.com/api/status",
		API_SHOW_DOCUMENTATION:
			"https://qa-challenge-api.scratchpay.com/api/showDocumentation",
		BD: "/api/v1/isBusinessDay",
		SD: "/api/v1/settlementDate",
	},

	clinicData: {
		all: "a",
		veterinary: "veterinary",
		clinic1Users: [
			{
				id: 3,
				email: "gianna@hightable.test",
				firstName: "Gianna",
				lastName: "D'Antonio",
			},
			{
				id: 4,
				email: "johnny@breakingpoints.com",
				firstName: "Johnny",
				lastName: "Utah",
			},
		],
		veterinaryClinics: [
			{
				id: 2,
				displayName: "Continental Veterinary Clinic, Los Angeles, CA",
			},
			{
				id: 7,
				displayName: "Third Transfer Veterinary Clinic, Los Angeles, CA",
			},
		],
		allClinics: [
			{
				id: 1,
				displayName: "High Table Pet Care, Pasadena, CA",
			},
			{
				id: 2,
				displayName: "Continental Veterinary Clinic, Los Angeles, CA",
			},
			{
				id: 7,
				displayName: "Third Transfer Veterinary Clinic, Los Angeles, CA",
			},
			{
				id: 8,
				displayName: "Dental Care, Pasadena, CA",
			},
		],
	},

	userData: {
		email: "gianna@hightable.test",
		password: "thedantonio1",
		role: "clinic",
		numOfPermisions: 31,
	},
	delay: {
		negative: -5,
		zero: 0,
		one: 1,
		two: 2,
		three: 3,
		float: 3.14,
		string: "abc",
		maxDelay: 365,
		overMaxDelay: 370,
	},
};
