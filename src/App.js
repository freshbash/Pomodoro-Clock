import React from 'react';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faPlay, faPause, faRefresh } from '@fortawesome/free-solid-svg-icons';


function TimeSetter(props) {
  return (
    <div>
      <div id={props.id + "-label"}>props.innerHTML</div>
      <div id={props.id + "-length-setter"}>
        <button id={props.id + "-decrement"} className="btn"><FontAwesomeIcon icon={faMinus} /></button>
        <div id={props.id + "-length"}></div>
        <button id={props.id + "-increment"} className="btn"><FontAwesomeIcon icon={faPlus} /></button>
      </div>
    </div>
  )
}

class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      minutesLeft : 25,
      secondsLeft : 0
    }
  }

  startStopTimer() {
    return;
  }

  resetTimer() {
    return;
  }

  render() {
    return (
      <div>
        <div id="timer-label"></div>
        <div id="time-left">{this.state.minutesLeft}</div>
        <div id="control-buttons">
          <button id="start-stop" className="btn" onClick={this.startStopTimer}><FontAwesomeIcon icon={faPlay} /></button>
          <button id="reset" className="btn" onClick={this.resetTimer}><FontAwesomeIcon icon={faRefresh} /></button>
        </div>
      </div>
    )
  }
}

class Presentational extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <div id="display">
          <TimeSetter id="session" innerHTML="Session Length" />
          <TimeSetter id="break" innerHTML="Break Length" />
          <Timer />
        </div>
      </div>
    );
  }  
}

export default Presentational;
