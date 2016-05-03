$(document).ready(function(){
	
	function findAlbums(data){
		var query = [
			'SELECT ?bandname ?album{',
			'?subject rdf:type <http://dbpedia.org/ontology/Album>.',
			'?subject rdfs:label ?album.',
			'?subject dbo:artist ?band.',
			'?band rdfs:label ?bandname',
			'FILTER(regex(?bandname,"^'+data+'","i") AND lang(?bandname)="en" AND lang(?album)="en")',
			'}'
		].join(' ');

		var url = 'http://dbpedia.org/sparql';
		var queryUrl = encodeURI(url + '?query=' + query + '&format=json');
		console.log("Query: ", query);
		$('#albumList').text("Query is loading");
		$.getJSON(queryUrl,{},function(data){
			console.log("Results: ", data);
		    var results = data.results.bindings;
			$('#albumList').text("");
			if(results.length == 0) {
				column.text("No Entry found");
			}
	        for (var i in results) {
	        	$('#albumList').append("<li>"+results[i].album.value+"</li>");
	        }
		});
		
	}

	function findMembers(data){
		var query = [
			'SELECT ?artist ?membername{',
			'?subject rdf:type <http://dbpedia.org/ontology/Band>.',
			'?subject rdfs:label ?artist.',
			'?subject dbo:bandMember ?member.',
			'?member rdfs:label ?membername.',
			'FILTER(regex(?artist,"^'+data+'","i") AND lang(?artist)="en" AND lang(?membername) = "en")',
			'}',
			'GROUP BY ?artist'
			].join(' ');

			var url = 'http://dbpedia.org/sparql';
			var queryUrl = encodeURI(url + '?query=' + query + '&format=json');
			console.log("Query: ", query);
			$('#memberList').text("Query is loading");
			$.getJSON(queryUrl,{},function(data){
				console.log("Results: ", data);
			    var results = data.results.bindings;
				$('#memberList').text("");
				if(results.length == 0) {
					column.text("No Entry found");
				}
		        for (var i in results) {
		        	console.log(results);
		        	$('#memberList').append("<li>"+results[i].membername.value+"</li>");
		        }
			});
		
	}
	


// FIND TRACK HAUT NOCH NICHT HIN

	/*function findTracks(data){
		var url = 'http://dbpedia.org/sparql';
		var query = [
			'SELECT ?song ?albumname{',
			'?subject rdf:type <http://dbpedia.org/ontology/MusicalWork>.',
			'?subject rdfs:label ?song.',
			'?subject dbp:fromAlbum ?album.',
			'?album rdfs:label ?albumname.',
			'FILTER(regex(?albumname, "^'+data+'", "i") AND lang(?albumname) = "en" AND lang(?song) = "en")',
			'}'
		].join(' ');
		var queryUrl = encodeURI(url + '?query=' + query + '&format=json');
		$.getJSON(queryUrl,{},function(data){
			console.log(data);
		    var results = data.results.bindings;
	        for (var i in results) {
	        	$('#trackList').append("<li>"+results[i].album.value+"</li>");
	        }
		});
	}*/

	$('#artist').change(function(){
		findAlbums($('#artist').val());
		findMembers($('#artist').val());
	});
});




