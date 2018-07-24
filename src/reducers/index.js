import { combineReducers } from 'redux';
import numbers from './numbers_reducer';

const rootReducer = combineReducers({
    numbers
});

export default rootReducer;