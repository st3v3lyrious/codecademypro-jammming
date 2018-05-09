const clientID = 'e78e3992d1af474a98696841d4e255f8';
const redirectURI = 'http://localhost:3000/';

const url = window.location.href;
let userAccesToken = url.match(/access_token=([^&]*)/);
let expiresIn = url.match(/expires_in=([^&]*)/);


const Spotify = {
  getAccessToken() {
    if(userAccesToken !== '') {
      return userAccesToken;
    } else if(userAccesToken && expiresIn){
      this.userAccesToken = userAccesToken;
      this.expiresIn = expiresIn;
      window.setTimeout(() => userAccesToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
    } else {
      window.location.replace(`https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`)
    }
  },

  search(term) {
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,
    {
      headers: {
        Authorization: `Bearer ${userAccesToken}`
      }
    }).then(response => {
      if(response.ok) {
        return response.json();
      }
      throw new Error('Request failed!');
    }, networkError => console.log(networkError.message)
    ).then(jsonResponse => {
      if (jsonResponse.tracks) {
        return jsonResponse.tracks.items.map(track => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri
        }));
      } else {
        return [];
      }
    })
  },

  savePlaylist(playlistName,trackURIs) {
    if(playlistName && trackURIs) {
      let userAccessToken = this.userAccessToken;
      let headers = {"Authorization":`Bearer ${userAccessToken}`};
      let userID;
       let playlistID;
      return fetch('https://api.spotify.com/v1/me', {headers: headers}).then(response => {
        return response.json()
      }).then(jsonResponse => {
        userID = jsonResponse.id;
      }).then(() => {
        return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`,{
          method:'POST',
          headers:{
            "Authorization":'Bearer '+userAccessToken,
            "Content-Type": 'application/json'
          },
          body:JSON.stringify({name:playlistName})
        })
      }).then(response => {
        return response.json();
      }).then(jsonResponse => {
        playlistID = jsonResponse.id;
      }).then(() => {
        return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`,{
          method:'POST',
          headers:{
            "Authorization":`Bearer ${userAccessToken}`,
            "Content-Type": 'application/json'
          },
          body:JSON.stringify({'uris':trackURIs})
        })
      }).then(response => {
        return response.json();
      }).then(jsonResponse => {
        playlistID = jsonResponse.id;
      })
    } else {
      return;
    }
  }
};

export default Spotify;