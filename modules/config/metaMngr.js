const before = require("./charts/help.js").preset;
// Const { markdownToTxt } = require('markdown-to-txt');

const {Remarkable} = require("remarkable"),
    md = new Remarkable({
        "html": true, // Enable HTML tags in source
        "xhtmlOut": true, // Use '/' to close single tags (<br />)
        "breaks": true // Convert '\n' in paragraphs into <br>
    });


// Var station = require('../../static/charts/stationIDs.json');
exports.meta = {

    /*
     * MetaTable: function(id, json, i=0){
     * 	Object.keys(json).forEach(index => {
     * 		Var key = Object.keys(this.metaRef)[index];
     * 		If(typeof(this.metaRef[key]) == 'string'){
     * 			$('#'+id).append('<div id="'+id+'_cont"></div>');
     * 			$('#'+id+'_cont').append('<div id="'+id+'_button_'+key+'" class="mini_button">- '+key+'</div><br/>')
     * 			$('#'+id+'_cont').append('<div id="'+id+'_box_'+key+'" class="box"></div>');
     * 			$('#'+id+'_box_'+key).append('<textarea id="'+id+'_box'+key+'_textarea" class="json" cols="80">'+JSON.stringify(json[index], undefined, 4)+'</textarea>')
     * 			$('#'+id+'_box_'+key).append('<br/>')
     * 			$("#"+id+'_button_'+key).click(function(){
     * 				$("#"+id+"_box_"+key).slideToggle();
     * });
     * }
     * })
     * },
     */
    "getMeta" (type) {

        const st = type.stationType.config,
		 id = type.plot,
		 metaRef = new Promise((res, rej) => {

                $.getJSON(
                    `${hostUrl}/static/charts/stationType/${st}/${id}.json`,
                    (result) => {

                        result.config.parse = before(result.config.parse);
                        res(result);

                    }
                );

            }).catch((error) => {

                console.log(id);
                console.log(error);
                throw error;

            }),
            {textMorph} = this;
        try {

            return new Promise((res, rej) => {

                metaRef.then((files) => {

                    files.stationDef = type;
                    if (type.config) {

                        $.extend(
                            true,
                            files,
                            type.config.files
                        );

                    }
                    res({
                        files,
                        "aggr" () {

                            var iter = function (obj, meta = obj) {

                                    const res = {};
                                    Object.keys(obj).forEach((key) => {

                                        if (typeof obj[key] === "object") {

                                            res[key] = iter(
                                                obj[key],
                                                meta
                                            );

                                        } else if (typeof obj[key] === "string") {

                                            res[key] = textMorph(
                                                obj[key],
                                                meta
                                            );

                                        } else {

                                            res[key] = obj[key];

                                        }

                                    });
                                    return res;

                                },
                                lang = this.files.config.fixlang,
                                aggr = {
                                    "stationDef": this.files.stationDef
                                };
                            $.extend(
                                true,
                                aggr,
                                this.files[lang
                                    ? lang
                                    : nav_lang],
                                this.files.set
                            );
                            $.extend(
                                true,
                                aggr,
                                this.files.config,
                                this.files.set
                            );
                            aggr.subset = {};
                            $.extend(
                                true,
                                aggr.subset,
                                this.files.ref.subset,
                                this.files.subset
                            );

				aggr.tag = this.files.ref.tag;
                            aggr = iter(aggr);
                            return aggr;

                        },
                        "text" () {

                            return this.aggr();

                        }
                    });

                });

            });

        } catch (ERROR) {

            console.log(files);
            console.log(define);
            throw ERROR;

        }

    },
    "textMorph" (res, meta) {

        if (res) {

            try {

                // TODO order of month replace for subsets
                var res = res.replace(
                        "[stationName]",
                        meta.stationDef.stationName
                    ),

                    set = (meta.subset
                        ? meta.subset.enabled
                        : false)
                        ? meta.subset.set
                        : undefined;
                if (meta.time.months[set]) {

                    set = meta.time.months[set];

                }
                res = (meta.subset
                    ? meta.subset.enabled
                    : false)
                    ? res.replace(
                        "[month]",
                        set
                    )
                    : res.replace(
                        "[month]",
                        meta.month
                    );
                res = res.replace(
                    "[baselineLower]",
                    baselineLower
                );
                res = res.replace(
                    "[baselineUpper]",
                    baselineUpper
                );
                res = res.replace(
                    "[baseline]",
                    `${baselineLower} - ${baselineUpper}`
                );
                res = res.replace(
                    "[CO2]",
                    `CO${"2".sub()}`
                );
                res = res.replace(
                    "[SOME TEXT]",
                    ""
                );
                if (meta.extreme) {

                    res = res.replace(
                        "[lim]",
                        (meta.extreme.lim > 0
                            ? "+"
                            : "") + meta.extreme.lim
                    );

                }
                // Res = markdownToTxt(res);
                const tmp = md.render(res);
                if (!tmp.includes(res)) {

                    res = tmp;

                }
                if (meta.unitType && meta.units) {

                    var res = res.replace(
                        "[unit]",
                        meta.units[meta.unitType].singular
                    ).replace(
                        "[units]",
                        meta.units[meta.unitType].plural
                    ).
                        replace(
                            "[interval]",
                            meta.units[meta.unitType].interval
                        );

                }

            } catch (error) {

                console.log(this.id);
                console.log(meta);
                throw error;

            }

        } else {

            res = "";

        }
        return res;
        // Return res

    }
};
