var months = () => ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

var monthByIndex = index => months()[index];

var monthName = month => ({
    jan: 'January', feb: 'February', mar: 'March', apr: 'April', may: 'May', jun: 'June',
    jul: 'July', aug: 'August', sep: 'September', oct: 'October', nov: 'November', dec: 'December'
})[month];

var summerMonths = ['may', 'jun', 'jul', 'aug', 'sep'];
var winterMonths = ['oct', 'nov', 'dec', 'jan', 'feb', 'mar', 'apr'];

var isSummerMonth = month => summerMonths.includes(month);
var isWinterMonth = month => winterMonths.includes(month);

var isSummerMonthByIndex = month => isSummerMonth(monthByIndex(month));
var isWinterMonthByIndex = month => isWinterMonth(monthByIndex(month));

var sum = values => values.reduce((sum, current) => sum + current, 0);

var min = values => values.reduce((min, current) => Math.min(min, current), Infinity);

var max = values => values.reduce((max, current) => Math.max(max, current), -Infinity);

var average = (values) => {
    if (values.length === 0) return 0;
    return sum(values) / values.length;
};

var mean = average;

var movingAverage = (values, index, number) => average(values.slice(Math.max(index - number, 0), index));

var movingAverages = (values, number) => values.map((_, index) => movingAverage(values, index, number));

var difference = (values, baseline) => values.map(value => value - baseline);

var sumSquareDistance = (values, mean) => values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0);

var variance = values => sumSquareDistance(values, average(values)) / (values.length - 1);

var confidenceInterval = (mean, variance, count) => {
    var zs = [0, 12.706, 4.303, 3.182, 2.776, 2.571, 2.447, 2.365, 2.306, 2.262, 2.228, 2.201, 2.179];
    var ci = zs[count - 1] * Math.sqrt(variance / count);
    return {
        low: mean - ci,
        high: mean + ci
    };
};

var baselineLower = 1961;
var baselineUpper = 1990;

var withinBaselinePeriod = year => year >= baselineLower && year <= baselineUpper;

var validNumber = (string) => {
    var number = +string;
    return (number) ? number : undefined;
};

var parseDate = (string) => {
    var date = string.split('-');
    return {
        year: +date[0],
        month: +date[1],
        day: +date[2],
    };
};

var weekNumber = (date) => {
    var d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
};

var weekNumberFromObj = date => weekNumber(new Date(date.year, date.month-1, date.day));

var parseNumber = string => parseFloat(string.replace(',', '.')) || undefined;

var linearRegression = (xs, ys) => {
    var data = xs.map((x, index) => [x, ys[index]]);
    var result = regression.linear(data);
    var gradient = result.equation[0];
    var intercept = result.equation[1];
    var linear = x => gradient * x + intercept;
    linear.toString = () => gradient + ' x ' + (intercept >= 0 ? '+' : '-') + Math.abs(intercept);
    return linear;
};

Array.prototype.rotate = (function () {
    var unshift = Array.prototype.unshift,
        splice = Array.prototype.splice;

    return function (count) {
        var len = this.length >>> 0,
            count = count >> 0;

        unshift.apply(this, splice.call(this, count % len, len));
        return this;
    };
})();
