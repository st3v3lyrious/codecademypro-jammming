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
      searchResults : [
        { 
          id: 1,
          name: '',
          artist: '',
          album: ''
        },
        {
          id: 2,
          name: '',
          artist: '',
          album: ''
        },
        {
          id: 3,
          name: '',
          artist: '',
          album: ''
        }
      ],
      playlistName: 'Default Playlist' ,
      playlistTracks: [
         { 
          id: 1,
          name: '',
          artist: '',
          album: ''
        },
        {
          id: 2,
          name: '',
          artist: '',
          album: ''
        },
        {
          id: 3,
          name: '',
          artist: '',
          album: ''
        }
      ]
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
    if (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      let tracks = this.state.playlistTracks;
      tracks.pull(track);
      this.setState({playlistTracks: tracks});
    } else {
      return;
    }
  }

  updatePlaylistName(name) {
    this.setState({ playlistName: name });
  }

  savePlaylist() {
    const trackURIs = this.state.playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.playlistName,trackURIs).then(()=> {
        this.setState({ playlistTracks : [] });
      }).then(()=> {this.updatePlaylistName('New Playlist ');
    })
  }

  search(term) {
    Spotify.search(term).then(tracks => {
      this.setState({ searchResults : tracks });
    });
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults searchResults={this.searchResults} onAdd={this.addTrack} />
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
