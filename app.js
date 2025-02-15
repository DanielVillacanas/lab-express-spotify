require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/artist-search", (req, res) => {
  let listArtist = req.query.artistName;
  spotifyApi
    .searchArtists(listArtist)
    .then((data) => {
      console.log("The received data from the API: ", data.body.artists);
      res.render("artist-search-results", data.body.artists);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:id", (req, res) => {
  let id = req.params.id;
  console.log(id);
  spotifyApi
    .getArtistAlbums(id)
    .then((albums) => {
      console.log(albums.body.items);
      res.render("albums", albums.body.items);
    })
    .catch((err) =>
      console.log("The error while searching albums occurred: ", err)
    );
});

app.get("/tracks/:id", (req, res) => {
  console.log(req.params.id);
  spotifyApi.getAlbumTracks(req.params.id).then((tracks) => {
    console.log(tracks.body.items);
    res.render("tracks", tracks.body.items);
  });
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
