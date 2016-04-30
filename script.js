$(document).ready(function(){
	function findArtist(data){
		var url = 'http://dbpedia.org/sparql';
		var query = ['SELECT ?result  ?artist ?albumname ?title{',
		'?subject rdf:type <http://dbpedia.org/ontology/MusicalWork>.',
		'?subject rdfs:label ?result.',
		'?subject dbp:artist ?artist.',
		'?subject dbo:album ?album.',
		'?album dbp:thisAlbum ?albumname.',
		'?album dbp:title ?title',
		'FILTER(regex(?result, "^'+data+'", "i"))',
		'}'].join(' ');
		var queryUrl = encodeURI(url + '?query=' + query + '&format=json');
		console.log("SENFSEMME");
		$.ajax({
		    dataType: 'jsonp',
		    url: queryUrl,
		    success: function(_data) {
		    	console.log(_data);
		        /*var results = _data.results.bindings;
		        for (var i in results) {
		        	console.log(results[i].artistName);
		        	$('h1').html(results[1].artistName.value);
		        	console.log(results[1].artistName.value);
		        }*/
		    }
		});
	}
	$('#artist').change(function(){
		findArtist($('#artist').val());
		console.log($('#artist').val())
	});
});

	/* GET BAND QUERY */
	/*
	    SELECT ?result  ?artist ?albumname ?title{

		?subject rdf:type <http://dbpedia.org/ontology/MusicalWork>.
		?subject rdfs:label ?result.
		?subject dbp:artist ?artist.
		?subject dbo:album ?album.
		?subject rdfs:label ?albumname.
		?album dbp:title ?title

				
		FILTER(regex(?result, "^Thunderstruck", "i"))
		} 

		'SELECT ?result  ?artist ?albumname ?title{',
		'?subject rdf:type <http://dbpedia.org/ontology/MusicalWork>.',
		'?subject rdfs:label ?result.',
		'?subject dbp:artist ?artist.',
		'?subject dbo:album ?album.',
		'?album dbp:thisAlbum ?albumname.',
		'?album dbp:title ?title',
		'FILTER(regex(?result, "^'+data+'Thunderstruck''", "i"))',
		'}'
	*/