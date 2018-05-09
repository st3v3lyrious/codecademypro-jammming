const clientID = 'e78e3992d1af474a98696841d4e255f8';
const redirectURI = 'http://st3v3lyrious.surge.sh';
// const redirectURI = 'http://localhost:3000/';
const scope = 'playlist-modify-public';

let accessToken;
let expiresIn;

const Spotify = {
  getAccessToken(){
    const url = window.location.href;
    const token = url.match(/access_token=([^&]*)/);
    const expiry = url.match(/expires_in=([^&]*)/);
    if (accessToken){
      return accessToken;
    } else if (token && expiry){
      accessToken = token[1];
      expiresIn = expiry[1];
      window.setTimeout(()=> accessToken = null, expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
      return accessToken;
    } else {
      window.location = `https://accounts.spotify.com/authorize?client_id=${clientID}&redirect_uri=${redirectURI}&response_type=token&scope=${scope}`;
    }
  },

  search(term){
    this.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&limit=20&q=${term}`, {
      headers: {Authorization: `Bearer ${accessToken}`}
    }).then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Request Failed!');
    }, networkError => console.log(networkError.message)
    ).then(jsonResponse => {
      if (jsonResponse.tracks) {
        return jsonResponse.tracks.items.map(track => ({
          id: track.id,
          title: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri
        }));
      } else {
        return [];
      }
    });
  },

  savePlaylist(name, list){
    this.getAccessToken();
    let userId
    let playlistId
    if (name && list) {
      return fetch('https://api.spotify.com/v1/me', {
        headers: {Authorization: `Bearer ${accessToken}`}
      }).then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Request Failed!');
      }, networkError => console.log(networkError.message)
      ).then(jsonResponse => {
        return userId = jsonResponse.id;
      }).then(()=> {
        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
          headers: {Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json'},
          method: 'POST',
          body: JSON.stringify({name: name})
        }).then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error('Request Failed!');
        }, networkError => console.log(networkError.message)
        ).then(jsonResponse => {
          return playlistId = jsonResponse.id;
        });
      }).then(()=> {
        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
          headers: {Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json'},
          method: 'POST',
          body: JSON.stringify({uris: list})
        }).then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error('Request Failed!');
        }, networkError => console.log(networkError.message)
        ).then(jsonResponse => {
        });
      });
    } else {
      return;
    }
  }
}

export default Spotify;