/* global Module */

/* Magic Mirror
 * Module: MMM-DayForecast
 *
 * MIT Licensed.
 */

Module.register('MMM-DayForecast', {	

    requiresVersion: "2.3.0",
	defaults: {
        APIID: "YOUROPENWEATHERMAPSID",
        apiVersion: "2.5",
        apiBase: "https://api.openweathermap.org/data/",
        weatherEndpoint: "forecast",
        locationID: "2643741", //london
        units: "metric",
        lang: "de", 
        steps: 5,
        rainOffset: 0,
        globalFontSize: 14,

        //from basic MM currentweather
		iconTable: {
			"01d": "wi-day-sunny",
			"02d": "wi-day-cloudy",
			"03d": "wi-cloudy",
			"04d": "wi-cloudy-windy",
			"09d": "wi-showers",
			"10d": "wi-rain",
			"11d": "wi-thunderstorm",
			"13d": "wi-snow",
			"50d": "wi-fog",
			"01n": "wi-night-clear",
			"02n": "wi-night-cloudy",
			"03n": "wi-night-cloudy",
			"04n": "wi-night-cloudy",
			"09n": "wi-night-showers",
			"10n": "wi-night-rain",
			"11n": "wi-night-thunderstorm",
			"13n": "wi-night-snow",
			"50n": "wi-night-alt-cloudy-windy"
		},
    },

    firstTimeCalled: false,
    
    // Define required scripts.
    getScripts: function() {
        return ['modules/MMM-DayForecast/js/chart.bundle.js',
                'modules/MMM-DayForecast/js/chart.plugin.datalabels.min.js'];
    },
    
    // Define required scripts.
    getStyles: function() {
        return ["weather-icons.css", this.file('forecast.css')];
    },

	/* updateWeather()
	 * Requests new data from openweather.org.
	 * calls renderDiagram on succesfull response.
	 */
    getWeatherForecast: function() {

        var self = this;

        self.firstTimeCalled = true;

        var url = self.config.apiBase + self.config.apiVersion + "/" + self.config.weatherEndpoint + self.getParams();
        var weatherRequest = new XMLHttpRequest();
    
        weatherRequest.open("GET", url, true);
        weatherRequest.onreadystatechange = function() {
    
            if (this.readyState === 4) {
                if (this.status === 200) {
    
                    var data = JSON.parse(this.response);
                    var forcast = data.list || [ ];
                    var chartData = { 
                        rain: [ ],
                        temp: [ ],
                        time: [ ],
                        icon: [],
                        maxRain: 0
                    };
    
                    for(var i = 0, j = forcast.length; i < j; ++i) {
    
                        if(i === self.config.steps) {
                            break;
                        }
                        
                        /* time */
                        var time = new Date(forcast[i].dt * 1000);
                        var hour = time.getHours();
                        var mins = time.getMinutes(); 
                        hour = (hour < 10) ? "0" + hour : hour;
                        mins = (mins < 10) ? "0" + mins : mins;
    
                        /* rain */
                        var rain = 0;
                        if(forcast[i].rain && forcast[i].rain["3h"]) {
                            rain = forcast[i].rain["3h"];
                        }
    
                        if(rain > chartData.maxRain) {
                            chartData.maxRain = rain;
                        }
    
                        chartData.rain.push(rain);
                        chartData.temp.push(forcast[i].main.temp);
                        chartData.time.push(hour + ":" + mins);
                        chartData.icon.push(forcast[i].weather[0].icon);
                    }
    
                    chartData.maxRain += self.config.rainOffset;

                    self.renderDiagram(chartData);

                } else if (this.status === 401) {
                    console.log("error 401");
                } else {
                    console.log("error unknown");
                }
            }
        };
    
        weatherRequest.send();
    },

	/* getParams()
	 * Generates an url with api parameters based on the config.
	 *
	 * return String - URL params.
	 */
    getParams: function() {

        var params = "?";
    
        params += "id=" + this.config.locationID;
        params += "&units=" + this.config.units;
        params += "&lang=" + this.config.lang;
        params += "&APPID=" + this.config.APIID;
        
        return params;
    },	

    renderDiagram: function(data) {

        var ctx = document.getElementById("weatherChart");
        ctx.getContext('2d').clearRect(0, 0, ctx.width, ctx.height);

	    Chart.defaults.global.defaultFontSize = this.config.globalFontSize;

        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                datasets: [{
                    label: 'Temperatur',
                    barPercentage: 0.3,
                    data: data.temp,
                    type: 'line',
                    borderColor: '#FFF',
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    datalabels: {
                        anchor: 'end',
                        offset: 4,
                        align: 'end',
                        color: 'rgba(255, 255, 255, 1)',
                        formatter: function(value, context) {
                            return value.toFixed(1).replace(".", ",") + '°C';
                        }
                    }
                  }, {
                    label: 'Regen',
                    data: data.rain,
                    backgroundColor: '#555',
                    borderWidth: 0,
                    datalabels: {
                        anchor: 'start',
                        offset: 2,
                        align: 'end',
                        color: '#FFF',
                        formatter: function(value, context) {
                            console.log();
                            if(value.toFixed(2) == 0.00) {
                                return " ";
                            }
                            return value.toFixed(2).replace(".", ",") + 'mm';
                        }
                    },
                    yAxisID: 'scaledAxis'
                  }],
              labels: data.time
            },
            options: {
                animation: {
                    duration: 0
                },
                legend: {
                    display: false,
                },
                layout: {
                    padding: {
                        left: 0,
                        right: 0,
                        top: 20,
                        bottom: 0
                    }
                },
                scales: {
                    xAxes: [{
                        barPercentage : 1,
                        gridLines: {
                            display: false
                        },
                        ticks: {
                            fontColor: '#FFF'
                        }
                    }],
                    yAxes: [{
                        beginAtZero: true,
                        display: false,
                        gridLines: {
                            display: false
                        },
                        ticks: {
                            fontColor: '#FFF',
                            beginAtZero: true
                        } 
                    }, {
                        id: 'scaledAxis',
                        display: false,
                        ticks: {
                            beginAtZero: true,
                            min: 0,
                            max: data.maxRain
                        },
                        barPercentage: 0.1
                    }]
                },
                plugins: {
                    datalabels: {
                    }
                },
                tooltips: {
                    enabled: false
                }
            }
        });
    
        this.renderIcons(data.icon)
    },
    
    renderIcons:  function(icons) {
        var container = document.getElementById("weatherForcastIcons");
        container.innerHTML = "";
    
        for(var i = 0, j = icons.length; i < j; ++i) {
            var icon = document.createElement("span");
            icon.className = "weather-forcast-icon wi weathericon " + this.config.iconTable[icons[i]];
            icon.innerHTML = " ";
    
            container.appendChild(icon);
        }
    },

    // Override dom generator.
    getDom: function() {

	    var self = this;

        var wrapper = document.createElement("div");

        if (this.config.APIID === "") {
			wrapper.innerHTML = "Please set the correct openweather <i>appid</i> in the config for module: " + this.name + ".";
			wrapper.className = "dimmed light small";
			return wrapper;
        }

        var diagramWrapper = document.createElement("div");
        diagramWrapper.className = "weather-forcast";
        var diagram = document.createElement("canvas");
        diagram.setAttribute("id", "weatherChart");
        var icons = document.createElement("div");
        icons.setAttribute("id", "weatherForcastIcons");

        diagramWrapper.appendChild(diagram);
        diagramWrapper.appendChild(icons);
        wrapper.appendChild(diagramWrapper);

	    setTimeout(function() { self.getWeatherForecast(); }, 2000);

        return wrapper;
    }
});
