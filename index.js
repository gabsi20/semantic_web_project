'use strict'

let $ = require('jquery');

//console.log($.post());

let url = 'http://dbpedia.org/sparql';
let query = ['select ?cityname ?population{',
'?countries a yago:EuropeanCountries.',
'?cities a yago:City108524735;',
'dbo:populationTotal ?population;',
'dbo:country ?countries;',
'rdfs:label ?cityname.',
'filter(?population > 150000)}'].join(' ');

let queryUrl = encodeURI(url + '?query=' + query + '&format=json');

console.log(queryUrl);

var request = require('request');
request(queryUrl, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body) // Print the body of response.
  }
})
/*
$.ajax({
    dataType: 'jsonp',
    url: queryUrl,
    success: (data) => {
    	console.log(data);
    }/*function(_data) {
        let results = _data.results.bindings;
        for (let i in results) {
            let res = results[i].abstract.value;
            alert(res);
        }
    }
});
http://dbpedia.org/sparql?query=select%20?cityname%20?population%7B%20?countries%20a%20yago:EuropeanCountries.%20?cities%20a%20yago:City108524735;%20dbo:populationTotal%20?population;%20dbo:country%20?countries;%20rdfs:label%20?cityname.%20filter(?population%20%3E%20150000%20&&%20lang(?cityname)%20=%20'de')%20%7D&format=json



select ?cityname ?population{
	?countries a yago:EuropeanCountries.

	?cities a yago:City108524735;
	dbo:populationTotal ?population;
	dbo:country ?countries;
	rdfs:label ?cityname.

	filter(?population > 150000 && lang(?cityname) = 'de')
}*/