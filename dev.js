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
	    	console.log("version", version)
                app.render(
                    "browse-release.hbs",
                    {sets,
                        chrts,
                        stations,
                        version},
                    (err, str) => {

                        if (err) {

                            throw err;

                        }
                        fs.writeFile(
                            "index.html",
                            str,
                            (err) => {

                                if (err) {

                                    console.error(err);


                                }

                            }
                        );

                    }
                );
                app.get(
                    "/github",
                    (req, res) => {

                        res.render(
                            "browse-release.hbs",
                            {
                                sets,
                                chrts,
                                stations,
                                version
                            }
                        );

                    }
                );

            });

        }
    );

};
