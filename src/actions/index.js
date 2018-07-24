export const MOVE_NUMBERS = 'MOVE_NUMBERS';
export const ADD_NUMBER = 'ADD_NUMBER';
export const CLEAR_NUMBERS = 'CLEAR_NUMBERS';

export function moveNumbers(direction) {
    const action = {
        type: MOVE_NUMBERS,
        direction
    };
    return action;
}

export function addNumber(num) {
    const action = {
        type: ADD_NUMBER,
        num
    };
    return action;
}

export function clearNumbers() {
    const action = {
        type: CLEAR_NUMBERS
    };
    return action;
}