//Store list of songs
var mc = require('mongodb').MongoClient;

var keywords = [];
var searchResults = [];
var searchError = "";
var currentSong;

//main search page
function index(req, res) {
	searchResults = []; //clear search results
	if(searchError === "nothing-found") {
		searchError = "";
		res.render('index.jade', { title: 'COMP 2406 - The Song Remains The Same', error: 'No songs found for keywords' });
	} else if(searchError === "missing-song"){
		searchError = "";
		res.render('index.jade', { title: 'COMP 2406 - The Song Remains The Same', error: 'The song you selected has gone missing' });
	} else if(searchError === "empty-db"){
	  	searchError = "";
		res.render('index.jade', { title: 'COMP 2406 - The Song Remains The Same', error: 'The databse is empty.' });
	} else if(searchError === "multiple-found"){
	  	searchError = "";
		res.render('index.jade', { title: 'COMP 2406 - The Song Remains The Same', error: 'Cannot load song, multiple found in db' });
	}
	else {
		res.render('index', { title: 'COMP 2406 - The Song Remains The Same', error: null });
	}
}

//search post
function search(req, res) {
    var song = req.body.song;
    
    if(song.length === 0) {
    	getFirstDozenSongs(res);
    } else {
    	keywords = song.split(' ');
    	console.log("Keywords: " + keywords);
		searchForSongs(keywords, res);
    }
}

//song list post
function songs(req, res) {
	console.log("searchResults: " + searchResults.length);
	if(searchResults.length > 0) {
		res.render('songs.jade', buildSongList(), req.query.error);
	} else {
		searchError = "nothing-found";
		res.redirect('/');
	}
}

// chords and song detail post
function detail(req, res) {
	console.log("The button title is: " + req.body.title);
	getSongByTitle(req.body.title, res, req);
}

// builds the object for rendering the song list jade view 
function buildSongList() {
	
	//Need to fill array so that title can be accessed
	//if less than 12 songs returned
	var i = searchResults.length;
	while(searchResults.length < 12)
	{
		searchResults[i] = {title:""};
		i++
	}
	
	//Need to set keywords if none were entered
	//so join can be called
	if(keywords.length === 0)
	{
		keywords[0] = "All"
	}
	
	var object = {keywords: keywords.join(), result1: searchResults[0].title, result2: searchResults[1].title, result3: searchResults[2].title, result4: searchResults[3].title,
		result5: searchResults[4].title, result6: searchResults[5].title, result7: searchResults[6].title, result8: searchResults[7].title, result9: searchResults[8].title,
		result10: searchResults[9].title, result11: searchResults[10].title, result12: searchResults[11].title
	};
	
	//Empty the keywords for next search
	keywords = [];
	
	return object;
}

// builds the object for rendering the detail table jade view 
function buildDetailPage() {
	
	var lines = [], size = 4;
	var bars = currentSong.bars;

	while (bars.length > 0)
    	lines.push(bars.splice(0, size));
	
	console.log(lines[1]);

	var object = {title: currentSong.title, style:currentSong.style, composer:currentSong.composer, key:currentSong.key, bars: lines[1] };

	return object;
}

// Searches the song list for a given song title
function getSongByTitle(title, res, req) {
    mc.connect('mongodb://localhost/iRealSongs', function(err, db) {
        if (err) {
            throw err;
        }
	
        var songsCollection = db.collection('songs');
		
		var query = {title: new RegExp(title, "i")};
		songsCollection.find(query).toArray(function(err, queryResults){
			if(err) {
		    	throw err;
		    }
			
			console.log("Query results are: ");
			console.log(queryResults); // output all records
			
			if(queryResults.length > 1){
				searchError = "multiple-found";
				res.redirect('/');
			}
			else if(queryResults.length === 0){
				searchError = "nothing-found";
				res.redirect('/');
			}
			else
			{
				currentSong = queryResults[0];
				res.render('detail.jade', buildDetailPage(), req.query.error);
			}
			
			db.close();
		});
    });
}

// Gets the first dozen song titles and returns them
function getFirstDozenSongs(res) {
    mc.connect('mongodb://localhost/iRealSongs', function(err, db) {
        if (err) {
            throw err;
        }
	
        var songsCollection = db.collection('songs');
	
		songsCollection.find().limit(12).toArray(function(err, queryResults){
			if(err) {
		    	throw err;
		    }
			
			console.log("Query results are: ");
			console.log(queryResults); // output all records
			
			if(queryResults.length === 0){	
				searchError = "empty-db";
				res.redirect('/');	
			} 
			else {
				searchResults = queryResults;
				res.redirect('/songs');
			}
			
			db.close();
		});
    });
}

// Takes an array of keyword strings and searches the songDB array to see
// if any of the keywords are in the title it adds it to the result list
// if the result list is larger than 12 it returns the list with 12 elements
function searchForSongs(keywords, res) {
	var results = [];

    mc.connect('mongodb://localhost/iRealSongs', function(err, db) {
        if (err) {
            throw err;
        }

        var songsCollection = db.collection('songs');
	
		songsCollection.find(buildSearchQuery(keywords)).limit(12).toArray(function(err, queryResults){
			if(err) {
		    	throw err;
		    }
			
			console.log("Query results are: ");
			console.log(queryResults); // output all records
			
			searchResults = queryResults;

			res.redirect('/songs');
			db.close();
		});
    });
}

function buildSearchQuery(keywords) {
	var start = "^";
	var before = "(?=.*\\b";
	var after = "\\b)";
	var end = ".+";
	var result = "";
	
	for(var i=0; i<keywords.length; i++)
	{
		if(keywords.length === 1) {
			result += start + before + keywords[i] + after + end;
		} else if(i === 0) {
			result += start + before + keywords[i] + after;
		} else if(i === keywords.length - 1) {
			result += before + keywords[i] + after + end;
		} else {
			result += before + keywords[i] + after;
		}
	}
	
	var query = {title: new RegExp(result, "i")};
	return query;
}

exports.index = index;
exports.search = search;
exports.songs = songs;
exports.detail = detail;
