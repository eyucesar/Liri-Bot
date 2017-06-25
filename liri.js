
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");
var fs = require("fs");
var nodeArg = process.argv;
var command = process.argv[2];
var userInput = process.argv[3];
userInput = nodeArg.slice(3).join(" ");
var result = "";

function checkCommand() {
    switch(command) {
        case "my-tweets":
            displayTweets();
            break;
        
        case "spotify-this-song":
            showSongInfo();
            break;

        case "movie-this":
            showMovieInfo();
            break;

        case "do-what-it-says":
            doThis();
            break;

        default:
            console.log("Please enter one of these commands: my-tweets, spotify-this-song, movie-this or do-what-it-says.");
    }
};

checkCommand();

function displayTweets() {
    var keyList = require("./keys.js");
    var client = keyList.twitterKeys;
    var params = {screen_name: "yebru2017"};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            for (var i = 0; i < tweets.length; i++) {
                result = tweets[i].text + "  ------  " + tweets[i].created_at;
                console.log(result);
                appendFile();
            }
        }
    });
};

function showSongInfo() {
    var spotify = new Spotify({
        id: "4818bc7623a940cea475400ac252c315",
        secret:"525866088b594d3f8c6eec4572c8cf1f"
    });
    if (nodeArg.length > 3) {
        spotify
            .search({ type: "track", query: userInput, limit: 1})
            .then(function(response) {
                result = "\nName of the artist: " + response.tracks.items[0].album.artists[0].name + "\nName of the song: " + response.tracks.items[0].name + "\nThe name of the album is: " + response.tracks.items[0].album.name + "\nSong preview: " + response.tracks.items[0].preview_url + "\n";
                console.log(result);
                appendFile();
            })
            .catch(function(err) {
                console.log("An error occurred. Please try again.");
            });
    } if (nodeArg.length === 3) {
        spotify
            .search({ type: "track", query: "the sign ace of base", limit: 1})
            .then(function(response) {
                result = "\nName of the artist: " + response.tracks.items[0].album.artists[0].name + "\nName of the song: " + response.tracks.items[0].name + "\nThe name of the album is: " + response.tracks.items[0].album.name + "\nSong preview: " + response.tracks.items[0].preview_url;
                console.log(result);
                appendFile();
            })
            .catch(function(err) {
                console.log("An error occurred. Please try again.");
            });
    }   
};

function showMovieInfo() {
    if (nodeArg.length > 3) {
        userInput = nodeArg.slice(3).join("+");
        var queryUrl = "http://www.omdbapi.com/?t=" + userInput + "&y=&plot=short&apikey=40e9cece";
        //console.log(queryUrl);
        request(queryUrl, function(error, response, body) {
        body = JSON.parse(body);
            if (!error && response.statusCode === 200) {
                result = "\nTitle: " + body.Title + '\n' + "Release Year: " + body.Year + '\n' + "IMDB Rating: " + body.imdbRating + '\n' + "Production Country: " + body.Country + '\n' + "Language: " + body.Language + '\n' + "Plot: " + body.Plot + '\n' + "Actors: " + body.Actors + '\n' + "Website: " + body.Website;
                console.log(result);
                appendFile();
            }
        });
    } if (nodeArg.length === 3) {
        var queryUrl = "http://www.omdbapi.com/?t=Mr+Nobody&y=&plot=short&apikey=40e9cece";
        //console.log(queryUrl);
        request(queryUrl, function(error, response, body) {
        body = JSON.parse(body);
            if (!error && response.statusCode === 200) {
                result = "\nTitle: " + body.Title + '\n' + "Release Year: " + body.Year + '\n' + "IMDB Rating: " + body.imdbRating + '\n' + "Production Country: " + body.Country + '\n' + "Language: " + body.Language + '\n' + "Plot: " + body.Plot + '\n' + "Actors: " + body.Actors + '\n' + "Website: " + body.Website;
                console.log(result);
                appendFile();
            }
        });
    }
};

function doThis() {
    var fs = require("fs");
    fs.readFile("random.txt", "utf8", function(err, data) {
        if (err) {
            return console.log(err);
        }
        var output = data.split(",");
        command = output[0];
        userInput = output[1];
        nodeArg.push(userInput);
        checkCommand();
    });
};

//function that will write the terminal outputs to the log.txt file
function appendFile() {
    fs.appendFile("log.txt", "\n" + result, function(error) {
        if(error) {
            console.log(error);
        }
    });
}