import React from 'react';
import './App.css';
import ReactRedux from 'react-redux';
import { MapStateToProps, MapDispatchToProps } from './store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faPlay, faPause, faRefresh } from '@fortawesome/free-solid-svg-icons';


function TimeSetter(props) {
  return (
    <div>
      <div id={props.id + "-label"}>{props.innerHTML}</div>
      <div id={props.id + "-length-setter"}>
        <button id={props.id + "-decrement"} className="btn" disabled={props.disabled}><FontAwesomeIcon icon={faMinus} /></button>
        <div id={props.id + "-length"}>{props.id === "session" ? 25 : 5}</div>
        <button id={props.id + "-increment"} className="btn" disabled={props.disabled}><FontAwesomeIcon icon={faPlus} /></button>
      </div>
    </div>
  )
}

class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionLength: this.props.state.sessionTime,
      breakLength : this.props.state.breakTime,
      minutesLeft: 25,
      secondsLeft: 0,
      sessionActive: true,
      timerActive: false
    }
    this.startStopTimer = this.startStopTimer.bind(this);
    this.resetTimer = this.resetTimer.bind(this);
  }

  startStopTimer() {
    console.log("startStop Button working");
  }

  resetTimer() {
    console.log("reset button working");
  }

  render() {
    
    let timeLeft = '';
    if (this.state.minutesLeft < 10) {
      timeLeft += '0'+this.state.minutesLeft;
    }else {
      timeLeft += this.state.minutesLeft;
    }

    timeLeft += ':';

    if (this.state.secondsLeft < 10) {
      timeLeft += '0'+this.state.secondsLeft;
    } else {
      timeLeft += this.state.secondsLeft;
    }

    return (
      <div>
        <div id="timer-label">{this.state.sessionActive ? "Session" : "Break"}</div>
        <div id="time-left">{timeLeft}</div>
        <div id="control-buttons">
          <button id="start-stop" className="btn" onClick={this.startStopTimer}>{this.state.timerActive ? <FontAwesomeIcon icon={faPause} /> : <FontAwesomeIcon icon={faPlay} />}</button>
          <button id="reset" className="btn" onClick={this.resetTimer}><FontAwesomeIcon icon={faRefresh} /></button>
        </div>
      </div>
    )
  }
}

class Presentational extends React.Component {
  render() {
    return (
      <div id="display">
        <TimeSetter id="session" innerHTML="Session Length" disabled={this.props.state.disabled} />
        <TimeSetter id="break" innerHTML="Break Length" disabled={this.props.state.disabled} />
        <Timer />
      </div>
    );
  }  
}

const connect = ReactRedux.connect;
const Container = connect(MapStateToProps, MapDispatchToProps)(Presentational);

export default Container;
