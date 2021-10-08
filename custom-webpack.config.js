// Custom webpack configuration is no longer required
module.exports = (config, options) => {
	config.module.rules.push(
		/* import.meta support for webpack 4 */
		{
			test: /\.(ts|js)$/,
			loader: require.resolve("@open-wc/webpack-import-meta-loader")
		}
	);

	return config;
};
