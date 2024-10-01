// Const $ = require("jquery");
//const TerserPlugin = require("terser-webpack-plugin");
import TerserPlugin from "terser-webpack-plugin";
//const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
//const webpack = require("webpack");
import webpack from "webpack";
// Workaround to use require in an ES module
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Importing packages using dynamic import
const streamHttp = require.resolve('stream-http');
const url = require.resolve('url/');
const httpsBrowserify = require.resolve('https-browserify');

import path from "path";
import { fileURLToPath } from "url";
// Get the __filename equivalent
const __filename = fileURLToPath(import.meta.url);
// Get the __dirname equivalent
const __dirname = path.dirname(__filename);
export default [
    {
        "entry": {
            "bundle": "./modules/lib.js"
        },
        "module": {
            "rules": [
                {
                    "loader": "raw-loader",
                    "test": /\.txt$/u
                },
                {
                    "loader": "csv-loader",
                    "test": /\.csv$/u

                    /*
                     * Options: {
                     * Header: true,
                     * Download: true,
                     * SkipEmptyLines: true
                     * }
                     */
                }
            ]
        },
        "node": {
            /*
            "child_process": "empty",
            "console": true,
            "fs": "empty",
            "net": "empty",
            "tls": "empty"

             */
        },
        "resolve": {
          "fallback": {
              "http":  streamHttp,
              "url": url,
              "https": httpsBrowserify,
              "fs": false
          }
        },
        "optimization": {
            "minimize": true,
            "minimizer": [
                new TerserPlugin()
            ]
        },
        "output": {
            "filename": "./bundle.js",
            "path": `${__dirname}/client`
        },
        "plugins": [
            /*
             * New webpack.ProvidePlugin({
             * $: "jquery",
             * JQuery: "jquery",
             * "window.jQuery": "jquery"
             * })
             */
        ]
    }
];

