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
npm test
```
```
npm run cypress
```

Details
---
* Uses the gitflow workflow / branching strategy.
* Uses the Material UI component library.
* Handles routing with react-router.
* Handles cookies with react-cookie.
* Uses momentjs to parse, format and perform arithmetic with datetimes.
