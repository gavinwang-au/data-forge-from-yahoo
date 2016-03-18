'use strict';

module.exports = function (dataForge, globalOptions) {

	var Enumerable = require('linq');
	var moment = require('moment');

	globalOptions = globalOptions || {};

	var defaultBaseUrl = globalOptions.baseUrl || 'http://ichart.yahoo.com/table.csv';
	
	var request = require('request-promise');
	
	//
	// Create the URL for pulling data from Yahoo.
	//
	var formatYahooUrl = function (code, options) {

		options = options || {};

		var baseUrl = options.baseUrl || defaultBaseUrl;
		var url = baseUrl + '?s=' + code.toUpperCase();

		if (options.fromDate) {                
			url += '&a=' + options.fromDate.getMonth(); // Month. Yahoo expects 0-based month.
			url += '&b=' + options.fromDate.getDate(); // Date.
			url += '&c=' + options.fromDate.getFullYear(); // Year.
		}

		if (options.toDate) {
			
			url += '&d=' + options.toDate.getMonth(); // Month. Yahoo expects 0-based month.             
			url += '&e=' + options.toDate.getDate(); // Date.                
			url += '&f=' + options.toDate.getFullYear(); // Year.
		}

		if (options.interval) {
			// Time interval.
			// https://code.google.com/p/yahoo-finance-managed/wiki/enumHistQuotesInterval
			var intervalCode;
			if (options.interval === 'daily') {
				intervalCode = 'd';
			}
			else if (options.interval === 'weekly') {
				intervalCode = 'w';
			}
			else if (options.interval === 'monthly') {
				intervalCode = 'm';
			}
			else {
				observer.onError(new Error("Invalid interval: " + options.interval + ", should be one of daily, weekly or monthly."));
			}

			url += '&g=' + intervalCode;
		}

		url += '&ignore=.csv'; // Docs say to add this.

		return url;
	};

	// 
	// Load CSV data from Yahoo.
	//
	var loadYahooData = function (code, options) {

		options = options || {};

		var url = formatYahooUrl(code, options);

		var proxyUrl = options.proxyUrl || globalOptions.proxyUrl;

		if (proxyUrl) {
			var encodeUrlForProxy = options.encodeUrlForProxy || globalOptions.encodeUrlForProxy;
			if (encodeUrlForProxy) {
				url = proxyUrl + encodeURIComponent(url);
			}
			else {
				url = proxyUrl + url;
			}
		}
		
		return request({
				type: 'GET',
				uri: url, 
				dataType: 'text',
			})
			.then(function (data) {
				return dataForge.fromCSV(data, {
					skipEmptyLines: true,
				});
			})
			.then(function (dataFrame) {
				return dataFrame.parseDates("Date")
					.parseFloats("Adj Close")
					.parseFloats("Close")					
					.parseFloats("High")
					.parseFloats("Low")
					.parseFloats("Open")
					.parseInts("Volume"); //todo: be nice for this fn to take an array of col names.
			});
	};

	dataForge.fromYahoo = function (code, options) {
		return loadYahooData(code, options);
	};
};