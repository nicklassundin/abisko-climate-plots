

$('#baseline').submit((e) => {
	e.preventDefault();
	var lower = +e.target[0].value;
	var upper = +e.target[1].value;
	if (!lower || !upper) {
		alert('Something went wrong!');
		return;
	} else if (lower < 1913) {
		alert("Lower limit must be above 1913!");
		return;
	} else if (lower >= upper) {
		alert("Lower limit cant be larger or equal to upper limit!");
		return;
	} else if (upper > 2017) {
		alert("Upper limit must be below 2017!");
		return;
	}

	baselineLower = lower;
	baselineUpper = upper;
	parseZonal();
	parseAbisko();
});

Highcharts.setOptions({
	credits: false,
});

var precipColor = '#550965';

var snowColor = {
	color: '#CDD8F0',
	borderColor: '#5F7CB9',
	hover: '#eeeeff',
};

var rainColor = {
	color: '#1000FB',
	borderColor: '#5F7CB9',
	hover: '#3333ff',
};

var useWebWorker = true;

