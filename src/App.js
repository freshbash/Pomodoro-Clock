import React from 'react';
import './App.css';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faPlay, faPause, faRefresh } from '@fortawesome/free-solid-svg-icons';
import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from "redux";


//Redux
//Type constants
const INCREMENTSESSION = "INCREMENTSESSION";
const INCREMENTBREAK = "INCREMENTBREAK";
const DECREMENTSESSION = "DECREMENTSESSION";
const DECREMENTBREAK = "DECREMENTBREAK";
const DISABLE = "DISABLE";
const ENABLE = "ENABLE";
const RESET = "RESET";

//Action Creators
const sessInc = () => {
    return ({
        type: INCREMENTSESSION
    });
}

const sessDec = () => {
    return ({
        type: DECREMENTSESSION
    });
}

const breakInc = () => {
    return ({
        type: INCREMENTBREAK
    });
}

const breakDec = () => {
    return ({
        type: DECREMENTBREAK
    });
}

const buttonEn = () => {
    return ({
        type: ENABLE
    });
}

const buttonDe = () => {
    return ({
        type: DISABLE
    });
}

const reset = () => {
  return ({
    type: RESET
  })
}

//Slice Reducers
const sessionReducer = (state=25, action) => {
    switch(action.type) {
        case INCREMENTSESSION:
          return (
            state + 1
          );
        case DECREMENTSESSION:
          return (
            state - 1
          );
        case RESET:
          return (
            25
          )
        default:
          return state;
    }
}

const breakReducer = (state=5, action) => {
    switch(action.type) {
        case INCREMENTBREAK:
          return (
            state + 1
          );
        case DECREMENTBREAK:
          return (
            state - 1
          );
        case RESET:
          return (
            5
          )
        default:
          return state;
    }
}

const buttonReducer = (state=false, action) => {
    switch(action.type) {
        case ENABLE:
          return (
            false
          );
        case DISABLE:
          return (
            true
          );
        default:
          return state;
    }
}

//Root reducer
const rootReducer = combineReducers({
    sessionTime: sessionReducer,
    breakTime: breakReducer,
    disabled: buttonReducer
});


//Redux Store
export const store = configureStore({reducer : rootReducer});


//React
function TimeSetter(props) {
  function increment() {
    if (props.name === "session") {
      props.access.incrementSessionTimer();
    }
    else {
      props.access.incrementBreakTimer();      
    }
  }

  function decrement () {
    if (props.name === "session") {
      props.access.decrementSessionTimer();
    }
    else {
      props.access.decrementBreakTimer();      
    }
  }
  
  return (
    <div>
      <div id={props.name + "-label"}>{props.string}</div>
      <div id={props.name + "-length-setter"}>
        <button id={props.name + "-decrement"} className="btn" onClick={decrement} disabled={props.access.state.disabled}><FontAwesomeIcon icon={faMinus} /></button>
        <div id={props.name + "-length"}>{props.name === "session" ? props.access.state.sessionTime : props.access.state.breakTime}</div>
        <button id={props.name + "-increment"} className="btn" onClick={increment} disabled={props.access.state.disabled}><FontAwesomeIcon icon={faPlus} /></button>
      </div>
    </div>
  )
}

class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      minutesLeft: 25,
      secondsLeft: 0,
      sessionActive: true,
      timerActive: false
    }
    this.startStopTimer = this.startStopTimer.bind(this);
    this.resetTimer = this.resetTimer.bind(this);
  }

  startStopTimer() {
    
  }

  resetTimer() {
    this.props.access.resetClock();
    this.state.secondsLeft = 0;
  }

  render() {
    
    const sessionLength = this.props.access.state.sessionTime;
    let timeLeft = '';
    
    if (sessionLength < 10) {
      timeLeft += '0'+sessionLength;
    }else {
      timeLeft += sessionLength;
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

export function Presentational(props) {
  return (
    <div id="display">
      <TimeSetter name="session" string="Session Length" access={props} />
      <TimeSetter name="break" string="Break Length" access={props} />
      <Timer access={props} />
    </div>
  );  
}

const mapStateToProps = (state) => {
  return ({
    state: state
  });
}

const mapDispatchToProps = (dispatch) => {
  return ({
      incrementSessionTimer: () => {
          dispatch(sessInc());
      },

      decrementSessionTimer: () => {
          dispatch(sessDec());
      },

      incrementBreakTimer: () => {
          dispatch(breakInc());
      },

      decrementBreakTimer: () => {
          dispatch(breakDec());
      },

      enableButtons: () => {
          dispatch(buttonEn());
      },

      disableButtons: () => {
          dispatch(buttonDe());
      },

      resetClock: () => {
        dispatch(reset());
      }
  });
}

export const Container = connect(mapStateToProps, mapDispatchToProps)(Presentational);
