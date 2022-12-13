
const constant = require("../../../static/const.json");
global.baselineLower = constant.baselineLower;
global.baselineUpper = constant.baselineUpper;
global.startYear = constant.startYear;
// Var date = require('../formatters/date');
// const helper = require("../../helpers");
const helper = require('climate-plots-helper')


exports.plotLines = {
    "baseline" (id) {
        return plotLines = [
            {
                "color": "rgb(160, 160, 160)",
                "value": baselineUpper,
                "width": 1,
                "label": {
                    "useHTML": true,
                    "text": `<input id=${id}uppLabel type=text class=input value=${baselineUpper} maxlength=4 onclick=selectText(this) onchange=renderInterface.updatePlot(${id},${baselineLower},this.value)></input>`,
                    "rotation": 0,
                    "y": 12
                },
                "zIndex": 1
            }, {
                "color": "rgb(160, 160, 160)",
                "value": baselineLower,
                "width": 1,
                "label": {
                    "useHTML": true,
                    "text": `<input id=${id}lowLabel type=text class=input value=${baselineLower} maxlength=4 onclick=selectText(this) onchange=renderInterface.updatePlot(${id},this.value,${baselineUpper})></input>`,
                    "rotation": 0,
                    "textAlign": "left",
                    "x": -40,
                    "y": 12
                },
                "zIndex": 5
            }
        ];

    },
    "DoY" () {
        return [
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12
        ].map((month) => ({
            "color": "rgb(245, 245, 245)",
            "value": (helper.dayOfYear(new Date(
                2000,
                month,
                1
            )) + helper.dayOfYear(new Date(
                1999,
                month,
                1
            ))) / 2,
            "label": {
                "useHTML": true,
                "text": helper.monthByIndex(month)
            }
        }));

    }
};
exports.plotBands = {
    "diff" (id) {

        return {
            "color": "rgb(245, 245, 245)",
            "from": baselineLower,
            "to": baselineUpper,
            "label": {
                "useHTML": true,
                "text": `<div id=${id}-plotBands-Label class=plotband>Baseline</div>`
            }
        };

    }
};
exports.baseline = {
    "resetPlot" (id) {

        return function (a) {

            return function (b) {

                switch (a) {

                case "baselineLower":
                    // Console.log("Lower")
                    baselineLower = b;
                    break;
                case "baselineUpper":
                    // Console.log("Upper")
                    baselineUpper = b;
                    break;
                default:
                    break;

                }
                updatePlot(id.id);

            };

        };

    }
};
