import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from "redux";
import { MapStateToProps, MapDispatchToProps } from "react-redux";

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
    session: sessionReducer,
    break: breakReducer,
    button: buttonReducer
});


//Redux Store
export const store = configureStore({
    reducer: rootReducer
})


export const MapStateToProps = (state) => {
    return ({
      state: state
    });
}

export const MapDispatchToProps = (dispatch) => {
    return ({
        incrementSessionTimer: () => {
            dispatch(sessInc);
        },

        decrementSessionTimer: () => {
            dispatch(sessDec);
        },

        incrementBreakTimer: () => {
            dispatch(breakInc);
        },

        decrementBreakTimer: () => {
            dispatch(breakDec);
        },

        enableButtons: () => {
            dispatch(buttonEn);
        },

        disableButtons: () => {
            dispatch(buttonDe);
        }
    });
}
