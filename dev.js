exports.setup = function (app) {

    const version = `${require("./package.json").version}`;

    const fs = require("fs");

    // Pre-setup
    const $ = require("jquery");

    const hbs = require("hbs");
    const plotConfig = require("climate-plots-config"),
        {custom} = plotConfig;
    exports.custom = custom;
    const stati = require("./static/charts/stations.json");

    hbs.registerPartials(
        `${__dirname}/views/partials`,
        (err) => {
            custom.then((chrts) => {
                const stations = Object.keys(stati).map((st) => {

                        if (st === "smhi") {

                            return "53430";

                        }

                        return st;

                    }),
                    sets = stati;
            });

        }
    );

};
