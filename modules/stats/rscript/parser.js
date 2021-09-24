// PLACE HOLDER TODO

const R = require("r-script");
R("example/ex-async.R").
    data({"df": attitude,
        "nGroups": 3,
        "fxn": "mean"}).
    call((err, d) => {

        if (err) {

            throw err;

        }
        console.log(d);

    });
