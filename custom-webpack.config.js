const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (config, options) => {
	config.module.rules.push(
		{ // HTML bundling rule required in plugins: cryptoiq, scriptiq, visualearnings, recognia
			test: /\.html/,
			use: [{ loader: 'html-loader' }],
		}
	);
	config.plugins.push(
		new CopyWebpackPlugin([ // Copy dynamically loaded resouces
			{ 
				from: './node_modules/chartiq/js/thirdparty', 
				to: './js/thirdparty' 
			}
		])
	);

	return config;
};
