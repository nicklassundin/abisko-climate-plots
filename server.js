module.exports = require("climate-plots-config").genStaticFiles(__dirname).
    then(() => {
	var app = require("./app.js").app;
        if (process.argv.includes("d")) {
            const dev = require("./dev.js");
            dev.setup(app);

        }
	const web = require("./modules/server/web.js");
        web.webserver.http(app);
        app.get(
            "/",
            (req, res) => {

                res.send("Lets do this");

            }
        );
	const health = require("express-healthcheck")
        app.use(
            "/health",
	    health()
        );

    });


