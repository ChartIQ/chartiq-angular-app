const CssPlugin = require("mini-css-extract-plugin"); // used for packaging css into bundles

// Custom webpack configuration loads imported plugin resource files
module.exports = (config, options) => {
	config.module.rules.push(
		{
			/**
			 * Tests any file in the bundle for .css extension using the css-loader
			 * Use it for loading any styles in the dependency graph of your bundle.
			 * Read more about css-loader:
			 * https://webpack.js.org/loaders/css-loader/
			 */
			test: /\.css$/,
			type: "javascript/auto",
			use: [
				{
					loader: CssPlugin.loader,
					options: { esModule: false, publicPath: "/" }
				},
				"css-loader"
			]
		},
		{
			/**
			 * Tests any file for a variety of different image file extensions.
			 * This loader will create files for the images; they will not be in the bundle.
			 * It is used for packaging imported images and images in stylesheets when referenced with url() in setting a CSS property value (both CSS and SCSS).
			 * The options object sets a public path where you can find the output.
			 * Read more: https://webpack.js.org/guides/asset-modules/
			 */
			test: /\.(jpg|gif|png|svg|cur)$/,
			type: "asset/resource",
			generator: {
				filename: "[name][ext]"
			}
		}
	);

	config.plugins.push(
		/**
		 * Extracts all of our CSS and SCSS and emits them into one unified stylesheet output.
		 * Read more about the Extract CSS Chunks Plugin:
		 * https://webpack.js.org/plugins/mini-css-extract-plugin/
		 */
		new CssPlugin({
			experimentalUseImportModule: false,
			filename: "./chartiq-[name].css"
		}),
	);
	return config;
};
