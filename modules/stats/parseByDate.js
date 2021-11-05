const help = require('climate-plots-helper');
const regression = require("regression");
const {struct} = require("./struct.js"),
    parseByDate = function (values, type = "mean", src = "", custom) {

        return new Promise((res, rej) => {

            const keys = Object.keys(values[0]),
                frame = {
                    "weeks": {},
                    "yrly": {},
                    "yrlyTest": {},
                    "yrlyFull": {},
                    "yrlySplit": {},
                    "decades": {},
                    "monthly": {},
                    "spring": {},
                    "summer": {},
                    "autumn": {},
                    "winter": {},
                    "customPeriod": {},
                    "DOY": {},
                    "meta": {
                        src
                    }
                },
                data = {
                    "weeks": {},
                    "yrly": {},
                    "yrlyTest": {},
                    "yrlyFull": {},
                    "yrlySplit": {},
                    "decades": {},
                    "monthly": {},
                    "spring": {},
                    "summer": {},
                    "autumn": {},
                    "winter": {},
                    "customPeriod": {},
                    "DOY": {},
                    "meta": {
                        src
                    },
                    "insert" (entries) {

                        const result = {...frame},
                            // TODO build to general function to be use for all functions
                            set = function (entry, key, date) {

                                var insert = (...k) => function (data = result, e = entry) {

                                        const kn = k[0];
                                        if (!data[kn]) {

                                            if (k.length > 1) {

                                                data[kn] = insert(...k.slice(1))({});

                                            } else {

                                                data[kn] = struct.create(
                                                    [],
                                                    kn,
                                                    type
                                                );

                                            }

                                        } else if (k.length > 1) {

                                            data[kn] = insert(...k.slice(1))(data[kn]);

                                        } else {

                                            data[kn].values.push(e);

                                        }
                                        return data;

                                    },

                                    year = date.getFullYear();
                                entry.year = year;
                                if (!years[`${year}`]) {

                                    years[year] = `${year}`;

                                }

                                /*
                                 * Entry.month = date.getMonth();
                                 * Entry.week = date.getWeekNumber();
                                 * Entry.monthName = help.monthByIndex(entry.month)
                                 * Entry.season = help.getSeasonByIndex(entry.month);
                                 * Entry.decade = entry.year - entry.year % 10;
                                 * Entry.key = key;
                                 * Result.all.push(entry)
                                 */
                                var year = date.getFullYear(),
					 month = date.getMonth(),
					 week = date.getWeekNumber(),
					 monthName = help.monthByIndex(month),
                                    // Seasons
                                    season = help.getSeasonByIndex(month);
                                insert(
                                    season,
                                    key,
                                    year
                                )();
                                insert(
                                    "yrly",
                                    key,
                                    year
                                )();

                                /*
                                 * TODO test
                                 * Insert('yrlyTest', key, year, month)()
                                 * Insert('yrlyWeek', key, year, week)()
                                 * Decades
                                 */
                                const decade = year - year % 10;
                                insert(
                                    "decades",
                                    key,
                                    decade
                                )();

                                // Split year over 6 month
                                let splitYear = year;
                                if (help.isFirstHalfYear(month)) {

                                    splitYear = year - 1;

                                }
                                // Split for Winter
                                insert(
                                    "yrlySplit",
                                    key,
                                    splitYear
                                )();

                                // Decade month split
                                insert(
                                    "yrlyFull",
                                    decade,
                                    key,
                                    monthName
                                )();

                                // Monthly
                                insert(
                                    "monthly",
                                    monthName,
                                    key,
                                    year
                                )();

                                /*
                                 * Weeks
                                 * Var wE = {};
                                 * Object.assign(wE, entry)
                                 * WE.x = week;
                                 * Insert('weeks', key, year)(wE);
                                 */
                                insert(
                                    "weeks",
                                    key,
                                    year,
                                    week
                                )();
                                // Custom period
                                if (custom) {

                                    if (!result.customPeriod) {

                                        result.customPeriod = {};

                                    }
                                    if (!result.customPeriod[key]) {

                                        result.customPeriod[key] = {};

                                    }
                                    const pkey = custom(date);
                                    if (pkey) {

                                        if (!result.customPeriod[key][pkey]) {

                                            result.customPeriod[key][pkey] = struct.create(
                                                [],
                                                pkey,
                                                type
                                            );

                                        }
                                        result.customPeriod[key][pkey].values.push(entry);

                                    }

                                }

                                return result;

                            },
                            years = [],
                            build = function (entries) {

                                let values = {};
                                entries.forEach((entry) => {

                                    let date;
                                    keys.forEach((key) => {

                                        values = set(
                                            entry[key],
                                            key,
                                            new Date(entry[key].x)
                                        );

                                    });

                                });
                                var construct = function (bValues, x) {

                                    const str = [];
                                    try {

                                        Object.keys(bValues).forEach((key) => {

                                            const entry = bValues[key];
                                            if (entry.build) {

                                                str.push(entry.build(type));

                                            } else {

                                                str.push(construct(
                                                    entry,
                                                    parseInt(key)
                                                ));

                                            }

                                        });
                                        try {

                                            return struct.create(
                                                str,
                                                x
                                            ).build(type);

                                        } catch (error) {

                                            console.log("struct.create(str,x)");

                                            /*
                                             * Console.log("str")
                                             * Console.log(str);
                                             */
                                            console.log("x");
                                            console.log(x);
                                            throw error;

                                        }

                                    } catch (error) {

                                        console.log(error);
                                        // Console.log(str)
                                        console.log(x);
                                        console.log(bValues);

                                        /*
                                         * Console.log(values)
                                         * Console.log(struct.create(str, x))
                                         * Console.log(entries)
                                         */
                                        throw error;

                                    }

                                };
                                // Console.log(values.decades)
                                return {
                                    values,
                                    "parsed": {},
                                    "request" (key) {

                                        return new Promise((res, rej) => {

                                            if (this.parsed[key]) {

                                                res(this.values[key]);

                                            } else {

                                                this.parsed[key] = true;
                                                switch (key) {

                                                case "monthly":
                                                    Object.keys(this.values[key]).forEach((month) => {

                                                        keys.forEach((tkey) => {

                                                            this.values[key][month][tkey] = construct(
                                                                this.values[key][month][tkey],
                                                                parseInt(month)
                                                            );

                                                        });

                                                    });
                                                    res(this.values[key]);
                                                    break;
                                                case "weeks":

                                                    /*
                                                     * TODO
                                                     * Console.log(values[key])
                                                     */
                                                    keys.forEach((tkey) => {

                                                        this.values[key][tkey] = construct(this.values[key][tkey]);

                                                    });
                                                    res(this.values[key]);
                                                    break;
                                                case "yrly":
                                                    keys.forEach((tkey) => {

                                                        this.values[key][tkey] = construct(this.values[key][tkey]);

                                                    });
                                                    res(this.values[key]);
                                                    break;
                                                case "yrlyFull":
                                                    Object.keys(values[key]).forEach((year) => {

                                                        keys.forEach((tkey) => {

                                                            this.values[key][year][tkey] = construct(
                                                                this.values[key][year][tkey],
                                                                parseInt(year)
                                                            );

                                                        });

                                                    });
                                                    res(this.values[key]);
                                                    break;
                                                case "yrlyTest":
                                                    res(this.values[key]);
                                                    break;
                                                case "dailyExtremeHigh":
                                                    this.yrly.then((y) => {

                                                        this.values[key] = (y.max
                                                            ? y.max
                                                            : y.total).max(false);
                                                        res(this.values[key]);

                                                    });
                                                    break;
                                                case "dailyExtremeMaxLim":
                                                    this.yrly.then((y) => {

                                                        // This.values[key] = (y.max ? y.max : y.total).occurrence((e) => 30 < e);
                                                        this.values[key] = y.max
                                                            ? y.max
                                                            : y.total,
                                                        res(this.values[key]);

                                                    });
                                                    break;
                                                case "dailyExtremeMinLim":
                                                    this.yrly.then((y) => {

                                                        // This.values[key] = (y.max ? y.max : y.total).occurrence((e) => 30 < e);
                                                        this.values[key] = y.min
                                                            ? y.min
                                                            : y.total,
                                                        res(this.values[key]);

                                                    });
                                                    break;
                                                case "weeksExtremeHigh":
                                                    this.weeks.then((y) => {

                                                        this.values[key] = (y.max
                                                            ? y.max
                                                            : y.total).max(false);
                                                        res(this.values[key]);

                                                    });
                                                    break;
                                                case "yrlySplit":
                                                    keys.forEach((tkey) => {

                                                        this.values[key][tkey] = construct(values[key][tkey]);

                                                    });
                                                    res(this.values[key]);
                                                    break;
                                                case "decades":
                                                    Object.keys(this.values[key]).forEach((tkey) => {

                                                        this.values[key][tkey] = struct.create(Object.keys(this.values[key][tkey]).map((decade) => this.values[key][tkey][decade] = val[tkey][decade].build(type))).build(type);

                                                    });
                                                    res(this.values[key]);
                                                    break;
                                                case "customPeriod":
                                                    Object.keys(this.values[key]).forEach((tkey) => {

                                                        this.values[key][tkey] = struct.create(Object.keys(this.values[key][tkey]).map((decade) => this.values[key][tkey][decade].build(type))).build(type);

                                                    });
                                                    this.parsed[key] = true;
                                                    res(this.values[key]);
                                                    break;
                                                case "meta":
                                                    res(this.values[key]);
                                                    break;
                                                case "season" | "spring" | "summer" | "winter" | "autumn":
                                                    keys.forEach((tkey) => {

                                                        if (this.values[key][tkey]) {

                                                            this.values[key][tkey] = construct(
                                                                this.values[key][tkey],
                                                                help.seasons[key]
                                                            );

                                                        }

                                                    });
                                                    this.parsed[key] = true;
                                                    res(this.values[key]);
                                                    break;
                                                default:
                                                    keys.forEach((tkey) => {

                                                        if (this.values[key][tkey]) {

                                                            this.values[key][tkey] = construct(
                                                                this.values[key][tkey],
                                                                help.seasons[key]
                                                            );

                                                        }

                                                    });
                                                    this.parsed[key] = true;
                                                    res(this.values[key]);
                                                    break;

                                                }

                                            }

                                        });

                                    },
                                    "get" () {

                                        return this.request("");

                                    },
                                    get "monthly" () {

                                        return this.request("monthly");

                                    },
                                    get "weeks" () {

                                        return this.request("weeks");

                                    },
                                    get "weeksExtremeHigh" () {

                                        return this.request("weeksExtremeHigh");

                                    },
                                    get "weeksExtremeHighLim" () {

                                        return this.request("weeksExtremeHighLim");

                                    },
                                    get "yrly" () {

                                        return this.request("yrly");

                                    },
                                    get "yrlyFull" () {

                                        return this.request("yrlyFull");

                                    },
                                    get "dailyExtremeHigh" () {

                                        return this.request("dailyExtremeHigh");

                                    },
                                    get "dailyExtremeMaxLim" () {

                                        return this.request("dailyExtremeMaxLim");

                                    },
                                    get "dailyExtremeMinLim" () {

                                        return this.request("dailyExtremeMinLim");

                                    },
                                    get "yrlySplit" () {

                                        return this.request("yrlySplit");

                                    },
                                    get "decades" () {

                                        return this.request("decades");

                                    },
                                    get "customPeriod" () {

                                        return this.request("customPeriod");

                                    },
                                    get "meta" () {

                                        return this.request("meta");

                                    },
                                    get "spring" () {

                                        return this.request("spring");

                                    },
                                    get "summer" () {

                                        return this.request("summer");

                                    },
                                    get "autumn" () {

                                        return this.request("autumn");

                                    },
                                    get "winter" () {

                                        return this.request("winter");

                                    },
                                    get "yrlyTest" () {

                                        return this.request("yrlyTest");

                                    }
                                };

                            },
                            answer = build(entries);
                        return answer;

                    }
                };
            res(data.insert(values));

        });

    };
exports.parseByDate = parseByDate;

