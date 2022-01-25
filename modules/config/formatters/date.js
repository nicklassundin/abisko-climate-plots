const help = require('climate-plots-helper');
const time = require('../../../static/lang/time.json');

const dateFormat = (date) => `${date.getFullYear()} ${time[nav_lang].months[help.months()[date.getMonth()]]} ${date.getDate()}`;

var formats = {
    "YYYYMMDD": (date) => {

        try {

            return `${date.getFullYear()} ${formats.MM(date)} ${formats.DD(date)}`;

        } catch (error) {

            return "";

        }

    },
    "MMDD": (date, shrt = false) => {

        try {

            return `${formats.MM(
                date,
                shrt
            )} ${formats.DD(
                date,
                shrt
            )}`;

        } catch (error) {

            return "";

        }

    },
    "DD": (date) => date.getDate(),
    "MM": (date, shrt = false) => (shrt
        ? time[nav_lang].monthShort
        : time[nav_lang].months)[help.months()[date.getMonth()]]
};
exports.formats = formats;
exports.spectrum = function (value) {

    return {
        "regular": new Date(
            1999,
            0,
            1
        ).addDays(value - 1),
        "leap": new Date(
            2000,
            0,
            1
        ).addDays(value - 1)
    };

};
