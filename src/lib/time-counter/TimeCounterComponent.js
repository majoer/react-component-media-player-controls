import React, { Component } from 'react';

class TimeCounterComponent extends Component {

  format(time) {
    if (time < 10) {
      return `0${time}`;
    }

    return `${time}`;
  }

  render() {

    const currentHours = this.props.duration.hours();
    const currentMinutes = this.props.duration.minutes();
    const currentSeconds = this.props.duration.seconds();

    const formattedMinutes = this.format(currentMinutes);
    const formattedSeconds = this.format(currentSeconds);

    let hourPart;

    if (this.props.shouldShowHours) {
      const formattedHours = this.format(currentHours);

      hourPart = (
        <span>
          <span className="time-counter__hours">{formattedHours}</span>
          <span>:</span>
        </span>
      );
    }

    return (
      <span className="time-counter">
        {hourPart}
        <span className="time-counter__minutes">{formattedMinutes}</span>
        <span>:</span>
        <span className="time-counter__seconds">{formattedSeconds}</span>
      </span>
    );
  }
}

export default TimeCounterComponent;
