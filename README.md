# MMM-DayForecast
This module for the MagicMirror show a tempature curve and the rain for the next X timestamps. Works with chart js and openweathermaps<br><br>
This ist the first alpha version of this modul. Need to rework the code.

## Installation
1. Navigate into your MagicMirror's `modules` folder and execute `git clone https://github.com/freequenzart/MMM-DayForecast.git`.

To use this module, add it to the modules array in the `config/config.js` file:
````javascript
modules: [
	{
		module: 'MMM-DayForecast',
		config: {
            APIID: 'bcdefgh123456789',// API Key from open weather maps
            locationID: '2643741',//http://openweathermap.org/help/city_list.txt
            steps: 5, // how many steps of 3h you will see?
            lang: "de"//de en, nl, ru, etc ...
            rainShowValue: true, //to show mm on bars
            header: "", //to hide header for example
		}
	}
]
````

For more plase have a look into the MMM-DayForecast.js file.

## Developer Notes
Thank you [MichMich](https://github.com/MichMich/) for the [MagicMirror](https://github.com/MichMich/MagicMirror) and the basic code from currentweather Module!

## Dependencies
- none

The MIT License (MIT)
=====================

Copyright © 2018 freequenzart

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the “Software”), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

**The software is provided “as is”, without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose and noninfringement. In no event shall the authors or copyright holders be liable for any claim, damages or other liability, whether in an action of contract, tort or otherwise, arising from, out of or in connection with the software or the use or other dealings in the software.**
