// Const $ = require("jquery");
const TerserPlugin = require("terser-webpack-plugin");
//const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
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
              "http":  require.resolve("stream-http"),
              "url": require.resolve("url/"),
              "https": require.resolve("https-browserify"),
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

