const help = require("./../helpers.js");
const regression = require("regression");

/*
 * Const { JSDOM } = require( "jsdom" );
 * const { window } = new JSDOM( "" );
 * const $ = require( "jquery" )( window );
 */

var struct = {
    "type": "mean",
    "meta": {
        "fields": [],
        "src": ""
    },
    // Values:	[],
    "VALUES": [],
    set "values" (val) {

        this.VALUES = val;

    },
    get "values" () {

        if (Array.isArray(this.VALUES)) {

            return this.VALUES;

        } else if (typeof this.VALUES === "object") {

            return Object.values(this.VALUES);

        }

        return undefined;


    },
    // TODO
    get "valuesAll" () {

        if (this.values[0] != undefined) {

            if (this.values[0].values != undefined) {

                return this.values.map((each) => each.values).reduce((a, c) => a.concat(c));

            }

            return this.values;


        }

        return this.values;


    },
    //
    "x": undefined,
    "y": undefined,
    "count":	undefined,
    "filter" (f, type = this.type, abs = true) {

        const value = [];
        if (this.values[0].filter && abs) {

            this.values.forEach((entry) => {

                value.push(entry.filter(
                    f,
                    type
                ));

            });
            return value;

        }
        return f(this);

        // Return struct.create(value, this.x, this.meta.src ).build(type);

    },
    "split" (f) {

        if (this.values[0].split) {

            return struct.create(
                this.values.map((each) => each.split(f)),
                this.x,
                src
            );

        }
        return struct.create(
            f(this.values),
            this.x,
            src
        );

    },
    "filterForm" (f, type, abs) {

        try {

            if (this.values[0].values) { // .values replace .filter ? TODO check

                return struct.create(this.values.map((each) => each.filter(
                    (entry) => {

                        const y = f(...entry.values.map((each) => each.y)),
					 date = entry.values.filter((each) => each.y == y).map((each) => new Date(each.x));
                        return {
                            "subX": date,
                            y,
                            "x": entry.x
                        };

                    },
                    type,
                    abs
                ))).build();

            }
            return struct.create(this.filter(
                (entry) => {

                    const y = f(...entry.values.map((each) => each.y));
                    return {
                        "subX": entry.values.filter((each) => each.y == y).map((each) => new Date(each.x)),
                        y,
                        "x": entry.x
                    };

                },
                type,
                abs
            )).build();

        } catch (error) {

            // Console.log(this.values)
            console.log(error);
            return {"values": undefined};

        }

    },
    "min" (abs = true) {

        return this.filterForm(
            Math.min,
            "min",
            abs
        );

    },
    "max" (abs = false) {

        return this.filterForm(
            Math.max,
            "max",
            abs
        );

    },
    "numberReq" () {

        console.log(this);
        return this;

    },
    "last" (f = (e) => e.y <= 0, type = this.type) {

        const res = this.filter((entry) => {

            const values = entry.values.filter(f),
			 date = new Date(Math.max(...Object.values(values).map((each) => new Date(each.x).getTime())));
            return {
                "fullDate": date,
                "year": date.getYear() + 1900,
                "month": date.getMonth(),
                "date": date.getDate(),
                "strDate": `${date.getYear() + 1900}-${date.getMonth()}-${date.getDate()}`,
                "y": help.dayOfYear(date),
                "x": entry.x
            };

        });
        res.splice(
            -1,
            1
        );
        return struct.create(res).build();

    },
    "first" (f = (e) => e.y <= 0, type = this.type) {

        const res = this.filter((entry) => {

            const values = entry.values.filter(f),
			 date = new Date(Math.min(...Object.values(values).map((each) => new Date(each.x).getTime())));
            return {
                "fullDate": date,
                "year": date.getYear() + 1900,
                "month": date.getMonth(),
                "date": date.getDate(),
                "strDate": `${date.getYear() + 1900}-${date.getMonth()}-${date.getDate()}`,
                "y": help.dayOfYear(date),
                "x": entry.x
            };

        });
        res.shift();
        return struct.create(res).build();

    },
    "occurrence" (f = (e) => e > 30) {

        const color = f(-100)
                ? "blue"
                : "red",
            res = struct.create(this.values.map((each) => ({
                "x": each.x,
                "y": each.values.filter((value) => f(value.y)).map((node) => node.x).
                    filter((v, i, a) => a.indexOf(v) === i).length
            })).filter((a) => a.y != 0)).build(
                undefined,
                undefined,
                undefined,
                color
            );
        return res;

    },
    "sequence" (f = (e) => e > 0) {

        const values = this.values.map((each) => {

                const res = {};
                this.keys.forEach((key) => {

                    res[key] = each[key];

                });
                res.y = f(each.y)
                    ? 1
                    : 0;
                res.x = this.x;
                res.start = each.x;
                res.end = each.x;
                return res;

            }),
            max = values.reduce(
                (a, b) => {

                    if (b.y > 0) {

                        if (a.length > 0) {

                            const i = a.length - 1;
                            if (a[i].y > 0) {

                                a[i].y += b.y;
                                a[i].end = b.end;

                            } else {

                                a.push(b);

                            }

                        } else {

                            a.push(b);

                        }

                    } else {

                        a.push(b);

                    }
                    return a;

                },
                []
            );

        /*
         * Console.log(max)
         * Fsdfsd
         */
        return struct.create(
            max,
            this.x
        ).build("max");

    },
    "variance" () {

        switch (this.type) {

        case "sum":
            return this.count * variance(this.values.map((each) => each.y));
            break;
        default:
            return variance(this.values.map((each) => each.y));

        }

    },
    "ci" () {

        return help.confidenceInterval(
            this.y,
            this.variance(),
            this.count
        );

    },
    "plotCI" () {

        let result = [],
		 e = this.ci(),
            {y} = this;
        this.values.forEach((each) => {

            if (each.ci) {

                e = each.ci();
                y = each.y;

            }
            result.push({
                "x": each.x,
                "high": e.high + (each.y - y),
                "low": e.low + (each.y - y)
            });

        });
        return result;

    },
    "closest" (date) {

        const oneDay = 24 * 60 * 60 * 1000,
            distance = [];
        this.values.forEach((each) => {

            const temp = new Date(each.x),
			 end = new Date(
                    temp.getYear() + 1900,
                    11,
                    31
                ),
			 start = new Date(
                    temp.getYear() + 1900,
                    0,
                    1
                ),
			 days = Math.round(Math.abs((start - end) / oneDay)),
			 degree = 360 / days;
            date = new Date(
                temp.getYear() + 1900,
                date.getMonth(),
                date.getDate()
            );
            const dis = Math.round(Math.abs((date - temp) / oneDay)),
			 degrees = dis * degree;
            // If(degrees > 180) degrees = 360 - degrees;
            distance.push(Math.round(degrees / degree));

        });
        const min = Math.min.apply(
                null,
                distance
            ),
            // Console.log(distance)
		 {values} = this,
            result = {
                "data": undefined,
                "interval": {
                    "y": {
                        "hi": undefined,
                        "lo": undefined
                    }
                }
            };
        distance.forEach((value, index) => {

            if (value == min) {

                result.data = values[index];

            }

        });
        return result;

    },
    "movAvg": undefined,
    "plotMovAvg" () {

        if (this.movAvg != undefined) {

            return this.movAvg;

        }
        let movAvg = movingAverages(
                this.values.map((each) => each.y),
                10
            ),
		 result = [],
		 variance = this.variance(),
		 {count} = this;
        this.values.forEach((each, index) => {

            if (each.variance) {

                variance = each.variance();

            }
            if (each.count) {

                count = each.count;

            }
            const e = help.confidenceInterval(
                movAvg[index],
                variance,
                count
            );
            result.push({
                "y": movAvg[index],
                "x": each.x,
                "high": e.high,
                "low": e.low
            });

        });
        return result.slice(10);

    },
    "plotMovAvgCI" () {

        if (this.movAvg == undefined) {

            this.movAvg = this.plotMovAvg();

        }
        return this.movAvg;

    },
    "linReg" () {

        const result = regression.linear(this.values.map((each, index) => [
            index,
            each.y
        ]));
        result.linReg.points = values.map((each, index) => [
            each.x,
            result.linReg.points[index][1]
        ]);
        return result;

    },
    "difference" (lower = baselineLower, upper = baselineUpper) {

        // Console.log([lower, upper])
        try {

            const basevalue = help.mean(this.values.filter((value) => value.x >= lower && value.x <= upper).map((each) => each.y));
            return Array.from(this.values.map((each) => [
                each.x,
                each.y - basevalue
            ]));

        } catch (ERROR) {

            console.log(ERROR);
            console.log(this);

        }

    },
    "xInterval": {},
    "build" (type = this.type, lower = baselineLower, upper = baselineUpper, color) {

        this.xInterval.x = new Date(Math.min.apply(
            null,
            this.values.map((each) => (each.xInterval
                    ? Math.min.apply(
null,
                        each.xInterval
)
                    : new Date(each.x)))
        )).getTime();
        this.xInterval.x2 = new Date(Math.max.apply(
            null,
            this.values.map((each) => (each.xInterval
                    ? Math.max.apply(
null,
                        each.xInterval
)
                    : new Date(each.x)))
        )).getTime();
        if (this.values.length > 0) {

            if (this.values[0].keys) {

                this.keys = this.values[0].keys;

            } else {

                this.keys = Object.keys(this.values[0]);

            }

        }
        this.type = type;
        this.values = this.values.filter((entry) => !isNaN(parseFloat(entry.y)) && isFinite(entry.y));
        const count = this.values.length;
        this.count = count;
        // Colorize
        const max = Math.max(...this.values.map((each) => each.y));
        values = this.values.map((each) => {

            switch (color) {

            case "red":
                each.color = `rgb(255,${255 - Math.floor(each.y * 255 / max)}, 0)`;
                break;
            case "blue":
                each.color = `rgb(${
                    255 - Math.floor(each.y * 255 / max)},${
                    255 - Math.floor(each.y * 255 / max)},${
                    255})`;

                /*
                 * Each.color = 'rgb(' + (255 - Math.floor(each.y * 255 / max)) + ',0,255)';
                 * Each.color = 'rgb(255,0,' + (255 - Math.floor(each.y * 127 / max)) + ')';
                 */
                break;
            case "green":
                each.color = `rgb(${255 - Math.floor(each.y * 255 / max)},255, 0)`;
                break;
            default:

                /*
                 * Var col = (255 - Math.floor(each.y * 255 / max));
                 * Each.color = 'rgb('+col+','+col+','+col+')';
                 */
                return each;


            }

        });
        let y;
        if (this.y == undefined) {

            switch (type) {

            case "mean":
                y = help.sum(this.values.map((each) => each.y));
                y /= count;
                break;
            case "max":
                y = Math.max(...this.values.map((each) => each.y));
                break;
            case "min":
                y = Math.min(...this.values.map((each) => each.y));
                break;
            case "sum":
                y = help.sum(this.values.map((each) => each.y));
                break;
            default:
                console.log(`default: ${type}`);

            }
            this.y = y;

        }
        return this;

    },
    "Axis" (key) {

        let keys = Object.values(this.values).map((each) => each[key]);
        keys = keys.filter((element, i) => i === keys.indexOf(element));
        const result = {};
        keys.forEach((each) => {

            result[each] = this.values.filter((entry) => each == entry[key]);

        });
        return result;

    },
    "clone" () {

        return {"values": [],
            ...this};

    },
    "keys": undefined,
    "create" (values, x = undefined, src = "") {

        const result = struct.clone();
        result.meta.src = src;
        try {

            values = values.filter((entry) => !isNaN(parseFloat(entry.y)) && isFinite(entry.y));

        } catch (err) {

            /*
             * Console.log(Object.keys($))
             * Console.log(values[0])
             * Console.log(this)
             * Console.log(err)
             */
            return undefined;

        }
        result.values = values.filter((each) => each.y || each.y == 0);
        result.x = x;
        return result;

    },
    "map" (F) {

        return struct.create(
            F(this.values),
            this.x
        );

    }
};
exports.struct = struct;

exports.parseByDate = require("./parseByDate.js").parseByDate;
