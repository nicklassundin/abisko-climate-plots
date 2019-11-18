const language = {
	en: {
		baselineform: {
			title: "Range for baseline",
			lower: 'Lower limit',
			upper: 'Upper limit',
		},
		dataCredit: 'Data source',
		contribute: 'Contribute - Github [dummy]',
		showDataTable: 'Show/hide data',
		langOption: 'Svenska',
		shortMonths: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
		downloadJPEG: 'Download as JPEG',
		downloadPDF: 'Download as PDF',
		downloadSVG: 'Download as SVG',
		diff: 'Difference',
		groundlevel: "Ground level",
		months: (month) => ({
			jan: 'January',
			feb: 'February',
			mar: 'March',
			apr: 'April',
			may: 'May',
			jun: 'June',
			jul: 'July',
			aug: 'August',
			sep: 'September',
			oct: 'October',
			nov: 'November',
			dec: 'December'
		})[month],
		yearlyAvg: 'Yearly average',
		monthlyAvg: 'Monthly average',
		ci: 'Confidence interval',
		min: 'Min',
		max: 'Max',
		weeks: 'weeks',
		years: 'years',
		temp: 'Temperature [°C]',
		yearlyCI: 'Confidence interval (yearly avg.)',
		movAvg: 'Moving average',
		movAvgCI: 'Confidence interval (moving avg.)',
		precMovAvg: 'Moving average precipitation',
		precSnow: 'Precipitation from snow',
		precRain: 'Precipitation from rain',
		precAvg: 'Total average precipitation',
		prec: 'Precipitation [mm]',
		tprec: 'Total Precipitation [mm]',
		freezeup: 'Freeze-up',
		breakup: 'Break-up',
		iceTime: 'Ice time',
		iceTimeMovAvg: 'Ice time (moving avg.)',
		githubwiki: 'https://github.com/nicklassundin/abisko-climate-plots/wiki',
		linReg: 'Linear regression',
		linRegSnow: 'Linear regression (snow)',
		linRegAll: 'Linear regression (all)',
		linRegRain: 'Linear regression (rain)',
		linFrz: 'Linear regression (freeze-up)',
		linBrk: 'Linear regression (break-up)',
		linIceTime: 'Linear regression (ice time)',
		iceSub: 'Ice break-up / freeze-up [day of year]',
		iceTime: 'Ice time [number of days]',
		movAvgIceTime: 'Ice time (moving avg.)',
		iceTime2: 'Ice time',
		snowDepth: 'Snow depth [cm]',
		month: 'Month',
		abiskoSnowDepthPeriod: {
			'From 1961 to 1970': "From 1961 to 1970",
			'From 1971 to 1980': "From 1971 to 1980",
			'From 1981 to 1990': "From 1981 to 1990",
			'From 1991 to 2000': "From 1991 to 2000",
			'From 2001 to 2010': "From 2001 to 2010",
			'From 2011 to present': "From 2011 to present",
			'Entire period': "Entire period",
			'From 1931 to 1960': "From 1931 to 1960",
			'From 1961 to 1990': "From 1961 to 1990",
			'From 1991 to present' : "From 1991 to present",
		},
		titles: {
			northernHemisphere: 'Northern Hemisphere temperatures',
			globalTemperatures: 'Global temperatures',
			temperatureDifference1: 'Temperature difference for Arctic (64N-90N)',
			temperatureDifference2: 'Temperature difference for Northern Hemisphere',
			temperatureDifference3: 'Global teperature difference',
			arcticTemperatures: 'PLACE HOLDER',
			abiskoLakeIce: 'Torneträsk Freeze-up and break-up of lake ice vs ice time',
			abiskoSnowDepthPeriodMeans: 'Monthly mean snow depth for Abisko',
			abiskoSnowDepthPeriodMeans2: 'Monthly mean snow depth for Abisko',
			AbiskoTemperatures: function(){
				return 'Abisko temperatures';
			},
			AbiskoTemperaturesSummer: function(){
				return 'Abisko temperatures for '+summerRange;
			},
			AbiskoTemperaturesWinter: function(){
				return 'Abisko temperatures for '+winterRange;
			},
			temperatureDifferenceAbisko: 'Temperature difference for Abisko',
			monthlyAbiskoTemperatures: function(month){
				return 'Abisko temperatures for '+month
			},
			yearlyPrecipitation: 'Yearly precipitation',
			summerPrecipitation: function(){
				return 'Precipitation for '+summerRange;
			},
			winterPrecipitation: function(){
				return 'Precipitation for '+winterRange;
			},
			yearlyPrecipitationDifference: 'Precipitation difference',
			summerPrecipitationDifference: 'Precipitation difference '+summerRange,
			winterPrecipitationDifference: 'Precipitation difference '+winterRange,
			monthlyPrecipitation: function(monthy){
				return 'Abisko Precipitation for '+monthy
			},
			growingSeason: 'Growing season',
			weeklyCO2: "Averages global CO"+("2".sub())+" in atmosphere",
			permaHistogramCALM: 'Permafrost active layer depth',
			smhiTemp: function(name){
				return "Lund temperatures"
				// return name +" SMHI TEST";
			} 
		},
		subtitles: {
			baseline: function(){
				return 'Difference between yearly average and average for '+baselineLower+"-"+baselineUpper;
			}
		}
	},
	sv:{
		baselineform: {
			title: "Intervalet för baslinjen",
			lower: 'Lägre gränsen',
			upper: 'Övre gränsen',
		},
		dataCredit: 'Data källa',
		contribute: 'Bidra mjukvara - Github [dummy]',
		showDataTable: 'Visa/göm data',
		langOption: 'English',
		shortMonths: ['Jan','Feb','Mar','Apr','Maj','Jun','Jul','Aug','Sep','Okt','Nov','Dec'],
		downloadJPEG: 'Ladda ner som JPEG',
		downloadPDF: 'Ladda ner som PDF',
		downloadSVG: 'Ladda ner som SVG',
		diff: 'Skillnad',
		viewFullscreen: 'Visa i fullskärm',
		resetZoom: 'Återställ zoom',
		printChart: 'Skriv ut',
		months: ['Januari','Februari','Mars','April','Maj','Juni','Juli','Augusti','September','Oktober','November','December'],
		groundlevel: "Mark nivå",
		months: (month) => ({
			jan: 'Januari',
			feb: 'Februari',
			mar: 'Mars',
			apr: 'April',
			may: 'Maj',
			jun: 'Juni',
			jul: 'Juli',
			aug: 'Augusti',
			sep: 'September',
			oct: 'Oktober',
			nov: 'November',
			dec: 'December'
		})[month],
		yearlyAvg: 'Årligt medelvärde',
		monthlyAvg: 'Månligt medelvärde',
		ci: 'Konfidence interval',
		weeks: 'veckor',
		years: 'År',
		temp: 'Temperatur [°C]',
		yearlyCI: 'Konfidence interval (Årligt medelvärde)',
		movAvg: 'Rörligt medelvärde',
		movAvgCI: 'Konfidence interval (rörligt medelvärde)',
		precMovAvg: 'Rörligt medelvärde utfällning',
		prec: 'Utfällning [mm]',
		precSnow: 'Utfällning från snö',
		precRain: 'Utfällning från regn',
		precAvg: 'Total genomsnittlig utfällning',
		tprec: 'Total Utfällning [mm]',
		freezeup: 'Isläggning',
		breakup: 'Islossning',
		iceTime: 'Is tid',
		iceTimeMovAvg: 'Is tid (rörligt medelvärde)',
		githubwiki: 'https://github.com/nicklassundin/abisko-climate-plots/wiki',
		linReg: 'Linjär regression',
		linRegSnow: 'Linjär regression av snö',
		linRegAll: 'Linjär regression alla källor',
		linRegRain: 'Linjär regression av regn',
		linFrz: 'Linjär regression (isläggning)',
		linBrk: 'Linjär regression (islossning)',
		linIceTime: 'Linjär regression (is tid)',
		iceSub: 'Islossning / Isläggning [dag om året]',
		iceTime: 'Is tider [antal dagar per år]',
		movAvgIceTime: 'Is tid (rörligt genomsnitt)',
		iceTime2: 'Is tid',
		snowDepth: 'Snö djup [cm]',
		month: 'Månad',
		abiskoSnowDepthPeriod: {
			'From 1961 to 1970': "Från 1961 till 1970",
			'From 1971 to 1980': "Från 1971 till 1980",
			'From 1981 to 1990': "Från 1981 till 1990",
			'From 1991 to 2000': "Från 1991 till 2000",
			'From 2001 to 2010': "Från 2001 till 2010",
			'From 2011 to present': "Från 2011 till nutid",
			'Entire period': "Hela perioden",
			'From 1931 to 1960' : "Från 1931 till 1960",
			'From 1961 to 1990' : "Från 1961 till 1990",
			'From 1991 to present' : "Från 1991 till nutid",
		},
		titles: {
			northernHemisphere: 'Northern Hemisphere temperatures',
			globalTemperatures: 'Global temperaturer',
			temperatureDifference1: 'Temperatur skillnaden för Arctic (64N-90N)',
			temperatureDifference2: 'Temperatur skillnaden för Nordliga Hemisfären',
			temperatureDifference3: 'Global temperatur skillnaden',
			arcticTemperatures: 'PLACE HOLDER',
			abiskoLakeIce: 'Torneträsk isläggning och islossning',
			abiskoSnowDepthPeriodMeans: 'Månatlig genomsnittligt snö djup för Abisko',
			abiskoSnowDepthPeriodMeans2: 'Månatlig genomsnittligt snö djup för Abisko',
			AbiskoTemperatures: function(){
				return 'Abisko temperaturer';	
			},
			AbiskoTemperaturesSummer: function(){
				return 'Abisko temperaturer för '+summerRange;
			},
			AbiskoTemperaturesWinter: function(){
				return 'Abisko temperaturer för '+winterRange;
			},
			temperatureDifferenceAbisko: 'Temperatur skillnad för Abisko',
			monthlyAbiskoTemperatures: function(month){
				return 'Abisko temperaturer för '+month
			},
			yearlyPrecipitation: function(){
				return 'Årligt utfällning'
			},
			summerPrecipitation: function(){
				return 'Utfällning för '+summerRange;
			},
			winterPrecipitation: function(){
				return 'Utfällning för '+winterRange;
			},
			yearlyPrecipitationDifference: 'Utfällnings skillnaden',
			summerPrecipitationDifference: 'Precipitation skillnaden för '+summerRange,
			winterPrecipitationDifference: 'Precipitation skillnaden för '+winterRange,
			monthlyPrecipitation: function(month){
				return 'Abisko utfällning för '+month
			},
			growingSeason: 'Växande säsonger',
			weeklyCO2: "Globalt genomsnittligt CO"+("2".sub())+" i atmosfären",
			permaHistogramCALM: 'Permafrost aktivt lager djup',

			smhiTemp: function(name){
				return "Lund temperaturer"
				// return name +" [SMHI Example plots]";
			},
		},
		subtitles: {
			baseline: function(){
				return 'Skillnad mellan årligt genomsnitt och genomsnitt för perioden '+baselineLower+"-"+baselineUpper;
			} 
		}
	},
}

var nav_lang = navigator.language.split('-')[0];
