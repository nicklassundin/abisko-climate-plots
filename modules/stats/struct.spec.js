const fs = require("fs");
const request = require("request");

const {expect} = require("chai");

const stats = require("./struct.js");

describe(
    "javascript statistic module",
    () => {

        it(
            "CLEAN - struct.create()",
            function *() {

                const result = stats.struct.create();
                expect(result).to.eql(stats.struct);

            }
        );
        it(
            "NONE-CLEAN - struct.create()",
            function *() {

                const result = stats.struct.create([
                    {"x": 0,
                        "y": 0},
                    {"x": 1,
                        "y": 1}
                ]);
                expect(result.values).to.eql(stats.struct.values);

            }
        );
        it(
            "struct.clone()",
            function *() {

                const result = stats.struct.create(),
		 clone = result.clone();
                expect(result).to.eql(clone);

            }
        );

    }
);
