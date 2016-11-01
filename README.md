# data-forge-from-yahoo

Data-Forge plugin for pulling data from the Yahoo financial API.

## Installation

You need [Data-Forge](https://www.npmjs.com/package/data-forge) to use this plugin.

For Nodejs:

    npm install --save data-forge-from-yahoo

For the browser:

    bower install --save data-forge-from-yahoo

## Setup

For Nodejs:

	var dataForge = require('data-forge');
	dataForge.use(require('data-forge-from-yahoo'));

For the browser:

    <script src="bower_components/data-forge/data-forge.js"></script>
    <script src="bower_components/data-forge-from-yahoo/from-yahoo.dist.js"></script>

## Usage

	dataForge.fromYahoo('MSFT')
		.then(function (dataFrame) {
			console.log(dataFrame.take(5).toString());
		})
		.catch(function (err) {
			// ... error handling ...
		}); 

**Note**: When using *data-forge-from-yahoo* in the browser you'll most likely need to use a proxy server. 

## Example

For an example please see the related article about [graphing financial data with Data-Forge and Highstock](http://www.codeproject.com/Articles/1069489/Highstock-plus-Data-Forge-plus-Yahoo). 
