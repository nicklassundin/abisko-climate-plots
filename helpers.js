var months = function () {
    return ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
};

var sum = function (values) {
    return values.reduce(function (sum, value) {
        return sum + value;
    }, 0);
}

var average = function (values) {
    if (values.length === 0) return 0;
    return sum(values) / values.length;
};

var movingAverage = function (values, index, number) {
    var startIndex = Math.max(index - number, 0);
    return average(values.slice(startIndex, index));
};

var movingAverages = function (values, number) {
    return values.map(function (_, index) {
        return movingAverage(values, index, number);
    });
};

var difference = function (values, baseline) {
    return values.map(function (value) {
        return value - baseline;
    });
};

var sumSquareDistance = function (values, mean) {
    return values.reduce(function (sum, value) {
        return sum + Math.pow(value - mean, 2);
    }, 0);
};

var variance = function (values) {
    var mean = average(values);
    return sumSquareDistance(values, mean) / (values.length - 1)
};

var confidenceInterval = function (mean, variance, count) {
    var zs = [0, 12.706, 4.303, 3.182, 2.776, 2.571, 2.447, 2.365, 2.306, 2.262, 2.228, 2.201, 2.179];
    var ci = zs[count - 1] * Math.sqrt(variance / count);
    return {
        low: mean - ci,
        high: mean + ci
    };
};

var isBaselinePeriod = function (year) {
    return year >= 1961 && year <= 1990;
};

var validNumber = function (string) {
    var number = +string;
    return (number) ? number : undefined;
};

var parseDate = function (string) {
    var date = string.split('-');
    return {
        year: +date[0],
        month: +date[1],
        day: +date[2],
    };
};

var parseNumber = function (string) {
    return parseFloat(string.replace(',', '.')) || undefined;
};

var combine = function (xs, ys) {
    return xs.map(function (x, index) {
        return {
            x: x,
            y: ys[index],
        };
    });
};

var linearRegression = function (xs, ys) {
    var data = xs.map(function (x, index) {
        return [x, ys[index]];
    });

    var result = regression.linear(data);
    var gradient = result.equation[0];
    var intercept = result.equation[1];

    var linear = function (x) {
        return gradient * x + intercept;
    };

    linear.toString = function() {
        return gradient + ' x ' + (intercept >= 0 ? '+' : '-') + Math.abs(intercept);
    };

    return linear;
};
