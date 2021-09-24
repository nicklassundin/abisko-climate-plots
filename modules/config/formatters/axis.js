const date = require("./date"),

    yAxis = {
        "DOY" (value, form, shrt = false) {

            const month = "",
                year = date.spectrum(value),
		 reg = form(
                    year.regular,
                    shrt
                ),
		 leap = form(
                    year.leap,
                    shrt
                );
            if (year.regular.getMonth() == year.leap.getMonth()) {

                if (year.regular.getDate() == year.leap.getDate()) {

                    return reg;

                }
                return `${reg}-${leap.split(" ")[1]}`;

            }
            return `${reg} - ${leap}`;

        },
        "MMDD" (shrt = true) {

            return yAxis.DOY(
                this.value,
                date.formats.MMDD,
                shrt
            );

        },
        "MM" (shrt = false) {

            return yAxis.DOY(
                this.value,
                date.formats.MM,
                shrt
            );

        }
    };
exports.yAxis = yAxis;
exports.xAxis = {

};
