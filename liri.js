require("dotenv").config();

var Spotify = require('node-spotify-api');
var axios = require('axios');
var moment = require('moment');
var keys = require('./keys.js');
var fs = require('fs');

var spotify = new Spotify(keys.spotify);

var args = process.argv;


// Commands TODO


//  concert-this '<artist/band name here>'
// AXIOS
// Search Bands in Town Artist Events API and return Name of Venue, Venue Location, and Date of Event (in moment format MM/DD/YYYY)

var concertCheck = function (band) {
    band = band.replace(/ /g, '+')
    band = band.replace(/"/g, "")
    var axiosURL = "https://rest.bandsintown.com/artists/" + band + "/events?app_id=codingbootcamp";
    axios
        .get(axiosURL)
        .then(function (response) {
            var events = response.data
            for (var i = 0; i < events.length; i++) {
                var dateString = moment(JSON.stringify(events[i].datetime), 'YYYY-MM-DDTHH:mm:ss');
                var displayString = dateString.format('MM/DD/YYYY');
                console.log('Venue name: ' + events[i].venue.name + '\r\nVenue Location: ' + events[i].venue.city + '\r\nEvent date: ' + displayString + '\r\n===============================================');
                fs.appendFile('log.txt', 'Venue name: ' + events[i].venue.name + '\r\nVenue Location: ' + events[i].venue.city + '\r\nEvent date: ' + displayString + '\r\n===============================================\r\n', function (error) {
                    if (error) {
                        console.log(error);
                    };
                    console.log('log.txt updated');
                });
            };
        })
        .catch(function (error) {
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log("Error", error.message);
            }
            console.log(error.config);
        })
};

//  spotify-this-song '<song name here>'
// NODE-SPOTIFY-API
// Return Artist(s), Song name, A preview Link from Spotify, and Album the song is from.  If no info found provide a default response

var songCheck = function (song) {
    spotify
        .search({
            type: 'track',
            query: song
        })
        .then(function (response) {

            var tracks = response.tracks;

            for (var i = 0; i < tracks.items.length; i++) {
                var artistArray = [];
                if (JSON.stringify(tracks.items[i].name) == '"' + song + '"') {
                    for (var j = 0; j < tracks.items[i].album.artists.length; j++) {
                        console.log(tracks.items[i].album.artists[j].name);
                        artistArray.push(JSON.stringify(tracks.items[i].album.artists[j].name));
                    };

                    if (tracks.items[i].preview_url === null) {
                        console.log('The title of that track is: ' + tracks.items[i].name + '\r\nWe found it on the album: ' + tracks.items[i].album.name + '\r\nThat album featured: ' + artistArray + "\r\nSorry, we don't have a preview clip of this song for you :(\r\n===============================================\r\n");
                        fs.appendFile('log.txt', 'The title of that track is: ' + tracks.items[i].name + '\r\nWe found it on the album: ' + tracks.items[i].album.name + '\r\nThat album featured: ' + artistArray + "\r\nSorry, we don't have a preview clip of this song for you :(\r\n===============================================\r\n", function (error) {
                            if (error) {
                                console.log(error);
                            };
                            console.log('log.txt updated');
                        });
                    } else {
                        console.log('The title of that track is: ' + tracks.items[i].name + '\r\nWe found it on the album: ' + tracks.items[i].album.name + '\r\nThat album featured: ' + artistArray + "\r\nHere's a link to a preview of the song: " + tracks.items[i].preview_url + "\r\n===============================================\r\n");
                        fs.appendFile('log.txt', 'The title of that track is: ' + tracks.items[i].name + '\r\nWe found it on the album: ' + tracks.items[i].album.name + '\r\nThat album featured: ' + artistArray + "\r\nHere's a link to a preview of the song: " + tracks.items[i].preview_url + "\r\n===============================================\r\n", function (error) {
                            if (error) {
                                console.log(error);
                            };
                            console.log('log.txt updated');
                        });
                    }
                }
            };
        })
        .catch(function (error) {
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log("Error", error.message);
            }
            console.log(error.config);
        });
}

//  movie-this '<movie name here>'
// AXIOS
// Return Title of movie, Year of Release, IMDB rating, Rotten Tomatoes Rating, Country of Origin, Language, Plot summary, Actors.  Have a default response for no return. 
// Use Trilogy API key

var checkMovie = function (movie) {
    movie = movie.replace(/ /g, '+')
    var axiosURL = "http://www.omdbapi.com/?apikey=trilogy&t=" + movie + "&type=movie";
    axios
        .get(axiosURL)
        .then(function (response) {
            var data = response.data;
            console.log(data.Title + "\r\nReleased in " + data.Released + "\r\nRated " + data.imdbRating + " on imdb\r\nand " + data.Ratings[1].Value + " from Rotten Tomatoes\r\nThe film is from " + data.Country + " and is in " + data.Language + "\r\n" + data.Plot + "\r\nIt features " + data.Actors);

            fs.appendFile('log.txt', data.Title + "\r\nReleased in " + data.Released + "\r\nRated " + data.imdbRating + " on imdb\r\nand " + data.Ratings[1].Value + " from Rotten Tomatoes\r\nThe film is from " + data.Country + " and is in " + data.Language + "\r\n" + data.Plot + "\r\nIt features " + data.Actors + '\r\n===============================================\r\n', function (error) {
                if (error) {
                    console.log(error);
                };
                console.log('log.txt updated');
            });
        })
        .catch(function (error) {
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log("Error", error.message);
            }
            console.log(error.config);
        })
}

//  do-what-it-says
// FS
// This should grab whatever command is in the random.txt and run that command

var checkPreset = function () {
    fs.readFile('random.txt', 'utf8', function (error, data) {
        if (error) {
            console.log(error);
        }
        var presetArray = data.split(', ');

        console.log(presetArray[0] === 'spotify-this-song');
        switch (presetArray[0]) {
            case 'concert-this':
                concertCheck(presetArray[1]);
                break;
            case 'spotify-this-song':
                songCheck(presetArray[1]);
                break;
            case 'movie-this':
                checkMovie(presetArray[1]);
                break;
            default:
                console.log("Something is wrong with the Random.txt File");
        }
    })
};


// BONUS
// Have the data log itself into the log.txt file (APPEND_FILE)

switch (args[2]) {
    case 'concert-this':
        concertCheck(args[3]);
        break;
    case 'spotify-this-song':
        songCheck(args[3]);
        break;
    case 'movie-this':
        checkMovie(args[3]);
        break;
    case 'do-what-it-says':
        checkPreset();
        break;
    default:
        console.log("Sorry, I didn't catch what you said.\r\nPlease enter one of the following commands instead:\r\nconcert-this '<artist/band name here>'\r\nspotify-this-song '<song name here>'\r\nmovie-this '<movie name here>'\r\ndo-what-it-says")
}