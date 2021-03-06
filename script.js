//API Call for Cover information
//https://en.wikipedia.org/w/api.php?format=json&action=query&prop=imageinfo&iiprop=url|size&titles=File:[filename]
$(document).ready(function(){
	function findAlbums(data){
		var query = [
			'SELECT DISTINCT ?bandname ?album ?subject{',
			'?subject a dbo:Album;',
			'foaf:name ?album;',
			'dbo:artist ?band.',
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
	        	var album = results[i].album.value;
	        	findTitlesOfAlbum(album,results[i].subject.value);
				$('#albumList').append(function() {
					var album = results[i].album.value;
					var hehe = results[i].subject.value
					return $('<a><li data="'+hehe+'">'+album+'</li></a>').click(function() {
						displayInfo(album,hehe);
					});
				})
	        }
		});
		
	}

	function displayInfo(album, data) {
		$("#infobox").modal("show");
		$("#infobox .modal-list").text("");
		getAlbumInfo(album, data);
				
			findTitlesOfAlbum(album, data);
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
	function getAlbumInfo(data, album) {
		var query = [
			'SELECT DISTINCT ?cover, ?label, ?released, ?runtime, ?comment {',
  			'<'+album+'> rdfs:comment ?comment;',
  			'dbo:runtime ?runtime;',
  			'dbp:cover ?cover;',
  			'dbp:label ?label;',
  			'dbp:released ?released',
  			'FILTER(lang(?comment)="en")',
			'}'].join(' ');
			
			$("#infobox .modal-title").text(data)

			var url = 'http://dbpedia.org/sparql';
			var queryUrl = encodeURI(url + '?query=' + query + '&format=json');
			console.log("Query: ", query);
			$("#infobox .modal-abstract").text("")
			$("#infobox .modal-image").attr("style","display:none;");

			$.getJSON(queryUrl,{},function(data){
				//console.log("Results: ", data);
			    var results = data.results.bindings;
			    console.log(results[0])
				if(results[0].comment) {
					$("#infobox .modal-abstract").text(results[0].comment.value)
				}
				if(results[0].cover) {
					getCover(results[0].cover.value);
				} else {
					console.log("Kein COVER vorhanden");
				}

			});	
	}
	
	function getCover(url) {
		$.ajax({
			url: "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=imageinfo&iiprop=url|size&titles=File:"+url,
			type: 'GET',
			crossDomain: true,
			dataType: 'jsonp',
			success: function(data) {
				$.each(data, walker);
			},
		});
	}

	function walker(key, value, callback) {
		if(key === "url") {
			console.log(value)
			$("#infobox .modal-image").attr("style","display:inline-block;");
			$("#infobox .modal-image").attr("src",value);
		}

		if (value !== null && typeof value === "object") {
			$.each(value, walker, callback);
		}
	}
	
	function findTitlesOfAlbum(data,album) {
		var query = [
			'SELECT ?title',
			'WHERE {',
			'<'+album+'> dbp:title ?title.',
			'FILTER(lang(?title) = "en")',
			'}'].join(' ');
			
			var url = 'http://dbpedia.org/sparql';
			var queryUrl = encodeURI(url + '?query=' + query + '&format=json');
			console.log("Query: ", query);
			$.getJSON(queryUrl,{},function(data){
				console.log("Results: ", data);
			    var results = data.results.bindings;


				if(results.length == 0) {
					console.log("No Entry found")
					return;
				}

				$.each(results, function(index, value){
					$('#trackList').append("<li>"+value.title.value+"</li>");
					$("#infobox .modal-list").append(`<li>	${value.title.value}</li>`)
				})
			});	
			
	}

	function findSongs(data){
		var query = [
			'Select ?song ?bandname{',
			'?subject a dbo:Song;',
			'rdfs:label ?song;',
			'dbo:artist ?band.',
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
});




