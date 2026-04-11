# Playwright UI & API Test Automation

This project demonstrates practical experience in **UI and API test automation** using Playwright.

It includes:
- Page Object Model (POM)
- Test data separation
- Fixtures
- UI + API test coverage
- Positive and negative scenarios

---

## Application Under Test

Public demo applications used for automation practice:

- UI/API: [Automation Exercise](https://automationexercise.com/)
- Auth API: [Conduit API](https://conduit-api.bondaracademy.com/)

The application includes:
- product catalog  
- cart functionality  
- user authentication  
- public API endpoints  

---

## What This Project Demonstrates

- Writing maintainable UI tests using Playwright  
- Structuring tests with Page Object Model  
- API testing with Playwright request context  
- Validation of responses and error handling  
- Use of fixtures for reusable setup  
- Separation of test data from test logic  

---

## Tech Stack

- Playwright (JavaScript)  
- Node.js  
- AJV (JSON schema validation)  
- GitHub  

---

## Features

### UI Tests
- Home page validation  
- User login (positive & negative cases)  
- User registration  
- Product search  
- Add to cart flow  
- Cart validation  
- Guest checkout behavior  
- Cart persistence after login  

### API Tests
- Get all products  
- Get brands list  
- Search product  
- Verify login  
- Get user details by email  

### Negative Scenarios
- Invalid input data  
- Missing required fields  
- Unsupported HTTP methods  

---

## Test Data

Test data is stored in the `test-data` folder and separated from test logic.

---

## Notes

- This project uses public demo applications for testing purposes  
- Some tests rely on dynamic data (e.g., unique email for registration)  
- API tests include both positive and negative scenarios  

---

## Installation

```bash
git clone https://github.com/tlotot/playwright-ui-api-tests.git
cd playwright-ui-api-tests
npm install
npx playwright install
npm run test
```
---

## Author

Tetiana Lototska

---

## Summary

This project demonstrates practical skills in:

- UI and API test automation
- test architecture and maintainability
- working with real-world scenarios (authentication, cart, search)
