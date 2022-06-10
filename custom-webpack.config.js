// Custom webpack configuration loads imported plugin resource files
module.exports = (config, options) => {
	config.module.rules.push(
		{
			/**
			 * Load image resources required by the library crosssection and timespanevent plugins
			 * Read more: https://webpack.js.org/guides/asset-modules/
			 */
			test: /\.(jpg|gif|png|svg|cur)$/,
			type: "asset/resource",
			generator: {
				filename: "img/[name][ext]",
			}
		}
	);

	return config;
};
