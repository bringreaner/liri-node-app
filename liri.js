require("dotenv").config();
var keys = require("./keys.js");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require("request");
var fs = require("fs");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

function myTweets() {
    var params = { screen_name: 'TabibitoG' };
    var recentTweets = [];
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            for (i = 0; i < 20; i++)
                recentTweets.push(tweets[i].created_at + " " + tweets[i].text);
            //console.log();
            //console.log(response);
        }
        console.log(recentTweets);
    });
}

function movieThis() {
    // Store all of the arguments in an array
    var nodeArgs = process.argv;
    // Create an empty variable for holding the movie name
    var movieName = "";
    // Loop through all the words in the node argument
    // And do a little for-loop magic to handle the inclusion of "+"s
    for (var i = 3; i < nodeArgs.length; i++) {

        if (i > 3 && i < nodeArgs.length) {
            movieName = movieName + "+" + nodeArgs[i];
        }

        else {
            movieName += nodeArgs[i];
        }
    }

    // Then run a request to the OMDB API with the movie specified
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&tomatoes=true&apikey=trilogy";

    if (movieName == "") {
        queryUrl = "http://www.omdbapi.com/?t=Mr.+Nobody&y=&plot=short&tomatoes=true&apikey=trilogy";
    }

    // This line is just to help us debug against the actual URL.
    console.log(queryUrl);

    request(queryUrl, function (error, response, body) {
        // If the request is successful
        if (!error && response.statusCode === 200) {
            // * Title of the movie.
            // * Year the movie came out.
            // * IMDB Rating of the movie.
            // * Rotten Tomatoes Rating of the movie.
            // * Country where the movie was produced.
            // * Language of the movie.
            // * Plot of the movie.
            // * Actors in the movie.
            // Parse the body of the site and recover just the imdbRating
            // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
            console.log("Release Year: " + JSON.parse(body).Year);
            console.log("Title: " + JSON.parse(body).Title);
            console.log("Rating: " + JSON.parse(body).Rated);
            console.log("Rotten Tomatoes: " + JSON.parse(body).Ratings[1].Value);
            console.log("Country: " + JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);
            console.log("IMDB Score: " + JSON.parse(body).imdbRating);
        }
        //console.log(JSON.parse(body));
    // If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'
    // If you haven't watched "Mr. Nobody," then you should: http://www.imdb.com/title/tt0485947/
    // It's on Netflix!
    // You'll use the request package to retrieve data from the OMDB API. Like all of the in-class activities, the OMDB API requires an API key. You may use trilogy.


    });
}

function spotifyThisSong() {
    var userInput = process.argv;
    var song = [];

    for (var i = 3; i < userInput.length; i++) {

        if (i > 3 && i < userInput.length) {
            song = song + " " + userInput[i];
        }
        else {
            song += userInput[i];
        }
    }

    if (song == "") {
        song = "The Sign Ace of Base";
        console.log(song)
      }
// //console.log(JSON.parse(data))
// console.log(song)
    spotify.search({ type: 'track', query: song }, function (err, data) {
        // if (song === undefined) {

        if (!err) {
            //var trackID = data.tracks.items;
            //console.log(trackID)
            //console.log(data.tracks.items[0].album)
            console.log("Album name: " + data.tracks.items[0].album.name);
            console.log("Artist name: " + data.tracks.items[0].artists[0].name);
            console.log("Track name: " + data.tracks.items[0].name);
            console.log("Preview song at: " + data.tracks.items[0].external_urls.spotify);

            //console.log(data);

        if (err) {
            return console.log('Error occurred: ' + err);
            }
        }});

    // Artist(s)
    // The song's name
    // A preview link of the song from Spotify
    // The album that the song is from

    // If no song is provided then your program will default to "The Sign" by Ace of Base.
    // You will utilize the node-spotify-api package in order to retrieve song information from the Spotify API.
}
// Make it so liri.js can take in one of the following commands:
// * `my-tweets`
// This will show your last 20 tweets and when they were created at in your terminal/bash window.

if (process.argv[2] == 'my-tweets') {
    myTweets();
}

// * `spotify-this-song`
// This will show the following information about the song in your terminal/bash window
if (process.argv[2] == 'spotify-this-song') {
   spotifyThisSong();

}
// * `movie-this`
// node liri.js movie-this '<movie name here>'
if (process.argv[2] == 'movie-this') {
    movieThis();
}

// * `do-what-it-says`
if (process.argv[2] == 'do-what-it-says') {
        // node liri.js do-what-it-says

        // Using the fs Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
            fs.readFile('random.txt', 'utf8', function (err, data) {
                if (err) {
                    return console.log(err);
                }
                else {

                var dataArr = data.split(",");
                var myVariable = dataArr[1];
                console.log(myVariable)
                    //console.log(dataArr);
                    
                if (dataArr[0] == 'my-tweets') {
                    myTweets(dataArr[1]);
                }
                
                // * `spotify-this-song`
                // This will show the following information about the song in your terminal/bash window
                if (dataArr[0] == 'spotify-this-song') {
                   spotifyThisSong(song = myVariable);
                }

                // * `movie-this`
                // node liri.js movie-this '<movie name here>'
                if (dataArr[0] == 'movie-this') {
                    movieThis(dataArr[1]);
                    }       
            }
        }
            )}




        // It should run spotify-this-song for "I Want it That Way," as follows the text in random.txt.
        // Feel free to change the text in that document to test out the feature for other commands.
