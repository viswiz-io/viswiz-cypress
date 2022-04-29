# VisWiz.io Cypress Plugin

> The official VisWiz.io Cypress plugin.

[![Github Actions](https://github.com/viswiz-io/viswiz-cypress/actions/workflows/ci.yaml/badge.svg)](https://github.com/viswiz-io/viswiz-cypress/actions)
[![NPM version](https://img.shields.io/npm/v/viswiz-cypress.svg?style=flat)](https://www.npmjs.com/package/viswiz-cypress)
[![Install size](https://packagephobia.now.sh/badge?p=viswiz-cypress)](https://packagephobia.now.sh/result?p=viswiz-cypress)

Welcome to the [VisWiz.io](https://www.viswiz.io/) [Cypress](https://www.cypress.io/) plugin documentation.

## Installation

Install the package:

```
$ npm install --save-dev viswiz-cypress
```

Then add it to your `cypress/plugins/index.js` (or the corresponding `pluginsFile` from your Cypress configuration):

```js
module.exports = (on, config) => {
	require('viswiz-cypress')(on, config);
};
```

## Configuration

The plugin requires a few options to be set, either via environment variables or with a configuration object.

### Environment variables

We support popular [CI services](https://www.npmjs.com/package/env-ci#supported-ci) and some of the variables are detected automatically.

| Environment variable | Purpose                                        |
| -------------------- | ---------------------------------------------- |
| `VISWIZ_API_KEY`     | The VisWiz.io account API key                  |
| `VISWIZ_PROJECT_ID`  | The VisWiz.io project ID                       |
| depending on CI      | The branch name of the current build           |
| depending on CI      | The commit revision (SHA) of the current build |
| depending on CI\*    | The commit message of the current build        |

For the actual environment variables names for your CI, please refer to your CI's documentation.

> Note: Not all CI systems expose an environment variable for the commit message, so the plugin uses a fallback variable: `COMMIT_MESSAGE`. If your CI system does not support such a variable, you will need to define this variable when you are running tests.

### Configuration options

All these configuration options can be set via a configuration object when you initialize the plugin:

```js
module.exports = (on, config) => {
	require('viswiz-cypress')(on, config, {
		apiKey: 'FILL-IN',
		branch: 'FILL-IN',
		name: 'FILL-IN',
		projectID: 'FILL-IN',
		revision: 'FILL-IN',
	});
};
```

## Usage

Update your test files to capture a few screenshots of your application using [`cy.screenshot`](https://docs.cypress.io/api/commands/screenshot):

```js
describe('my tests', () => {
	it('takes one screenshot', () => {
		cy.screenshot('first-screenshot');
	});

	it('takes another screenshot', () => {
		cy.screenshot('second-screenshot');
	});
});
```

That's all there is to it.

When all tests pass, the plugin creates a new VisWiz.io build and sends all screenshots for visual regression testing. A VisWiz.io report URL will be printed in the logs.

```shell
$ cypress run
  ...
  VisWiz: processing screenshots (1/2)
  VisWiz: processing screenshots (2/2)
  VisWiz: Build report will be available at: https://app.viswiz.io/projects/6SrRRmpuSpWDDBGGqjWSB9/build/vMUf2vUkaU5NuGsQqWz875/results
```

# Changelog

The changelog can be found here: [CHANGELOG.md](https://github.com/viswiz-io/viswiz-cypress/blob/main/CHANGELOG.md#readme).

# Authors and license

Author: [VisWiz.io](https://www.viswiz.io/).

MIT License, see the included [LICENSE.md](https://github.com/viswiz-io/viswiz-cypress/blob/main/LICENSE.md) file.
