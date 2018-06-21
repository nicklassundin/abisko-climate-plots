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

var validNumber = function (string) {
    var number = +string;
    return (number) ? number : undefined;
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
