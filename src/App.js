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
const sessionReducer = (state=2, action) => {
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

const breakReducer = (state=1, action) => {
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
    if (props.name === "session" && props.access.state.sessionTime < 60) {
      props.access.incrementSessionTimer();
    }
    else if (props.name === "break" && props.access.state.breakTime < 60) {
      props.access.incrementBreakTimer();      
    }
  }

  function decrement () {
    if (props.name === "session" && props.access.state.sessionTime > 1) {
      props.access.decrementSessionTimer();
    }
    else if (props.name === "break" && props.access.state.breakTime > 1) {
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

function Timer(props) {
  
  //Local State
  const [minutesLeft, setMinutesLeft] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [sessionActive, setSessionActive] = useState(true);
  const [timerActive, setTimerActive] = useState(false);
  const [timerPaused, setTimerPaused] = useState(false);
  // const [count, setCount] = useState(0);

  //Ref
  const timerRef = useRef(null);

  function startStopTimer() {

    clearInterval(timerRef.current);
    // props.access.enableButtons();    

    if (!timerActive) {

        // console.log("Timer block 1 entered!");
        // console.log("timer active?", timerActive, "timer paused?", timerPaused);

        props.access.disableButtons();

        let session = sessionActive;
        let seconds = secondsLeft;
        let minutes;
        if (!timerPaused) {
            if (session) {
                minutes = props.access.state.sessionTime;
            }
            else {
                minutes = props.access.state.breakTime;
            }
            setMinutesLeft(minutes);
        }
        else {
            minutes = minutesLeft;
        }

        timerRef.current = setInterval(() => {
        // console.log(secondsLeft);
        if(minutes === 0 && seconds === 0) {
            // console.log("Beeeeeeep!");
            document.getElementById("beep").play();
            // console.log("Start next timer!");
            session = !session;
            setSessionActive(session);
            if (session) {
                minutes = props.access.state.sessionTime;
            }
            else {
                minutes = props.access.state.breakTime;
            }
            seconds = 0;
            setMinutesLeft(minutes);
            setSecondsLeft(seconds);
            // clearInterval(timerRef.current);
        }
        else if(seconds === 0) {
            // console.log("hello1");
            seconds = 59;
            minutes--;
            setSecondsLeft(seconds);
            setMinutesLeft(minutes);
        }
        else {
          // console.log("hello2");
          seconds--;
          setSecondsLeft(seconds);
        }        
      }, 1000);

      setTimerPaused(false);
      // let i = 0;
      // setCount(0);    
      // timerRef.current = setInterval(() => {
      //   i++;
      //   setCount(i);
      // }, 1000);
    }
    else {
        // console.log("Timer block 2 entered");
        // console.log("timer active?", timerActive, "timer paused?", timerPaused);
        setTimerPaused(true);
        props.access.enableButtons();
    }

    setTimerActive(!timerActive);
    //Should start and stop the timer
    //If Timer reaches zero...
    //   1. Play a second long beep.
    //   2. Start the next timer(session/break)
  }

  function resetTimer() {
    //Pause and reset the beep.
    props.access.resetClock();
    // setMinutesLeft(props.access.state.sessionTime);
    setSessionActive(true);
    setSecondsLeft(0);
    clearInterval(timerRef.current);
    setTimerActive(false);
    setTimerPaused(false);
    props.access.enableButtons();
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
        if(props.access.state.sessionTime < 10) {
            timeLeft += '0' + props.access.state.sessionTime;
        }
        else {
            timeLeft += props.access.state.sessionTime;
        }

        timeLeft += ":00";
    }
    else {
        if(props.access.state.breakTime < 10) {
            timeLeft += '0' + props.access.state.breakTime;
        }
        else {
            timeLeft += props.access.state.breakTime;
        }

        timeLeft += ":00";
    }
  }

  return (
    <div>
        <div id="timer-label">{sessionActive ? "Session" : "Break"}</div>
        <div id="time-left">{timeLeft}</div>
        <div id="control-buttons">
            <button id="start-stop" className="btn" onClick={startStopTimer}>{timerActive ? <FontAwesomeIcon icon={faPause} /> : <FontAwesomeIcon icon={faPlay} />}</button>
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
