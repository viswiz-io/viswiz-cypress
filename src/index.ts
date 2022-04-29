/// <reference types="cypress" />

import chalk from 'chalk';
import VisWiz from 'viswiz-sdk';

import ciEnvs from './ciEnvs';

interface VisWizCypressOptions {
	apiKey?: string;
	branch?: string;
	commitMessage?: string;
	commitRevision?: string;
	projectID?: string;
}

function log(message: string) {
	console.log(`  ${chalk.green('VisWiz:')} ${message}`);
}

function warning(message: string) {
	log(chalk.yellow(`${message}. Skipping visual regression testing.`));
}

export default function plugin(
	on: Cypress.PluginEvents,
	config: Cypress.PluginConfigOptions,
	options?: VisWizCypressOptions
) {
	const apiKey = options?.apiKey || process.env.VISWIZ_API_KEY;
	if (!apiKey) {
		warning('API key is not configured');
		return;
	}

	const projectID = options?.projectID || process.env.VISWIZ_PROJECT_ID;
	if (!projectID) {
		warning('Project ID is not configured');
		return;
	}

	const [ciEnv, ciMessage] = ciEnvs();

	const branch = options?.branch || ciEnv.branch;
	if (!branch) {
		warning('Branch name is not configured');
		return;
	}

	const name = options?.commitMessage || ciMessage;
	if (!name) {
		warning('Commit message is not configured');
		return;
	}

	const revision = options?.commitRevision || ciEnv.commit;
	if (!revision) {
		warning('Commit revision (SHA) is not configured');
		return;
	}

	const viswizClient = new VisWiz(apiKey);

	on('after:run', async (results) => {
		if (results.status === 'failed') {
			warning('Test run has failed');
			return;
		}

		const buildID = await viswizClient.buildWithImages(
			{
				branch,
				name,
				projectID,
				revision,
			},
			config.screenshotsFolder,
			(current: number, total: number) => {
				log(`processing screenshots (${chalk.blue(current)}/${chalk.blue(total)})`);
			}
		);

		const url = `https://app.viswiz.io/projects/${projectID}/build/${buildID}/results`;

		log(`Build report will be available at: ${url}`);
	});

	if (process.env.NODE_ENV === 'test') {
		return viswizClient;
	}
}
