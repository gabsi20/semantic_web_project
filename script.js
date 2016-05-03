//API Call for Cover information
//https://en.wikipedia.org/w/api.php?format=json&action=query&prop=imageinfo&iiprop=url|size&titles=File:[filename]
$(document).ready(function(){
	$("#infobox").modal("show")
	function findAlbums(data){
		var query = [
			'SELECT DISTINCT ?bandname ?album{',
			'?subject rdf:type <http://dbpedia.org/ontology/Album>.',
			'?subject foaf:name ?album.',
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
				$('#albumList').text("No Entry found");
			}
	        for (var i in results) {
				$('#albumList').append(function() {
					var album = results[i].album.value;
					return $('<a><li>'+album+'</li></a>').click(function() {
						console.log(album);
						findTitlesOfAlbum(album);
					});
				})
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
					$('#memberList').text("No Entry found");
				}
		        for (var i in results) {
		        	console.log(results);
		        	$('#memberList').append("<li>"+results[i].membername.value+"</li>");
		        }
			});	
	}
	
	function findTitlesOfAlbum(data) {
		var query = [
			'SELECT ?title',
			'WHERE {',
			'?album rdf:type <http://dbpedia.org/ontology/Album>.',
			'?album rdfs:label ?albumname.',
			'?album <http://dbpedia.org/property/title> ?title.',
			'FILTER(regex(?albumname, "^'+data+'", "i") AND lang(?albumname) = "en" AND lang(?title) = "en")',
			'}'].join(' ');
			
			var url = 'http://dbpedia.org/sparql';
			var queryUrl = encodeURI(url + '?query=' + query + '&format=json');
			console.log("Query: ", query);
			$.getJSON(queryUrl,{},function(data){
				console.log("Results: ", data);
			    var results = data.results.bindings;
				if(results.length == 0) {
					console.log("No Entry found")
				}
		        for (var i in results) {
		        	console.log(results[i].title.value);
		        }
			});	
	}

	function findSongs(data){
		var query = [
			'Select ?song ?bandname{',
			'?subject rdf:type <http://dbpedia.org/ontology/Song>.',
			'?subject rdfs:label ?song.',
			'?subject dbo:artist ?band.',
			'?band rdfs:label ?bandname.',
			'FILTER(regex(?bandname,"^'+data+'","i") AND lang(?song) = "en" AND lang(?bandname) = "en")',
			'}'
		].join(' ');

		var url = 'http://dbpedia.org/sparql';
		var queryUrl = encodeURI(url + '?query=' + query + '&format=json');
		console.log("Query: ", query);
		$('#trackList').text("Query is loading");
		$.getJSON(queryUrl,{},function(data){
			console.log("Results: ", data);
		    var results = data.results.bindings;
			$('#trackList').text("");
			if(results.length == 0) {
				$('#trackList').text("No Entry found");
			}
	        for (var i in results) {
	        	console.log(results);
	        	$('#trackList').append("<li>"+results[i].song.value+"</li>");
	        }
		});	
	}
	


	$('#artist').change(function(){
		findAlbums($('#artist').val());
		findMembers($('#artist').val());
		findSongs($('#artist').val());
	});
	
	findTitlesOfAlbum("...And Justice for All");
});




