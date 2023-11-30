export const getEnvVar = (varName) => {
	// eslint-disable-next-line no-process-env
	const value = process.env[varName];
	if (!value) {
		throw new Error(`Environment variable ${varName} not found`);
	}
	return value;
};
