// TODO create a builder instead of this mess

const dateFormats = require("./date").formats;

exports.formatters = function (meta) {
    return {
        "winterDOY" () {
            try {

                let tooltip = `<span style="font-size: 10px">${this.x - 1}/${this.x}</span><br/>`;
                this.points.forEach((point) => {

                    const dec = point.series.options.tooltip.valueDecimals;
                    tooltip += `<span style="color:${point.color}">\u25CF</span> ${point.series.name
                    }${meta.unitType
                        ? ` [${meta.units[meta.unitType].plural}]`
                        : ""
                    }: <b>${point.point.options.name || point.y.toFixed(dec)}</b><br/>`;

                });
                return tooltip;

            } catch (error) {

                console.log(error);
                return undefined;

            }

        },
        "winterValue" () {

            try {

                let tooltip = `<span style="font-size: 10px">${this.x - 1}/${this.x}</span><br/>`;
                this.points.forEach((point) => {

                    const dec = point.series.options.tooltip.valueDecimals;
                    tooltip += `<span style="color:${point.color}">\u25CF</span> ${point.series.name
                    }${meta.unitType
                        ? ` [${meta.units[meta.unitType].plural}]`
                        : ""
                    }: <b>${point.y.toFixed(dec)}</b><br/>`;

                });
                return tooltip;

            } catch (error) {

                console.log(error);
                return undefined;

            }

        },
        "winterValueDate" () {
		
            try {

                let tooltip = `<span style="font-size: 10px">Winter ${this.x}-${this.x + 1}</span><br/>`;
                this.points.forEach((point) => {

                    const dec = point.series.options.tooltip.valueDecimals;

                    tooltip += `<span style="font-size: 10px">${point.point.date}</span><br/>`;
                    tooltip += `<span style="color:${
                        point.color
                    }">\u25CF</span> ${
                        point.series.name
                    }: <b>${
                        point.y.toFixed(dec)
                    }</b><br/>`;

                });
                return tooltip;

            } catch (error) {

                console.log(error);
                return undefined;

            }

        },
        "winterValueDateExtreme" () {

            try {

                let tooltip = `<span style="font-size: 10px">Winter ${this.x}-${this.x + 1}</span><br/>`;
                this.points.forEach((point) => {

                    tooltip += `<span style="color:${
                        point.color
                    }">\u25CF</span> ${
                        point.series.name
                    }: <b>${
                        dateFormats.YYYYMMDD(point.point.fullDate)
                    }</b><br/>`;

                });
                return tooltip;

            } catch (error) {

                console.log(error);
                return undefined;

            }

        },
        "valueDate" () {
            try {

                let tooltip = `<span style="font-size: 10px">${this.x}</span><br/>`;
                this.points.forEach((point) => {
                    const dec = point.series.options.tooltip.valueDecimals;
                    tooltip += `<span style="color:${
                        point.color
                    }">\u25CF</span> ${
                        point.series.name
                    }: <b>${
                        point.y.toFixed(dec)
                    }</b><br/>`;
			(Array.isArray(point.point.subX) ? point.point.subX.forEach((date) => {

                        tooltip += `${dateFormats.MMDD(date)}</b><br/>`;

                    }) : null)
                    tooltip += "<br/>";

                });
                return tooltip;

            } catch (error) {

                console.log(error);
                return undefined;

            }

        },
        "value" () {

            try {

                let tooltip = `<span style="font-size: 10px">${this.x}</span><br/>`;
                this.points.forEach((point) => {

                    const dec = point.series.options.tooltip.valueDecimals;
                    tooltip += `<span style="color:${
                        point.color
                    }">\u25CF</span> ${
                        point.series.name
                    }${meta.unitType
                        ? ` [${meta.units[meta.unitType].plural}]`
                        : ""
                    }: <b>${
                        point.y.toFixed(dec)
                    }</b><br/>`;
                    tooltip += "<br/>";

                });
                return tooltip;

            } catch (error) {

                console.log(error);
                return undefined;

            }

        },
        "default" () {

            try {

                let tooltip = `<span style="font-size: 10px">${this.x}</span><br/>`;
                this.points.forEach((point) => {

                    const dec = point.series.options.tooltip.valueDecimals;
                    tooltip += `<span style="color:${
                        point.color
                    }">\u25CF</span> ${
                        point.series.name
                    }${meta.unitType
                        ? ` [${meta.units[meta.unitType].plural}]`
                        : ""
                    }: <b>${
                        point.y.toFixed(dec)
                    }</b><br/>`;
                    tooltip += "<br/>";

                });
                return tooltip;

            } catch (error) {

                console.log(error);
                return undefined;

            }

        }
    };

};
