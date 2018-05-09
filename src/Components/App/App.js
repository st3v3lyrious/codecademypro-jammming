import React, { Component } from 'react';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      searchResults : [],
      playlistName: 'New Playlist',
      playlistTracks: []
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track) {
    if (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    } else {
      let tracks = this.state.playlistTracks;
      tracks.push(track);
      this.setState({playlistTracks: tracks});
    }
  }

  removeTrack(track) {
    let tracks = this.state.playlistTracks;
    const updatedTracks = tracks.filter(playlistTrack => track.id !== playlistTrack.id);
    this.setState({playlistTracks: updatedTracks});
  }

  updatePlaylistName(name) {
    this.setState({ playlistName: name });
  }

  savePlaylist(){
    const trackURIs = this.state.playlistTracks.map(track => track.uri);
    const listName = this.state.playlistName;
    Spotify.savePlaylist(listName, trackURIs);
    this.setState({
      playlistName: 'New Playlist',
      playlistTracks: []
    })
  }

  search(term) {
    Spotify.search(term).then(tracks => {
      this.setState({ searchResults : tracks });
    });
  }

  render() {
    Spotify.getAccessToken();
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
            <Playlist playlistName={this.state.playlistName} onNameChange={this.updatePlaylistName}
                      playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} 
                      onSave={this.savePlaylist} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
