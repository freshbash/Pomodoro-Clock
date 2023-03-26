import { useState, useRef } from 'react';
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
          if (state < 60) {
            return (
              state + 1
            );
          }
          else {
            return state;
          }
        case DECREMENTSESSION:
          if (state > 1) {
            return (
              state - 1
            );
          }
          else {
            return state;
          }
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
          if (state < 60) {
            return (
              state + 1
            );
          }
          else {
            return state;
          }
        case DECREMENTBREAK:
          if (state > 1) {
            return (
              state - 1
            );
          }
          else {
            return state;
          }
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
    else if (props.name === "break") {
      props.access.incrementBreakTimer();      
    }
  }

  function decrement () {
    if (props.name === "session") {
      props.access.decrementSessionTimer();
    }
    else if (props.name === "break") {
      props.access.decrementBreakTimer();      
    }
  }
  
  return (
    <div>
      <div id={props.name + "-label"}>{props.string}</div>
      <div id={props.name + "-length-setter"}>
        <button id={props.name + "-decrement"} className="btn" onClick={decrement} disabled={props.access.globalState.disabled}><FontAwesomeIcon icon={faMinus} /></button>
        <div id={props.name + "-length"}>{props.name === "session" ? props.access.globalState.sessionTime : props.access.globalState.breakTime}</div>
        <button id={props.name + "-increment"} className="btn" onClick={increment} disabled={props.access.globalState.disabled}><FontAwesomeIcon icon={faPlus} /></button>
      </div>
    </div>
  )
}

function Timer(props) {
  
  //Local State
  const [minutesLeft, setMinutesLeft] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [sessionActive, setSessionActive] = useState(true);
  const [timerActive, setTimerActive] = useState(false);
  const [timerPaused, setTimerPaused] = useState(false);

  //Ref
  const timerRef = useRef(null);
  const initTimerVal = useRef(null);
  const updatedTimerVal = useRef(null);
  const hasChanged = useRef(false);
  const checkChange = useRef(null);

  function startStopTimer() {

    clearInterval(checkChange.current);

    let session = sessionActive;        
    let seconds = secondsLeft;
    let minutes;

    if (!timerActive) {

        props.access.disableButtons();

        if (!timerPaused) {
            if (session) {
                initTimerVal.current = props.access.globalState.sessionTime;
                minutes = props.access.globalState.sessionTime;
            }
            else {
                initTimerVal.current = props.access.globalState.breakTime;
                minutes = props.access.globalState.breakTime;
            }
            setMinutesLeft(minutes);
        }
        else {
            minutes = minutesLeft;
        }

        timerRef.current = setInterval(() => {
        if(minutes === 0 && seconds === 0) {
            document.getElementById("beep").play();
            session = !session;
            setSessionActive(session);
            if (session) {
                initTimerVal.current = props.access.globalState.sessionTime;
                minutes = props.access.globalState.sessionTime;
            }
            else {
              initTimerVal.current = props.access.globalState.breakTime;
                minutes = props.access.globalState.breakTime;
            }
            seconds = 0;
            setMinutesLeft(minutes);
            setSecondsLeft(seconds);
        }
        else if(seconds === 0) {
            seconds = 59;
            minutes--;
            setSecondsLeft(seconds);
            setMinutesLeft(minutes);
        }
        else {
          seconds--;
          setSecondsLeft(seconds);
        }        
      }, 1000);

      setTimerPaused(false);
    }
    else {
        setTimerPaused(true);
        props.access.enableButtons();
        clearInterval(timerRef.current);
        checkChange.current = setInterval(() => {
          if (hasChanged.current) {
            minutes = updatedTimerVal.current;            
            seconds = 0;
            setMinutesLeft(minutes);
            setSecondsLeft(seconds);
            initTimerVal.current = updatedTimerVal.current;
            hasChanged.current = false;
          }
        }, 10);
    }

    setTimerActive(!timerActive);
  }

  function resetTimer() {
    //Clear intervals
    clearInterval(timerRef.current);
    clearInterval(checkChange.current);
    //Global state
    props.access.resetClock();
    props.access.enableButtons();
    //Local state
    setMinutesLeft(null)
    setSecondsLeft(0);
    setSessionActive(true);
    setTimerActive(false);
    setTimerPaused(false);
    //Refs
    timerRef.current = null;
    initTimerVal.current = null;
    updatedTimerVal.current = null;
    hasChanged.current = false;
    checkChange.current = null;
    //Reset the beep
    document.getElementById("beep").load();
  }

  if (timerPaused) {    
    if (sessionActive) {
      if (initTimerVal.current !== props.access.globalState.sessionTime) {
        // console.log("A global state change has occurred(sessionTime)");
        // console.log("Time before play: ", initTimerVal.current);
        // console.log("Time during pause: ", props.access.globalState.sessionTime);
        hasChanged.current = true;
        updatedTimerVal.current = props.access.globalState.sessionTime;
      }
    }
    else {
      if (initTimerVal.current !== props.access.globalState.breakTime) {
        // console.log("A global state change has occurred(breakTime)")
        // console.log("Time before play: ", initTimerVal.current);
        // console.log("Time during pause: ", props.access.globalState.sessionTime);
        hasChanged.current = true;
        updatedTimerVal.current = props.access.globalState.breakTime;
      }
    }
  }

  //Format time left in mm:ss format
  let timeLeft = '';

  if(timerActive || timerPaused) {
    // console.log("Time render block 1 entered!");
    // console.log("timer active?", timerActive, "timer paused?", timerPaused);
    if (minutesLeft < 10) {
      timeLeft += '0'+minutesLeft;
    }else {
      timeLeft += minutesLeft;
    }

    timeLeft += ':';

    if (secondsLeft < 10) {
      timeLeft += '0'+secondsLeft;
    } else {
      timeLeft += secondsLeft;
    }
  }
  else {
    // console.log("Time render block 2 entered!");
    // console.log("timer active?", timerActive, "timer paused?", timerPaused);
    if (sessionActive) {
        if(props.access.globalState.sessionTime < 10) {
            timeLeft += '0' + props.access.globalState.sessionTime;
        }
        else {
            timeLeft += props.access.globalState.sessionTime;
        }

        timeLeft += ":00";
    }
    else {
        if(props.access.globalState.breakTime < 10) {
            timeLeft += '0' + props.access.globalState.breakTime;
        }
        else {
            timeLeft += props.access.globalState.breakTime;
        }

        timeLeft += ":00";
    }
  }

  return (
    <div>
        <div id="timer-label">{sessionActive ? "Session" : "Break"}</div>
        <div id="time-left">{timeLeft}</div>
        <div id="control-buttons">
            <button id="start_stop" className="btn" onClick={startStopTimer}>{timerActive ? <FontAwesomeIcon icon={faPause} /> : <FontAwesomeIcon icon={faPlay} />}</button>
            <button id="reset" className="btn" onClick={resetTimer}><FontAwesomeIcon icon={faRefresh} /></button>
        </div>      
        </div>
  )
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
      globalState: state
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
