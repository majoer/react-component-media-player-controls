import React, { Component } from "react";
import ReactDOM from "react-dom";
import { MediaPlayerControlsComponent } from './lib/index';
import { throttle } from 'throttle-debounce';

class TestApp extends Component {

  state = {
    volume: 0,
    isMuted: false,
    currentTime: 0,
    duration: 1000,
    isPlaying: false,
    isPaused: false,
    isBuffering: false,
    title: 'Awesome video 1'
  }

  mediaPlayerComponentOptions = {
    tickTimeForwardAutomatically: true,
    onMute: () => { this.setState({ ...this.state, isMuted: true }); },
    onUnmute: () => { this.setState({ ...this.state, isMuted: false }); },
    onPlay: () => {
      if (this.state.isPaused) {
        this.setState({ ...this.state, isPlaying: true, isPaused: false });
      } else {
        this.setState({ ...this.state, isPlaying: true });
      }
    },
    onPause: () => { this.setState({ ...this.state, isPlaying: false, isPaused: true }); },
    onStepBackward: () => { console.log('onStepBackward'); },
    onStepForward: () => { console.log('onStepForward'); },

    onSeek: throttle(500, (currentTime) => {
      setTimeout(() => {
        this.setState({ ...this.state, currentTime });
      }, 3000)
    }),

    onChangeVolume: throttle(300, (volume) => {
      setTimeout(() => {
        this.setState({ ...this.state, volume });
      }, 3000)
    })
  }

  onClickToggleBuffering() {
    this.setState({ ...this.state, isBuffering: !this.state.isBuffering });
  }

  render() {
    return <div>
      <button onClick={(e) => this.onClickToggleBuffering(e)}>Toggle buffering</button>
      <MediaPlayerControlsComponent options={this.mediaPlayerComponentOptions} {...this.state} />
    </div>
  }
}

ReactDOM.render(<TestApp />, document.getElementById("index"));
