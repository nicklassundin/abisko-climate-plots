
// Const preset = require('./parse.config.json');
const before = {
    "smhi" (result) {

        result = result.split("\n");
        let line = result.findIndex((x) => x.indexOf("Tidsutsnitt:") > -1),
            rest = result.splice(
                0,
                line
            );
        result = result.join("\r\n");
        rest = rest[1].split(";");
        // TODO repalce
        global.stationName = rest[0];
        result.name = rest[0];
        return result;

    },
    "abisko" (result) {

        result.name = "Abisko";
        global.stationName = "Abisko";

    }
};
exports.preset = function (meta) {

    try {

        if (meta.preset.beforeFirstChunk) {

            const be = meta.preset.beforeFirstChunk;
            meta.preset.beforeFirstChunk = before[be];

        }
        return meta;

    } catch (error) {

        console.log(meta);
        throw error;

    }

};


