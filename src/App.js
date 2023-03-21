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


//Default State
const defaultState = {
    sessionTime: 25,
    breakTime: 5,
    disabled: false
};

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

//Reducers
const sessionReducer = (state=defaultState, action) => {
    switch(action.type) {
        case INCREMENTSESSION:
            return ({
                sessionTime: state.sessionTime + 1
            });
        case DECREMENTSESSION:
            return ({
                sessionTime: state.sessionTime - 1
            });
        default:
            return state;
    }
}

const breakReducer = (state= defaultState, action) => {
    switch(action.type) {
        case INCREMENTBREAK:
            return ({
                breakTime: state.breakTime + 1
            });
        case DECREMENTBREAK:
            return ({
                breakTime: state.breakTime - 1
            });
        default:
            return state;
    }
}

const buttonReducer = (state=defaultState, action) => {
    switch(action.type) {
        case ENABLE:
            return ({
                disabled: false
            });
        case DISABLE:
            return ({
                disabled: true
            });
        default:
            return state;
    }
}

const rootReducer = combineReducers({
    sessionTime: sessionReducer,
    breakTime: breakReducer,
    disabled: buttonReducer
});


//Redux Store
export const store = configureStore({reducer : rootReducer});


//React
function TimeSetter(props) {
  console.log(props.details.sessionTime);
  console.log(props.details.breakTime);
  console.log(props.details.disabled);
  return (
    <div>
      <div id={props.name + "-label"}>{props.string}</div>
      <div id={props.name + "-length-setter"}>
        <button id={props.name + "-decrement"} className="btn" disabled={props.details.disabled}><FontAwesomeIcon icon={faMinus} /></button>
        <div id={props.name + "-length"}>{props.name === "session" ? props.details.sessionTime : props.details.breakTime}</div>
        <button id={props.name + "-increment"} className="btn" disabled={props.details.disabled}><FontAwesomeIcon icon={faPlus} /></button>
      </div>
    </div>
  )
}

class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionLength: this.props.details.sessionTime,
      breakLength : this.props.details.breakTime,
      minutesLeft: this.props.details.sessionTime,
      secondsLeft: 0,
      sessionActive: true,
      timerActive: false
    }
    this.startStopTimer = this.startStopTimer.bind(this);
    this.resetTimer = this.resetTimer.bind(this);
  }

  startStopTimer() {
    console.log(store.getState());
    console.log("startStop Button working");
  }

  resetTimer() {
    console.log(store.getState());
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

export function Presentational(props) {
  return (
    <div id="display">
      <TimeSetter name="session" string="Session Length" details={props.details} />
      <TimeSetter name="break" string="Break Length" details={props.details} />
      <Timer details={props.details} />
    </div>
  );  
}

const mapStateToProps = (state) => {
  return ({
    details: state
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
      }
  });
}

export const Container = connect(mapStateToProps, mapDispatchToProps)(Presentational);
