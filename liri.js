var Twitter = require("twitter");

var twitterKeysFile = require("./keys.js");

var spotifyKeysFile = require("./keys.js");

var request = require("request");

var fs = require("fs");

var filename = './random.txt';

var action = process.argv[2];

var argument = "";

search(action, argument);

function search(action, argument) {

  argument = getThirdArgument();

  switch (action) {

    case "my-tweets":
      getMyTweets();
      break;

    case "spotify-this-song":
      var songTitle = argument;
      if (songTitle === "") {
        lookupSpecificSong();
      } else {
        getSongInfo(songTitle);
      }
      break;

    case "movie-this":
      var movieTitle = argument;
      if (movieTitle === "") {
        getMovieInfo("Mr. Nobody");
      } else {
        getMovieInfo(movieTitle);
      }
      break;

    case "do-what-it-says":
      doWhatItSays();
      break;
  }
}


function getThirdArgument() {
  argumentArray = process.argv;
  for (var i = 3; i < argumentArray.length; i++) {
    argument += argumentArray[i];
  }
  return argument;
}


function getMyTweets() {
  var client = new Twitter(twitterKeysFile.twitterKeys);

  var params = { q: '@nycyoo350', count: 20 };

  client.get('search/tweets', params, function (error, tweets, response) {
    if (!error) {

      for (var i = 0; i < tweets.statuses.length; i++) {
        var tweetText = tweets.statuses[i].text;
        console.log("Tweet Text: " + tweetText);
        var tweetCreationDate = tweets.statuses[i].created_at;
        console.log("Tweet Creation Date: " + tweetCreationDate);
      }
    } else {
      console.log(error);
    }
  });
}

function getSongInfo(songTitle) {

  spotify.search({ type: 'track', query: songTitle }, function (err, data) {
    if (err) {
      console.log(err);
      return
    }

    var artistsArray = data.tracks.items[0].album.artists;

    var artistsNames = [];

    for (var i = 0; i < artistsArray.length; i++) {
      artistsNames.push(artistsArray[i].name);
    }

    var artists = artistsNames.join(", ");

    console.log("Artist(s): " + artists);
    console.log("Song: " + data.tracks.items[0].name)
    console.log("Spotify Preview URL: " + data.tracks.items[0].preview_url)
    console.log("Album Name: " + data.tracks.items[0].album.name);
  });

}

function lookupSpecificSong() {

  spotify.lookup({ type: 'track', id: '55a6d0eb1be34ae7b9ebcb9b05450f37' }, function (err, data) {
    if (err) {
      console.log(err);
      return
    }

    console.log("Artist: " + data.artists[0].name);
    console.log("Song: " + data.name);
    console.log("Spotify Preview URL: " + data.preview_url);
    console.log("Album Name: " + data.album.name);
  });
}

function getMovieInfo(movieTitle) {

  var queryUrl = "http://www.omdbapi.com/?t=" + movieTitle + "&y=&plot=short&tomatoes=true&r=json";

  request(queryUrl, function (error, response, body) {
    if (!error && response.statusCode === 200) {

      var movie = JSON.parse(body);

      console.log("Movie Title: " + movie.Title);
      console.log("Release Year: " + movie.Year);
      console.log("IMDB Rating: " + movie.imdbRating);
      console.log("Country Produced In: " + movie.Country);
      console.log("Language: " + movie.Language);
      console.log("Plot: " + movie.Plot);
      console.log("Actors: " + movie.Actors);
      console.log("Rotten Tomatoes Rating: " + movie.Ratings[2].Value);
      console.log("Rotten Tomatoes URL: " + movie.tomatoURL);
    }
  });
}

function doWhatItSays() {

  fs.readFile("random.txt", "utf8", function (err, data) {
    if (err) {
      console.log(err);
    } else {
      var randomArray = data.split(",");
      action = randomArray[0];
      argument = randomArray[1];
      doSomething(action, argument);
    }
  });
}

