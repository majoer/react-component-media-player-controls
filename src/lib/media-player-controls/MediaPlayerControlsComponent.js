import 'font-awesome/css/font-awesome.css';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';
import './MediaPlayerControlsComponent.scss';
import React, { Component } from 'react';
import Tooltip from 'rc-tooltip';
import Slider, { Handle } from 'rc-slider';
import moment from 'moment';
import TimeCounterComponent from '../time-counter/TimeCounterComponent';

const THRESHOLD_LOUD_VOLUME = 50;

const handle = (props) => {
  const { value, dragging, index, ...restProps } = props;
  return (
    <Tooltip
      prefixCls="rc-slider-tooltip"
      overlay={value}
      visible={dragging}
      placement="top"
      key={index}>
      <Handle value={value} {...restProps} >
        <div className="rc-slider-handle-extender"></div>
      </Handle>
    </Tooltip>
  );
};

class MediaPlayerControlsComponent extends Component {

  state = {
    volume: 0,
    currentTime: 0
  }

  componentDidMount() {
    this.setState({
      volume: this.props.volume,
      currentTime: this.props.currentTime
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const updatedFromWithin = prevState.volume !== this.state.volume
      || prevState.currentTime !== this.state.currentTime;

    if (!updatedFromWithin) {
      if (this.props.volume !== this.state.volume) {
        this.setState({
          ...this.state,
          volume: this.props.volume
        });
      } else if (this.props.currentTime !== this.state.currentTime) {
        this.setState({
          ...this.state,
          currentTime: this.props.currentTime
        });
      }

      if (this.props.options.tickTimeForwardAutomatically) {
        if (this.tickTimeHook) {
          if (!this.props.isPlaying) {
            this.stopTickTime();
          }
        } else {
          if (this.props.isPlaying) {
            this.startTickTime();
          }
        }
      }
    }
  }

  componentWillUnmount() {
    this.stopTickTime();
  }

  getToggleMuteClass() {
    if (this.props.isMuted) {
      return 'fa-volume-up muted';
    } else if (this.state.volume === 0) {
      return 'fa-volume-off';
    } else if (this.state.volume < THRESHOLD_LOUD_VOLUME) {
      return 'fa-volume-down';
    } else {
      return 'fa-volume-up';
    }
  }

  getTogglePlayClass() {
    if (this.props.isPlaying || this.props.isBuffering) {
      return 'fa fa-pause';
    } else {
      return 'fa fa-play';
    }
  }

  onClickToggleMute() {
    if (this.props.isMuted) {
      this.props.options.onUnmute();
    } else {
      this.props.options.onMute();
    }
  }

  onClickTogglePlay() {
    if (this.props.isPlaying) {
      this.props.options.onPause();
    } else {
      this.props.options.onPlay();
    }
  }

  onChangeVolume(volume) {
    this.setState({
      ...this.state,
      volume
    });

    this.props.options.onChangeVolume(volume);
  }

  onChangeCurrentTime(currentTime) {
    this.setState({
      ...this.state,
      currentTime
    });

    this.props.options.onSeek(currentTime);
  }

  getMediaPlayerModifierClass() {
    if (this.props.isBuffering) {
      return 'media-player--buffering';
    }

    return '';
  }

  startTickTime() {
    this.tickTimeHook = setInterval(() => {
      this.setState({
        ...this.state,
        currentTime: this.state.currentTime + 1
      });
    }, 1000)
  }

  stopTickTime() {
    clearInterval(this.tickTimeHook);
    delete this.tickTimeHook;
  }

  render() {
    const totalTimeDuration = moment.duration(this.props.duration, 'seconds');
    const bufferBar = this.props.isBuffering ? <div className="media-player__buffer-bar"></div> : <div></div>

    return (
      <footer className={`media-player ${this.getMediaPlayerModifierClass()}`}>
        {bufferBar}

        <div className="media-player__search-bar">
          <Slider min={0} max={Math.floor(totalTimeDuration.asSeconds())}
            value={this.state.currentTime}
            handle={handle}
            adaptiveHeight={true}
            onChange={value => this.onChangeCurrentTime(value)} />
        </div>

        <div className="media-player__media-bar">
          <div className="media-player__media-bar__step-backward">
            <div className="media-player__media-button" onClick={e => this.props.options.onStepBackward(e)}><i className="fa fa-step-backward" /></div>
          </div>
          <div className="media-player__media-bar__toggle-play">
            <div className="media-player__media-button" onClick={e => this.onClickTogglePlay(e)}><i className={this.getTogglePlayClass()} /></div>
          </div>
          <div className="media-player__media-bar__step-forward">
            <div className="media-player__media-button" onClick={e => this.props.options.onStepForward(e)}><i className="fa fa-step-forward" /></div>
          </div>
          <div className="media-player__media-bar__toggle-mute">
            <div className="media-player__media-button" onClick={e => this.onClickToggleMute(e)}><i className={`fa ${this.getToggleMuteClass()}`} /></div>
          </div>
          <div className="media-player__media-bar__volume-slider">
            <Slider min={0} max={100}
              value={this.state.volume}
              handle={handle}
              adaptiveHeight={true}
              onChange={v => this.onChangeVolume(v)} />
          </div>

          <div className="media-player__media-bar__time">
            <TimeCounterComponent duration={moment.duration(this.state.currentTime, 'seconds')} shouldShowHours={!!totalTimeDuration.hours()} />
            <span>/</span>
            <TimeCounterComponent duration={totalTimeDuration} shouldShowHours={!!totalTimeDuration.hours()} />
          </div>
          <div className="media-player__media-bar__title">
            {this.props.title}
          </div>
        </div>
      </footer>
    );
  }
}

export { MediaPlayerControlsComponent };
