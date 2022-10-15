// Const $ = require("jquery");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const webpack = require("webpack");
const dir = __dirname;
module.exports = [
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
            "child_process": "empty",
            "console": true,
            "fs": "empty",
            "net": "empty",
            "tls": "empty"
        },
        "optimization": {
            "minimize": true,
            "minimizer": [
                new UglifyJsPlugin({
                    "uglifyOptions": {
                        "output": {
                            "comments": false
                        }
                    }
                })
            ]
        },
        "output": {
            "filename": "./bundle.js",
            "path": `${dir}/client`
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

