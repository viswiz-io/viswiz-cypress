import envCI, { CiEnv } from 'env-ci';

export default function ciEnvs(): [CiEnv, string | undefined] {
	const ci = envCI();

	const messageMap = {
		appveyor: 'APPVEYOR_REPO_COMMIT_MESSAGE',
		bitrise: 'BITRISE_GIT_MESSAGE',
		buildkite: 'BUILDKITE_MESSAGE',
		codeship: 'CI_MESSAGE',
		drone: 'DRONE_COMMIT_MESSAGE',
		travis: 'TRAVIS_COMMIT_MESSAGE',
	};
	// @ts-expect-error Ignore undefined `service` property
	const message = process.env[messageMap[ci.service]] || process.env.COMMIT_MESSAGE;

	if (!ci.isCi) {
		ci.branch = undefined;
		ci.commit = undefined;
	}

	return [ci, message];
}
