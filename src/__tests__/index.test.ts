jest.mock('viswiz-sdk');

import { expect, jest } from '@jest/globals';
import { Mock } from 'jest-mock';
import VisWiz from 'viswiz-sdk';

import plugin from '../';

describe('plugin', () => {
	let on: Mock<
		(
			action: 'after:run',
			fn: (
				results: CypressCommandLine.CypressRunResult | CypressCommandLine.CypressFailedRunResult
			) => void | Promise<void>
		) => void
	>;
	let config: Cypress.PluginConfigOptions;

	beforeEach(() => {
		jest.resetAllMocks();

		on = jest.fn();
		// @ts-expect-error Ignore missing properties
		config = {
			screenshotsFolder: '/tmp',
		};

		process.env.VISWIZ_API_KEY = '123456';
		process.env.VISWIZ_PROJECT_ID = 'abcdef';
		process.env.COMMIT_MESSAGE = 'Commit Message';
		process.env.GITHUB_ACTIONS = '1';
		process.env.GITHUB_REF = 'feature/branch';
		process.env.GITHUB_SHA = '8829ad36b38090fb7c8ea21e98f18ce4320a819f';
		// This allows us to define these CI vars in a stable way in PRs
		delete process.env.GITHUB_EVENT_PATH;
	});

	test('registers after:run handler with env variables', () => {
		// @ts-expect-error
		plugin(on, config);

		expect(on).toHaveBeenCalledWith('after:run', expect.any(Function));
	});

	test('creates build with images when tests passed', async () => {
		// @ts-expect-error
		const client = plugin(on, config);

		expect(on).toHaveBeenCalledWith('after:run', expect.any(Function));
		expect(VisWiz).toHaveBeenCalledWith('123456');

		// @ts-expect-error
		await on.mock.calls[0][1]({ status: 'finished' });

		expect(client.buildWithImages).toHaveBeenCalledWith(
			{
				branch: 'feature/branch',
				name: 'Commit Message',
				projectID: 'abcdef',
				revision: '8829ad36b38090fb7c8ea21e98f18ce4320a819f',
			},
			'/tmp',
			expect.any(Function)
		);
	});

	test('exits when tests failed', async () => {
		// @ts-expect-error
		const client = plugin(on, config);

		expect(on).toHaveBeenCalledWith('after:run', expect.any(Function));

		// @ts-expect-error
		await on.mock.calls[0][1]({ status: 'failed' });

		expect(client.buildWithImages).not.toHaveBeenCalledWith({});
	});

	describe('api key', () => {
		test('creates build with value from options', async () => {
			delete process.env.VISWIZ_API_KEY;

			// @ts-expect-error
			plugin(on, config, { apiKey: '123456abc' });

			expect(on).toHaveBeenCalledWith('after:run', expect.any(Function));

			// @ts-expect-error
			await on.mock.calls[0][1]({ status: 'finished' });

			expect(VisWiz).toHaveBeenCalledWith('123456abc');
		});

		test('exits when no value', () => {
			delete process.env.VISWIZ_API_KEY;

			// @ts-expect-error
			plugin(on, config);

			expect(on).not.toHaveBeenCalledWith('after:run', expect.any(Function));
		});
	});

	describe('project id', () => {
		test('creates build with value from options', async () => {
			delete process.env.VISWIZ_PROJECT_ID;

			// @ts-expect-error
			const client = plugin(on, config, { projectID: 'abcdef123' });

			expect(on).toHaveBeenCalledWith('after:run', expect.any(Function));

			// @ts-expect-error
			await on.mock.calls[0][1]({ status: 'finished' });

			expect(client.buildWithImages).toHaveBeenCalledWith(
				{
					branch: 'feature/branch',
					name: 'Commit Message',
					projectID: 'abcdef123',
					revision: '8829ad36b38090fb7c8ea21e98f18ce4320a819f',
				},
				'/tmp',
				expect.any(Function)
			);
		});

		test('exits when no value', () => {
			delete process.env.VISWIZ_API_KEY;

			// @ts-expect-error
			plugin(on, config);

			expect(on).not.toHaveBeenCalledWith('after:run', expect.any(Function));
		});
	});

	describe('branch name', () => {
		test('creates build with value from options', async () => {
			delete process.env.GITHUB_REF;

			// @ts-expect-error
			const client = plugin(on, config, { branch: 'feature/manual' });

			expect(on).toHaveBeenCalledWith('after:run', expect.any(Function));

			// @ts-expect-error
			await on.mock.calls[0][1]({ status: 'finished' });

			expect(client.buildWithImages).toHaveBeenCalledWith(
				{
					branch: 'feature/manual',
					name: 'Commit Message',
					projectID: 'abcdef',
					revision: '8829ad36b38090fb7c8ea21e98f18ce4320a819f',
				},
				'/tmp',
				expect.any(Function)
			);
		});

		test('exits when no value', () => {
			delete process.env.GITHUB_REF;

			// @ts-expect-error
			plugin(on, config);

			expect(on).not.toHaveBeenCalledWith('after:run', expect.any(Function));
		});
	});

	describe('commit message', () => {
		test('creates build with value from options', async () => {
			delete process.env.COMMIT_MESSAGE;

			// @ts-expect-error
			const client = plugin(on, config, { commitMessage: 'Commit Manual' });

			expect(on).toHaveBeenCalledWith('after:run', expect.any(Function));

			// @ts-expect-error
			await on.mock.calls[0][1]({ status: 'finished' });

			expect(client.buildWithImages).toHaveBeenCalledWith(
				{
					branch: 'feature/branch',
					name: 'Commit Manual',
					projectID: 'abcdef',
					revision: '8829ad36b38090fb7c8ea21e98f18ce4320a819f',
				},
				'/tmp',
				expect.any(Function)
			);
		});

		test('exits when no value', () => {
			delete process.env.COMMIT_MESSAGE;

			// @ts-expect-error
			plugin(on, config);

			expect(on).not.toHaveBeenCalledWith('after:run', expect.any(Function));
		});
	});

	describe('commit revision', () => {
		test('creates build with value from options', async () => {
			delete process.env.GITHUB_SHA;

			// @ts-expect-error
			const client = plugin(on, config, {
				commitRevision: '4d487f8ccdc131eddd9cf767ace6b4f06ddd4a39',
			});

			expect(on).toHaveBeenCalledWith('after:run', expect.any(Function));

			// @ts-expect-error
			await on.mock.calls[0][1]({ status: 'finished' });

			expect(client.buildWithImages).toHaveBeenCalledWith(
				{
					branch: 'feature/branch',
					name: 'Commit Message',
					projectID: 'abcdef',
					revision: '4d487f8ccdc131eddd9cf767ace6b4f06ddd4a39',
				},
				'/tmp',
				expect.any(Function)
			);
		});

		test('exits when no value', () => {
			delete process.env.GITHUB_SHA;

			// @ts-expect-error
			plugin(on, config);

			expect(on).not.toHaveBeenCalledWith('after:run', expect.any(Function));
		});
	});
});
