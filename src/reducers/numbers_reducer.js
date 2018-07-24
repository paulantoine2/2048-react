import {ADD_NUMBER, CLEAR_NUMBERS, MOVE_NUMBERS} from "../actions";

let grid = [],
    num_id = 0,
    free_pos = [];

function numbers(state = { has_moved: false }, action) {
    let numbers = {};
    switch(action.type) {
        case ADD_NUMBER:
            // Generate a new number to a free position
            const pos = free_pos[Math.floor(Math.random() * free_pos.length)];
            const y = Math.ceil((pos / 4) - 1);
            const x = Math.abs((pos - 4 * y) - 1);
            num_id++;
            const number = { number: action.num, x, y, pos };
            // Place the number on the grid
            let index = free_pos.indexOf(pos);
            if (index !== -1) free_pos.splice(index, 1);
            numbers[num_id] = number;
            grid[number.y][number.x] = num_id;
            return Object.assign({}, state, numbers);
        case MOVE_NUMBERS:
            let new_nums = Object.assign({}, state, numbers);
            new_nums.has_moved = false;
            let to_delete = [];
            Object.keys(new_nums).forEach((number) => {
                if (new_nums[number].deleted) to_delete.push(number)
            });
            for (let n of to_delete) {
                delete new_nums[n];
            }
            if(action.direction === 'left') {
                for (let y = 0 ; y <= 3 ; y++) {
                    // Last_num is the last number processed in the row/column
                    let last_num = null;
                    // If left, process each case from left to right, if up, from up to bottom, etc...
                    for (let x = 0 ; x <= 3 ; x++) {
                        // Get the number ID in the processed case
                        let num = grid[y][x];
                        // Do nothing if case is empty
                        if (num === null) continue;
                        // Get the number of the processed case
                        let this_num = new_nums[num];
                        // Do not move if the number is next to the edge or a different number
                        if (x === 0 ||
                            (last_num !== null && last_num.x === x - 1 && last_num.number !== this_num.number)) {
                            // Set actual number as last number
                            last_num = new_nums[num];
                            last_num.id = num;
                            last_num.merged = false;
                            continue;
                        }
                        // From here, the number will be moved in all cases
                        new_nums.has_moved = true;
                        // Move the number to the edge if the case is empty
                        if (!last_num && x > 0) {
                            new_nums[num].x = 0;
                            // Refresh grid data
                            grid[y][x] = null;
                            grid[y][0] = num;
                            // Set actual number as last number
                            last_num = new_nums[num];
                            last_num.id = num;
                            last_num.merged = false;
                            continue;
                        }
                        // Move the number next to the last number if it is different
                        if (last_num.number !== this_num.number || last_num.merged) {
                            new_nums[num].x = last_num.x + 1;
                            // Refresh grid data
                            grid[y][x] = null;
                            grid[y][last_num.x + 1] = num;
                            // Set actual number as last number
                            last_num = new_nums[num];
                            last_num.id = num;
                            last_num.merged = false;
                            continue;
                        }
                        // Merge the number with the last number
                        new_nums[num].x = last_num.x;
                        // Refresh grid data
                        grid[y][x] = null;
                        grid[y][last_num.x] = num;
                        // Delete the last number and increase the value of the actual number
                        new_nums[num].number = new_nums[num].number * 2;
                        new_nums[last_num.id].deleted = true;
                        // Set actual number as last number
                        last_num = new_nums[num];
                        last_num.id = num;
                        last_num.merged = true;
                    }
                }
            } else if(action.direction === 'right') {
                for (let y = 0 ; y <= 3 ; y++) {
                    let last_num = null;
                    for (let x = 3 ; x >= 0 ; x--) {
                        let num = grid[y][x];
                        if (num === null) continue;
                        let this_num = new_nums[num];
                        if (x === 3 ||
                            (last_num !== null && last_num.x === x + 1 && last_num.number !== this_num.number)) {
                            last_num = new_nums[num];
                            last_num.id = num;
                            last_num.merged = false;
                            continue;
                        }
                        new_nums.has_moved = true;
                        if (!last_num && x < 3) {
                            new_nums[num].x = 3;
                            grid[y][x] = null;
                            grid[y][3] = num;
                            last_num = new_nums[num];
                            last_num.id = num;
                            last_num.merged = false;
                            continue;
                        }
                        if (last_num.number !== this_num.number || last_num.merged) {
                            new_nums[num].x = last_num.x - 1;
                            grid[y][x] = null;
                            grid[y][last_num.x - 1] = num;
                            last_num = new_nums[num];
                            last_num.id = num;
                            last_num.merged = false;
                            continue;
                        }
                        new_nums[num].x = last_num.x;
                        grid[y][x] = null;
                        grid[y][last_num.x] = num;
                        new_nums[num].number = new_nums[num].number * 2;
                        new_nums[last_num.id].deleted = true;
                        last_num = new_nums[num];
                        last_num.id = num;
                        last_num.merged = true;
                    }
                }
            } else if(action.direction === 'down') {
                for (let x = 0 ; x <= 3 ; x++) {
                    let last_num = null;
                    for (let y = 3 ; y >= 0 ; y--) {
                        let num = grid[y][x];
                        if (num === null) continue;
                        let this_num = new_nums[num];
                        if (y === 3 ||
                            (last_num !== null && last_num.y === y + 1 && last_num.number !== this_num.number)) {
                            last_num = new_nums[num];
                            last_num.id = num;
                            last_num.merged = false;
                            continue;
                        }
                        new_nums.has_moved = true;
                        if (!last_num && y < 3) {
                            new_nums[num].y = 3;
                            grid[y][x] = null;
                            grid[3][x] = num;
                            last_num = new_nums[num];
                            last_num.id = num;
                            last_num.merged = false;
                            continue;
                        }
                        if (last_num.number !== this_num.number || last_num.merged) {
                            new_nums[num].y = last_num.y - 1;
                            grid[y][x] = null;
                            grid[last_num.y - 1][x] = num;
                            last_num = new_nums[num];
                            last_num.id = num;
                            last_num.merged = false;
                            continue;
                        }
                        new_nums[num].y = last_num.y;
                        grid[y][x] = null;
                        grid[last_num.y][x] = num;
                        new_nums[num].number = new_nums[num].number * 2;
                        new_nums[last_num.id].deleted = true;
                        last_num = new_nums[num];
                        last_num.id = num;
                        last_num.merged = true;
                    }
                }
            } else if(action.direction === 'up') {
                for (let x = 0; x <= 3; x++) {
                    let last_num = null;
                    for (let y = 0; y <= 3; y++) {
                        let num = grid[y][x];
                        if (num === null) continue;
                        let this_num = new_nums[num];
                        if (y === 0 ||
                            (last_num !== null && last_num.y === y - 1 && last_num.number !== this_num.number)) {
                            last_num = new_nums[num];
                            last_num.id = num;
                            last_num.merged = false;
                            continue;
                        }
                        new_nums.has_moved = true;
                        if (!last_num && y > 0) {
                            new_nums[num].y = 0;
                            grid[y][x] = null;
                            grid[0][x] = num;
                            last_num = new_nums[num];
                            last_num.id = num;
                            last_num.merged = false;
                            continue;
                        }
                        if (last_num.number !== this_num.number || last_num.merged) {
                            new_nums[num].y = last_num.y + 1;
                            grid[y][x] = null;
                            grid[last_num.y + 1][x] = num;
                            last_num = new_nums[num];
                            last_num.id = num;
                            last_num.merged = false;
                            continue;
                        }
                        new_nums[num].y = last_num.y;
                        grid[y][x] = null;
                        grid[last_num.y][x] = num;
                        new_nums[num].number = new_nums[num].number * 2;
                        new_nums[last_num.id].deleted = true;
                        last_num = new_nums[num];
                        last_num.id = num;
                        last_num.merged = true;
                    }
                }
            }
            let tmp_free_pos = [];
            for (let y in grid) {
                for (let x in grid[y]) {
                    if (grid[y][x] === null) {
                        let pos = Math.round(y * 4) + parseInt(x, 0) + 1;
                        tmp_free_pos.push(pos);
                    }
                }
            }
            free_pos = tmp_free_pos;
            return new_nums;
        case CLEAR_NUMBERS:
            grid = [
                [null, null, null, null],
                [null, null, null, null],
                [null, null, null, null],
                [null, null, null, null],
            ];
            num_id = 0;
            free_pos = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];
            return Object.assign({}, numbers);
        default:
            return state;
    }
}

export default numbers;