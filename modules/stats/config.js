
const help = require("./../helpers.js");
const parser = require("./struct.js"),
    {struct} = parser,
    {parseByDate} = parser;

/*
 * Var R = require('r-script');
 * var python=require('python').shell;
 * TODO temporary hotfix
 */
const constant = require("./../../static/const.json");
global.startYear = constant.startYear;
global.baselineLower = constant.baselineLower;
global.baselineUpper = constant.baselineUpper;

// Var preload = {
// Abisko: require('./../../data/abisko/preLoad.json'),
// }
// Var preparse = {
// }
// //

var parsers = {
    "Temp" (blocks) {

        return new Promise((resolve, reject) => {

            resolve(parseByDate(blocks.temperatures));

        });

    },
    "Prec" (blocks) {

        return new Promise((resolve, reject) => {

            resolve(parseByDate(
                blocks.precipitation,
                "sum"
            ));

        });

    },
    "Growth" (blocks) {

        return {
            "request" (key) {

                const temperature = this.temp;
                return new Promise((res, rej) => {

                    temperature.then((temp) => {

                        switch (key) {

                        case "last":
                            temp.yrlySplit.then((split) => {

                                res(split.min.last());

                            });
                            break;
                        case "first":
                            temp.yrlySplit.then((split) => {

                                res(split.min.first());

                            });
                            break;
                        case "days":
                            temp.yrly.then((yrly) => {

                                res(struct.create(Object.keys(yrly.avg.values).map((year) => yrly.avg.values[year].sequence())).build());

                            });
                            break;
                        case "weeks":
                            temp.weeks.then((weeks) => {

                                res(struct.create(weeks.avg.values.map((each) => each.sequence())).build());

                            });
                            break;
                        case "default":
                            rej("wrong keys");
                            break;

                        }

                    });

                });

            },
            "temp": parseByDate(blocks.temperatures),
            get "last" () {

                return this.request("last");

            },
            get "first" () {

                return this.request("first");

            },
            get "days" () {

                return this.request("days");

            },
            get "weeks" () {

                return this.request("weeks");

            }
        };

    },
    "CALM": {
        "perma" (result, src = "") {

            return new Promise((resolve, reject) => {

                result = result[0];
                const {fields} = result.meta;
                fields.shift();
                const {data} = result;
                data.splice(
                    0,
                    4
                );
                const stations = {"avg": {}};

                data.forEach((each) => {

                    Object.keys(each).forEach((key) => {

                        if (key != "") {

                            if (!stations[key]) {

                                stations[key] = [];

                            }
                            const entry = {
                                "x": Number(each[""]),
                                "y": !Number.isNaN(Number(each[key]))
                                    ? Number(each[key])
                                    : undefined
                            };
                            stations[key].push(entry);
                            if (!stations.avg[each[""]]) {

                                stations.avg[each[""]] = [];

                            }
                            if (entry.y) {

                                stations.avg[each[""]].push({
                                    "x": Number(each[""]),
                                    "y": !Number.isNaN(Number(each[key]))
                                        ? Number(each[key])
                                        : undefined
                                });

                            }

                        }

                    });

                });

                stations.avg = Object.keys(stations.avg).map((year) => ({
                    "x": Number(year),
                    "y": stations.avg[year].map((each) => each.y).reduce(
                        (a, b) => a + b,
                        0
                    ) / stations.avg[year].length
                }));
                Object.keys(stations).forEach((key) => {

                    stations[key] = struct.create(stations[key]).build();

                });
                resolve(stations);

            });

        }
    },
    "SCRIPPS_CO2" (result, src = "") {

        // TODO
        return new Promise((resolve, reject) => {

            result = result[0];
            const parse = function (entry) {

                    const x = new Date(entry[0]).getTime(),
				 y = parseFloat(entry[1]);
                    return {
                        x,
                        y
                    };

                },
                data = struct;
            data.values = Object.values(result.data.slice(44).map((each) => parse(each)));
            resolve(data.build());

        });

    },
    "GISSTEMP" (result, src = "") {

        return new Promise((resolve, reject) => {

            result = result[0];
            const {fields} = result.meta,
                meta = preSetMeta.default;
            meta.src = src;
            let temperatures = [];
            console.log(result);


            result.data.forEach((row) => {

                const year = {};

                fields.forEach((field) => year[field.toLowerCase()] = help.validNumber(row[field]));

                const monthlyTemperatures = months().map((month) => year[month]).
                    filter(Number);
                // Console.log(row)
                year.min = Math.min.apply(
                    null,
                    monthlyTemperatures
                );
                year.max = Math.max.apply(
                    null,
                    monthlyTemperatures
                );
                year.count = monthlyTemperatures.length;

                if (year.count > 0) {

                    year.avg = help.mean(monthlyTemperatures);

                    year.variance = 0;

                    if (year.count > 1) {

                        year.variance = variance(monthlyTemperatures);

                    }

                    year.ci = help.confidenceInterval(
                        year.avg,
                        year.variance,
                        year.count
                    );

                    temperatures.push(year);

                }

            });
            temperatures = temperatures.slice(33);
            [
                "min",
                "max",
                "avg"
            ].forEach((statistic) => {

                temperatures[statistic] = temperatures.map((temps) => ({
                    "x": temps.year,
                    "y": temps[statistic]
                }));

            });
            temperatures.movAvg = movingAverages(
                temperatures.map((temps) => temps.avg),
                10
            ).
                map((avg, index) => ({
                    "x": temperatures[index].year,
                    "y": avg
                }));

            temperatures.ci = temperatures.map((temps) => ({
                "x": temps.year,
                "low": temps.ci.low,
                "high": temps.ci.high
            }));

            temperatures.ciMovAvg = temperatures.ci.map((each) => ({"x": each.x}));

            [
                "low",
                "high"
            ].forEach((bound) => {

                movingAverages(
                    temperatures.ci.map((each) => each[bound]),
                    10
                ).
                    forEach((value, index) => temperatures.ciMovAvg[index][bound] = value);

            });
            temperatures.meta = meta;
            temperatures.src = src;
            temperatures.ciMovAvg = temperatures.ciMovAvg.slice(10);
            resolve(temperatures);

        });

    },
    "GISSTEMPzonalMeans": {
        "pre" (result) {

            try {

                result = result[0];
                const fields = result.meta.fields.map((each) => each),
				 keys = fields.slice(0),
				 year = keys.shift(),
				 {data} = result;
                return data;

            } catch (error) {

                console.log(result);
                throw error;

            }

        },
        "parse" (result, key) {

            try {

                return new Promise((res, rej) => {

                    const data = parsers.GISSTEMPzonalMeans.pre(result),
					 build = function (key) {

                            const str = struct.create;
                            return struct.create(data.map((each) => ({
                                "x": each.Year,
                                "y": each[key]
                            }))).build();

                        };
                    res(build(key));

                });

            } catch (error) {

                console.log(result);
                throw error;

            }

        },
        "64n-90n" (result) {

            return parsers.GISSTEMPzonalMeans.parse(
                result,
                "64N-90N"
            );

        },
        "nhem" (result) {

            return parsers.GISSTEMPzonalMeans.parse(
                result,
                "NHem"
            );

        },
        "glob" (result) {

            return parsers.GISSTEMPzonalMeans.parse(
                result,
                "Glob"
            );

        }
    },
    "AbiskoCsv": {
        "pre" (result) {

            /*
             * If(preparse['AbiskoCsv']){
             * 	Console.log(preparse['AbiskoCsv'])
             * 	Return preparse['AbiskoCsv']
             * }
             * Console.log(result)
             * $.get(
             * 	"/parser/rscript",
             * 	{data : result},
             * 	Function(data) {
             * 		Console.log("rscript")
             * 		Console.log(data)
             * 	}
             * );
             */
            const blocks = {"precipitation": [],
                    "temperatures": []},
			 parseEntry = function (y) {

                    if (y != undefined) {

                        return parseFloat(y.replace(
                            ",",
                            "."
                        ));

                    }
                    return y;

                },

                insertToBlocks = function (data) {

                    try {

                        data.forEach((entry) => {

                            let zero = 0,
						 {date} = entry,
                                {avg} = entry,
                                {min} = entry,
                                {max} = entry,
                                {total} = entry;
                            if (total == undefined) {

                                zero = undefined;

                            }
                            blocks.temperatures.push({
                                "avg": {
                                    "x": date,
                                    "y": avg
                                },
                                "min": {
                                    "x": date,
                                    "y": min
                                },
                                "max": {
                                    "x": date,
                                    "y": max
                                }

                            });
                            blocks.precipitation.push({

                                "total": {
                                    "x": date,
                                    "y": total
                                },
                                "snow": {
                                    "x": date,
                                    "y": avg < 0
                                        ? total
                                        : zero
                                },
                                "rain": {
                                    "x": date,
                                    "y": avg >= 0
                                        ? total
                                        : zero
                                }
                            });

                        });

                    } catch (e) {

                        console.log(data);

                    }

                };
            insertToBlocks(result[0].data.map((entry) => ({
                "date": entry.Time,
                "avg": parseEntry(entry.Temp_avg),
                "total": parseEntry(entry.Precipitation),
                "min": parseEntry(entry.Temp_min),
                "max": parseEntry(entry.Temp_max)
            })));
            const res = {};
            result[2].data.forEach((entry) => {

                res[entry.Time] = entry.Precipitation;

            });
            insertToBlocks(result[1].data.map((entry) => ({
                "date": entry["Time(UTC)"],
                "avg": parseEntry(entry["AirTemperature (°C)"]),
                "total": parseEntry(res[entry["Time(UTC)"]]),
                "min": parseEntry(entry.Minimim_AirTemperature),
                "max": parseEntry(entry.Maximum_AirTemperature)
            })));
            return blocks;

        },
        "temperatures" (result) {

            return parsers.Temp(parsers.AbiskoCsv.pre(result));

        },
        "precipitation" (result) {

            return parsers.Prec(parsers.AbiskoCsv.pre(result));

        },
        "growingSeason" (result) {

            return parsers.Growth(parsers.AbiskoCsv.pre(result));

        }
    },
    "AbiskoIceData": {
        "pre" (result) {

            result = result[0];
            const {fields} = result.meta,
                {data} = result,
                // Console.log(data)
                iceData = [];
            data.forEach((row) => {

                function isLeapYear (year) {

                    return year % 400 === 0 || year % 100 !== 0 && year % 4 === 0;

                }
                // Console.log(row)
                const winterYear = Number(row[fields[0]]) || undefined,
				 springYear = Number(row[fields[1]]) || undefined,
				 freezeDate = help.parseDate(row[fields[2]]),
				 freezeWeek = freezeDate.year > 0
                        ? help.weekNumber(help.createDate(freezeDate))
                        : null,
				 freezeDOY = freezeDate.year > 0
                        ? help.dayOfYear(help.createDate(freezeDate))
                        : null,
                    breakupDate = help.parseDate(row[fields[3]]),
				 breakupWeek = breakupDate.year > 0
                        ? help.weekNumber(help.createDate(breakupDate))
                        : null,
				 breakupDOY = breakupDate.year > 0
                        ? help.dayOfYear(help.createDate(breakupDate))
                        : null,
                    iceTime = help.validNumber(row[fields[4]]) || null,

				 yearDays = isLeapYear(freezeDate.year)
                        ? 366
                        : 365;
                if (springYear) {

                    iceData[springYear] = {
                        "breakupDate": breakupDate.year > 0
                            ? help.createDate(breakupDate)
                            : null,
                        breakupDOY,
                        breakupWeek,
                        "freezeDate": freezeDate.year > 0
                            ? help.createDate(freezeDate)
                            : null,
                        "freezeDOY": freezeDOY + (freezeDOY < breakupDOY
                            ? yearDays
                            : 0),

                        /*
                         * FreezeDOY: freezeDOY,
                         * FreezeWeek: freezeWeek + (freezeWeek < breakupWeek ? 52 : 0),
                         */
                        freezeWeek,
                        iceTime
                    };

                }

            });

            const yearly = (statistic) => iceData.map((each, year) => ({
                    "x": Number(year),
                    "y": each[statistic]
                })).filter((each) => each.y).
                    filter((each) => each.x >= 1909),

			 dateFormat = (date) => `${date.getFullYear()} ${help.monthName(help.monthByIndex(date.getMonth()))} ${date.getDate()}`,

                breakupDOY = struct.create(iceData.map((each, year) => ({
                    "x": Number(year),
                    "y": each.breakupDOY,
                    "name": each.breakupDate
                        ? dateFormat(each.breakupDate)
                        : null,
                    "week": each.breakupDate
                        ? help.weekNumber(each.breakupDate)
                        : null,
                    "date": each.breakupDate
                })).filter((each) => each.y).
                    filter((each) => each.x >= 1909).
                    filter((each) => each.name != null)).build(),

			 freezeDOY = struct.create(iceData.map((each, year) => ({
                    "x": Number(year),
                    "y": each.freezeDOY,
                    "name": each.freezeDate
                        ? dateFormat(each.freezeDate)
                        : null,
                    "week": each.freezeDate
                        ? help.weekNumber(each.freezeDate)
                        : null,
                    "date": each.freezeDate
                })).filter((each) => each.y).
                    filter((each) => each.x >= 1909).
                    filter((each) => each.name != null)).build(),
			 breakup = {
                    "week": breakupDOY.map((each) => ({
                        "x": each.x,
                        "y": each.date,
                        "name": each.name
                    })),
                    "date": breakupDOY.map((each) => ({
                        "x": each.x,
                        "y": each.date,
                        "name": each.name
                    }))
                },


                freeze = {
                    "week": freezeDOY.map((each) => {

                        const weekNo = help.weekNumber(help.dateFromDayOfYear(
                            each.x,
                            each.y
                        ));
                        return {
                            "x": each.x,
                            "y": weekNo + (weekNo < 10
                                ? 52
                                : 0),
                            "name": each.name
                        };

                    }),
                    "date": freezeDOY.map((each) => ({
                        "x": each.x,
                        "y": each.date,
                        "name": each.name
                    }))
                },
                calculateMovingAverages = (values) => movingAverages(
                    values.map((v) => v.y),
                    10
                ).map((avg, i) => ({
                    "x": values[i].x,
                    "y": avg
                })),


                iceTime = struct.create(yearly("iceTime")).build(),

			 yearMax = iceData.length - 1;

            return {
                "yearMax": new Promise((res, rej) => {

                    res(yearMax);

                }),
                "breakup": new Promise((res, rej) => {

                    res(breakup);

                }),
                "freeze": new Promise((res, rej) => {

                    res(freeze);

                }),
                "DOY": new Promise((res, rej) => {

                    res({
                        "breakup": breakupDOY,
                        "freeze": freezeDOY
                    });

                }),
                "iceTime": new Promise((res, rej) => {

                    res(iceTime);

                })
            };

        },
        "yearMax" (blocks) {

            return parsers.AbiskoIceData.pre(blocks).yearMax;

        },
        "breakup" (blocks) {

            return parsers.AbiskoIceData.pre(blocks).breakup;

        },
        "freeze" (blocks) {

            return parsers.AbiskoIceData.pre(blocks).freeze;

        },
        "DOY" (blocks) {

            return parsers.AbiskoIceData.pre(blocks).DOY;

        },
        "iceTime" (blocks) {

            return parsers.AbiskoIceData.pre(blocks).iceTime;

        }
    },
    "AbiskoLakeThickness": {
        "cache": undefined,
        "pre" (result) {

            parsers.AbiskoLakeThickness.cache = new Promise((resolve, reject) => {

                let {data} = result[0],
                    rawData = [];
                data.forEach((each) => {

                    const res = {
                        "y": Number(each["Hela istäcket"]),
                        "x": each.Datum
                    };
                    rawData.push(res);

                });
                data = rawData.map((each) => {

                    const temp = {
                        "total": each
                    };
                    return temp;

                });
                parseByDate(data).then((res) => {

                    const yrly = res.yrlySplit;
                    // Console.log(yrly)
                    resolve(yrly);

                });

            });
            return parsers.AbiskoLakeThickness.cache;

        },
        "yrly" (blocks) {

            return parsers.AbiskoLakeThickness.pre(blocks);

        },
        "date" (blocks) {

            return new Promise((res, rej) => {

                parsers.AbiskoLakeThickness.pre(blocks).then((yrly) => {

                    const dateSelect = function (date) {

                        const close = [];
                        yrly.total.values.forEach((each) => {

                            let res = each.closest(date),
							 resDate = new Date(res.data.x),
							 xYear = resDate.getFullYear();
                            if (help.isFirstHalfYear(resDate.getMonth() + 1)) {

                                xYear -= 1;

                            }
                            close.push({
                                "x": xYear,
                                "y": res.data.y,
                                "date": res.data.x
                            });

                        });
                        return struct.create(close).build();

                    };
                    res(dateSelect);

                });

            });

        }
    },
    "AbiskoSnowData": {
        "cache": undefined,
        "pre" (result) {

            result = result[0];
            let {data} = result,
                {fields} = result.meta,
                periods = [
                // { start: 1913, end: 1930 },
                    {"start": 1931,
                        "end": 1960},
                    {"start": 1961,
                        "end": 1990},
                    {"start": 1991,
                        "end": Infinity},
                    {"start": -Infinity,
                        "end": Infinity}
                ],

			 decades = [

                    /*
                     * { start: 1931, end: 1940, },
                     * { start: 1941, end: 1950, },
                     * { start: 1951, end: 1960, },
                     */
                    {"start": 1961,
                        "end": 1970},
                    {"start": 1971,
                        "end": 1980},
                    {"start": 1981,
                        "end": 1990},
                    {"start": 1991,
                        "end": 2000},
                    {"start": 2001,
                        "end": 2010},
                    {"start": 2011,
                        "end": Infinity},
                    {"start": -Infinity,
                        "end": Infinity} // Entire period
                ],

			 snow = [],

			 all = {
                    "singleStake": []
                };
            data.forEach((row) => {

                const date = help.parseDate(row[fields[0]]),
				 depthSingleStake = help.validNumber(row[fields[1]]);
                if (date.year && depthSingleStake) {

                    all.singleStake.push({
                        "avg": {
                            "y": depthSingleStake,
                            "x": row[fields[0]]
                        }
                    });
                    const year = snow[date.year] = snow[date.year] || [],
					 month = year[date.month] = year[date.month] || {"sum": 0,
                            "count": 0};
                    month.sum += depthSingleStake;
                    month.count++;

                }

            });

            all.singleStake = parseByDate(all.singleStake);
            snow.forEach((year) => {

                for (let i = 1; i <= 12; i++) {

                    const m = year[i];
                    year[i] = m
                        ? m.sum / m.count
                        : null;

                }

            });


            const calculateMeans = (periods) => new Promise((res, rej) => {

                    const set = {};
                    periods.forEach((period) => {

                        const key = period.start === -Infinity
                                ? "allTime"
                                : period.start.toString(),
						 means = set[key] = {
                                period,
                                "means": []
                            };
                        means.period.toString = () => {

                            const {start} = means.period,
                                {end} = means.period;
                            if (key === "allTime") {

                                return "Entire period";

                            }
                            return `From ${start} to ${end === Infinity
                                ? "present"
                                : end}`;

                        };
                        snow.filter((_, year) => year >= period.start && year <= period.end).forEach((year) => {

                            year.forEach((depth, month) => {

                                if (depth) {

                                    const m = means.means[month - 1] = means.means[month - 1] || {"sum": 0,
                                        "count": 0};
                                    m.sum += depth;
                                    m.count++;

                                }

                            });

                        });
                        for (let i = 0; i < 12; i++) {

                            const m = means.means[i];
                            means.means[i] = m
                                ? m.sum / m.count
                                : NaN;

                        }

                    });
                    res(set);

                }),

                periodMeans = calculateMeans(periods),
			 decadeMeans = calculateMeans(decades);
            return {
                periodMeans,
                decadeMeans,
                "snowDepth": all
            };

        },
        "periodMeans" (blocks) {

            return parsers.AbiskoSnowData.pre(blocks).periodMeans;

        },
        "decadeMeans" (blocks) {

            return parsers.AbiskoSnowData.pre(blocks).decadeMeans;

        },
        "snowDepth" (blocks) {

            return parsers.AbiskoSnowData.pre(blocks).snowDepth;

        }
    },
    "smhiTemp": {
        "pre" (result) {

            // Console.log(result)
            const blocks = {},
			 avgs = {},
			 parse = function (entry) {

                    const x = entry[0],
				 y = parseFloat(entry[1]);
                    avgs[x] = y;
                    return {
                        "avg": {
                            x,
                            y
                        },
                        "max": {
                            x,
                            y
                        },
                        "min": {
                            x,
                            y
                        }
                    };

                };
            blocks.temperatures = Object.values(result[0].data.map((each) => {

                const temp = [
                    each["Representativt dygn"],
                    each.Lufttemperatur
                ];
                return parse(temp);

            }));
            const parsePrecip = function (entry) {

                // Var x = (new Date(entry[0])).getTime();
                let total = parseFloat(entry[1]),
				 zero = 0,
				 date = entry[0];
                if (total == undefined) {

                    zero = undefined;

                }
                const avg = avgs[date];
                return {
                    "total": {
                        "x": date,
                        "y": total
                    },
                    "snow": {
                        "x": date,
                        "y": avg < 0
                            ? total
                            : zero
                    },
                    "rain": {
                        "x": date,
                        "y": avg >= 0
                            ? total
                            : zero
                    }
                };

            };
            blocks.precipitation = Object.values(result[1].data.map((each) => {

                const prec = [
                    each["Representativt dygn"],
                    each["Nederbördsmängd"]
                ];
                return parsePrecip(prec);

            }));
            return blocks;

        },
        "temperatures" (result) {

            return parsers.Temp(parsers.smhiTemp.pre(result));

        },
        "precipitation" (result) {

            return parsers.Prec(parsers.smhiTemp.pre(result));

        },
        "growingSeason" (result) {

            return parsers.Growth(parsers.smhiTemp.pre(result));

        }
    }

};


exports.parsers = parsers;


