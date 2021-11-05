const $ = require("jquery");

const Papa = require("papaparse"),
    parse = require("../../stats/config.js").parsers;
// const help = require("../../helpers.js");
const help = require('climate-plots-helper');

const {createDiv} = require("../charts/struct.js"),

    renderer = require("../renderer.js").render;

/*
 * TODO Demo
 *  var demo = require('../../../data/demo.js').data;
 */


global.filePath = {
    "station" (fileName, id) {

        // TODO hotfix
        if (id) {

            return `${hostUrl}/data/${id}/${fileName}`;

        }
        return `${hostUrl}/data/${fileName}`;

    }
};

// Wander down the data structure with tag input example: [high, medium, low]
var tagApply = function (data, tags) {

    // Console.log(tags)
    if (Array.isArray(tags) && tags.length == 1) {

        tags = tags[0];

    }
    return new Promise((res, rej) => {

        const result = data;
        if (data.then) {

            data.then((d) => {

                res(tagApply(
                    d,
                    tags
                ));

            });

        } else if (Array.isArray(tags)) {

            const tag = tags.shift();
            res(tagApply(
                result[tag],
                tags
            ));

        } else {

            // Res(result[tags.replace('[stationName]', station)])
            res(result[tags]);

        }

    }).catch((error) => {

        /*
         * Console.log(tags)
         * Console.log(data)
         */
        throw error;

    });

};

// /
// /////

