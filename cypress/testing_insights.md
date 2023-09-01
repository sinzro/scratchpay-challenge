# Testing Insights

- **Challenge:** Starting the server and running the tests.  
  Usually I would use the [start-server-and-test](https://www.npmjs.com/package/start-server-and-test) package to start the server and run the test.  
  The package starts the server, waits for it to respond with 200, and then runs the tests. But, the app doesn't send 200 once it's up,
  and it times out.

  Because of this, I had to use a different way.  
  Test suite should be easily run by anyone. I'm currently using WSL on WINDOWS, and the tests are working fine. Unfortunately, I don't have a MAC on hand, but it should work.

## [app-tests/businessDay.cy.js](e2e/app-tests/businessDay.cy.js)

### Issues Encountered

- **Issue:** Several public holidays in the US and CANADA were returned as business days.  
  Gathered some US AND CANADA public days, where bussiness are closed. I only picked a few, but this could definetly be expanded to a full list.  
  For US it failed for : 2023-05-29 - Memorial Day and 2023-07-04 - Independence Day.
  For CANADA it failed for: 2023-04-07 - Good Friday, 2023-05-22 - Victoria Day and 2023-09-04 - Labour Day.

- **Issue:** Invalid country codes dont return error / null.  
  As it stands, if we use the Christmas Day for the date, and with/without an US country code, it will return false, as it's not a business day.  
  If we use instead the same Christmas Day, but with an invalid country code, it will return true.
  - **Reasoning**: If an invalid code is used, it should return an error or false / null. Need to discuss this with the team.
  - **Assumptions**: I talked with the team, and we agreed that it should indeed return null.

## [app-tests/settlementDate.cy.js](e2e/app-tests/settlementDate.cy.js)

### Issues Encountered

- **Issue:** It seems that this api doesn't return to correct settlementDate.
  For example, for initialDate = 2023-08-28 (which is a Monday), with a delay of 1, it returns businessDate = 2023-08-27, which is one day behind and on a Sunday. The same initialDate, with a delay of 2, it returns businessDate = 2023-08-28, which is the same date as the initialDate.

  To properly test this, I would need to better understand how this api should work. This means that I would need to talk with the team and business in order to do so.

  I also have some concerns about the delay being negative or zero. I can't see it being negative, as a settlement date can't be behind the initialDate.
  For the delay to be zero, it may be possible to have the settlementDate in the same day as InitialDate. For example, you order something in the morning, and you'll get it by the end of the day.
  But if you order it later in the day, you'll have to wait at least until the next business date.
  I think that a better (and safer) option would be to have the delay at least 1.

  I would definetly need to talk this with the team and with the business to better understand what they're expecting and come to an agreement.
  Other questions would be: - from the code, I got the impression that delay is an integer. Can it be something else like float? - what is the maximum delay that should we use? Is it 30 days? 60 days? 365 days or more?

  - **Reasoning**:
    - a negative delay, shouldn't be allowed. I can't see the business date behind the initialDate.
    - a zero delay is posible, depending of the time of the order. A safer option would be for the delay to be atleast 1.
    - a positive delay, should return a day after the initialDate.
    - Need to discuss all of this with the team.
  - **Assumptions**: I talked with the team, and we agreed on the following:
    - the delay will be added directly to the initialDate, taking into account weekends and holidays. So, if the initialDate is 2023-08-28 (Monday), and delay is 1, then businessDate is 2023-08-29 (Tuesday).
    - the delay can't be negative or zero, and an error should be triggered if these values are used.
    - the delay should be an integer
    - the delay should be 365 days max

- **Issue**: Invalid country codes dont return error / null.  
  Same reasoning and assumptions as in **app-tests/businessDay.cy.js**.

## [api-tests/clinics.cy.js](e2e/api-tests/clinics.cy.js)

### Issues Encountered

- **Issue:**
  Going to https://qa-challenge-api.scratchpay.com/, we get the name of the api server - Action Hero Server.  
  It has two sections that are empty - **This Server** and **Actions on This Server**. So, no info or link to some docs.

  Doing a GET request on https://qa-challenge-api.scratchpay.com/, we get a bunch of data, including some info about two server actions - **/api/status** and **/api/showDocumentation**.

  **/api/status** endpoint works, but **/api/showDocumentation** throws "error": "unknown action or invalid apiVersion".
  I even tried **/api/showDocumentation?apiVersion=1**(taken from the same data as the two actions) with different values,but the result was the same.
  Now, another question would be if this data with actions should be accessible via a normal get (logged in or not).

  - **Reasoning**:

    - in a team environment, I would ask the team (or be redirected to someone that can help for this) for docs and info on how this server works.
    - I would need to see what endpoints are on this server and how they're used.
    - also, talk to the team about the two actions found.
    - for the purpose of this challenge, I went ahead with exploratory testing.

  - **Assumptions**: Talked with the team and the showDocumentation endpoint should be accessible.

## Conclusion

These brief notes capture the key reasoning and challenges encountered during the scratchpay challenge. For more details, refer to the specific test files.
