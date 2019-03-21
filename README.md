# adnat-react
[![Build Status](https://travis-ci.com/volsci/adnat-react.svg?token=YLxsfPyQB5M9pyupAv1V&branch=master)](https://travis-ci.com/volsci/adnat-react)

My submission for the Tanda "adnat" React work sample.

Setup
---

```
npm run backend:setup
npm install
```

Run
---

```
npm run backend:start
npm start
```

Test
---
Adnat uses a test stack comprised of Jest, Enzyme and Cypress, covering unit, integration and E2E testing. Continuous integration is handled through Travis CI.
```
[in case of Windows related linebreak errors]
eslint --fix src/**
```
```
npm test
```
```
[while server is running]
npm run cypress
```

Details
---
* Uses parceljs as the web application bundler.
* Uses the gitflow workflow / branching strategy.
* Uses the Material UI component library.
* Handles routing with react-router.
* Handles cookies with react-cookie.
* Uses momentjs to parse, format and perform arithmetic with datetimes.

Usage
---
* Create a new account to begin with. Password must be six characters or more.
* Create an organisation from the drawer menu to begin with. 
* Shifts can be added for any employee. 
* Double click an existing shift to edit or delete it. 
* The current organisation's name or hourly rate can be changed by clicking on the pencil symbol that appears on hover, within the drawer menu.
* Visit the account page to change name, email or password.