// Var merged = require('../../../static/modules.config.charts.merge.json');
const container = {},

    // /////

    struct = {
        "type": undefined,
        "config": undefined,
        "html" (config) {

            const {id} = config.files.stationDef,
                {subset} = config.files;

            /*
             * If(subset){
             * Subset = subset.subset;
             * Var div = document.createElement("div");
             * Subset.sets.forEach(month => {
             * Div.appendChild(createDiv(id+'_'+month));
             * })
             * }else{
             */
            return createDiv(
                config,
                false
            );

            /*
             * }
             * Return div
             */

        },
        "build" (config, div) {

            this.config = config;
            const {ref} = config.files,
                {id} = ref;
            this.metaRef[id] = config;
            const {stationType} = config.files.stationDef,
                {type} = config.files.ref;
            this.type = type;
            div.appendChild(this.html(config));
            if (!container[type]) {

                container[type] = this.create(
                    id,
                    config
                );

            }
            container[type].contFunc(
                false,
                id,
                container[type].metaRef[id]
            );
            container[type].init(id);
            return container[type];

        },
        "file": undefined,
        "filePath": undefined,
        "preset": undefined,
        "cached": {},
        "rawData": [],
        "parser": undefined,
        "render": renderer,
        "reader": Papa.parse, // TODO be a module that are self contained
        "metaRef": {},
        "contFunc" (reset = false, id, config) {

            id = config.files.stationDef.id;
            if (!this.metaRef[id]) {

                this.metaRef[id] = config;

            }
            if (typeof this.rawData !== "undefined" && this.rawData.length > 0) {

                return this;

            }
            if (Object.keys(this.rawData).length > 0) {

                return false;

            }
            if (reset) {

                this.cached = {};

            }
            const ref = this;
            if (!this.rawData.then) {

                const path = ref.filePath(ref.file);
                this.rawData = new Promise((resolve, reject) => {

                    function data (file) {

                        return new Promise((resolve, reject) => {

                            /*
                             * Console.log(file)
                             * Console.log(ref.preset)
                             */
                            ref.preset.complete = function (result) {

                                // Console.log(result)
                                resolve(result);

                            };
                            ref.reader(
                                file,
                                ref.preset
                            );

                        }).catch((error) => {

                            console.log("FAILED TO LOAD DATA");
                            console.log(error);

                        });

                    }
                    ref.file.forEach((file, index) => {

                        /*
                         * TODO Demo
                         * If(demo[station] && demo[station][file]){
                         */

                        /*
                         * Console.log(demo[station][file])
                         * Ref.rawData.push(
                         * Data(demo[station][file]))
                         * }else{
                         */
                        try {

                            ref.rawData.push(data(path[index]));

                        } catch (error) {

                            console.log(file);
                            console.log(ref.rawData);
                            throw error;

                        }
                        // }

                    });
                    resolve(ref.rawData);

                });

            }
            return this;

        },
        "parseRawData" (tags) {

            let tag = tags[0],
                temp = this.parser,
		 {parser} = this;

            /*
             * Console.log("Parser")
             * Console.log(this.parser.pre)
             */
            if (!(typeof parser === "function")) {

                parser = parser[tag];

            }
            const rawDataPromise = this.rawData;
            return new Promise((resolve, reject) => {

                rawDataPromise.then((rawData) => {

                    resolve(Promise.all(rawData).then((rawData) => {

                        /*
                         * $.ajax({
                         * Type: "POST",
                         * Url: hostUrl+'/receive',
                         * Data: {
                         * Data: JSON.stringify(rawData)
                         * },
                         * Success: success,
                         * DataType: 'script'
                         * });
                         */
                        const data = parser(rawData);

                        /*
                         * Data.then(d => {
                         * Console.log(d['yrlyTest'])
                         * D['yrlyTest'].then(dn => {
                         * 	Console.log(dn)
                         * 	Console.log(dn['avg']['2001']['0'].valuesAll)
                         * 	// console.log(dn['avg']['2001']['0'])
                         * })
                         * })
                         */
                        return data;

                    }).
                        catch((error) => {

                            console.log("FAILED DATA PARSE");
                            console.log(tags);
                            console.log(tag);
                            console.log(parser);
                            console.log(temp);
                            throw error;

                        }));

                });

            });

        },
        "init" (id) {

            /*
             * Console.log(this.metaRef)
             * Console.log(id)
             */
            let tag = this.metaRef[id].files.ref.tag.data,
                // Var render = this.render;
                meta = this.metaRef[id],
                st_id = meta.files.stationDef.id;
            this.render.setup(meta);
            if (!Array.isArray(tag)) {

                tag = [tag];

            }
            if (!this.cached[id]) {

                this.cached[id] = {};

            }
            if (!this.cached[id][tag[0]]) {

                // Console.log('parse')
                this.cached[id][tag[0]] = this.parseRawData(tag);

            }

            /*
             * Console.log(this.cached[id][tag[0]])
             * Console.log(this.cached)
             * Console.log(tag)
             * Console.log(this.cached[id])
             */
            const data = new Promise((res, rej) => {

                if (tag) {

                    res(tagApply(
                        this.cached[id],
                        [...tag]
                    ));

                } else {

                    res(this.cached[id]);

                }

            });
            try {

                if (data.then) {

                    data.then((d) => {

                        this.render.initiate(
                            st_id,
                            d
                        );

                    });

                } else {

                    this.render.initiate(
                        st_id,
                        data
                    );

                }

            } catch (error) {

                console.log(id);
                console.log(data);
                console.log(error);
                throw error;

            }

            /*
             * })
             * This.render = render;
             */
            return this;

        },
        "clone" () {

            return {...this};

        },
        "create" (id, config) {

            /*
             * Console.log(id)
             * Console.log(config)
             */
            if (!this.metaRef[id]) {

                this.metaRef[id] = {};
                $.extend(
                    true,
                    this.metaRef[id],
                    config
                );

            }
            let cfg = config.files.config.parse,
		 {file} = cfg,
                {preset} = cfg,
                parser = parse[cfg.parser],
		 {local} = cfg,
                // Console.log(file)
                res = this.clone();
            res.metRef = this.metaRef[id];
            this.rawData = [];
            if (!Array.isArray(file)) {

                file = [file];

            }
            res.file = file;
            const station = config.files.stationDef.stationType.data;
            res.filePath = (files) => files.map((x) => filePath.station(
                x,
                station
            ));

            res.preset = preset;
            res.parser = parser;
            res.reader = Papa.parse;
            return res;

        }
    };
exports.struct = struct;
