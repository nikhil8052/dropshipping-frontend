import * as types from '../actions/actionTypes';

export const initialMMState = {
    searchQuery: '',
    loiId: '',
    spaId: '',
    openChallenges: [],
    notifications: [],
    fullScreen: false
};
const initialMMState2 = {
    searchQuery: '',
    loiId: '',
    openChallenges: [],
    notifications: [],
    fullScreen: false
};

export const rootReducer = (state = initialMMState, action) => {
    switch (action.type) {
        case types.ALL_RECORDS:
            return { ...state, [action.data.keyOfData]: action.data.data };
        case types.ALL_SEARCH_QUERY:
            return { ...state, searchQuery: action.data };
        case types.SAVE_A_NEW_NOTIFICATION:
            return { ...state, notifications: [...state.notifications, action.data] };
        case types.SAVE_LOI_ID:
            return { ...state, loiId: action.data };
        case types.REMOVE_KEY:
            return action.data.data;
        case types.CREATE_INITIAL:
            return action.data.data;
        case types.FULL_SCREEN:
            return { ...state, fullScreen: action.data };
        case types.LOGOUT:
            return { ...initialMMState2 };
        default:
            return state;
    }
};
