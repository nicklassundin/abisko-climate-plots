const express = require("express");
const fs = require("fs");
const {lstatSync, readdirSync} = require("fs");

exports.lang = function (app, dirname, dir) {

    const files = fs.readdir(
        dirname + dir,
        (err, files) => {

            if (err) {

                return //console.log(`Unable to scan directory: ${err}`);

            }
            files.forEach((file) => {

                const path = `${dir}/${file}`;
                if (lstatSync(dirname + path).isDirectory()) {

                    //console.log(path);
                    app.use(
                        path,
                        express.static(dirname + path)
                    );

                }

            });

        }
    );

};


