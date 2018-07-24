import React, { Component } from 'react';
import '../App.css';
import Number from "./Number";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addNumber, moveNumbers, clearNumbers } from '../actions/index';
import Result from "./Result";

class App extends Component {
    moving = false;
    end_game = false;
    constructor(props) {
        super(props);
        document.onkeydown = this.checkKey.bind(this);
    }
    checkKey(e) {
        e = e || window.event;
        if (this.end_game) return;
        if (e.keyCode === 38) this.move('up');
        else if (e.keyCode === 40) this.move('down');
        else if (e.keyCode === 37) this.move('left');
        else if (e.keyCode === 39) this.move('right');
    }
    componentDidMount() {
        this.startGame();
    }
    move(direction) {
        if (this.moving) return;
        this.moving = true;
        this.props.moveNumbers(direction);
        let score = this.getBiggestNumber();
        if (this.getPossibilities() > 0 && this.getVisibleNumbers() >= 4) {
            this.end_game = <Result result={'lose'} score={score} onValidate={this.startGame.bind(this)}/>;
        }

        if (score === 2048) {
            this.end_game = <Result result={'win'} score={score} onValidate={this.startGame}/>;
        }
        if (this.getPossibilities() === 0 && this.getVisibleNumbers() >= 16) {
            console.log('lose');

        }
        setTimeout(() => {
            if (this.props.numbers.has_moved) {
                this.props.addNumber(2);
            }
            this.moving = false;
        }, 200);
    }
    getBiggestNumber() {
        let biggest = 2;
        for (let num of Object.keys(this.props.numbers)) {
            if (this.props.numbers[num].number > biggest) biggest = this.props.numbers[num].number;
        }
        return biggest;
    }
    getVisibleNumbers() {
        let visible_numbers = 0;
        for (let num of Object.keys(this.props.numbers)) {
            if (num !== 'has_moved' && !this.props.numbers[num].deleted) visible_numbers++;
        }
        return visible_numbers;
    }
    getPossibilities() {
        let nb_possibilities = 0;
        for (let number_id of Object.keys(this.props.numbers)) {
            if(number_id === 'has_moved') continue;
            let number = this.props.numbers[number_id];
            for (let other_number_id of Object.keys(this.props.numbers)) {
                let other_number = this.props.numbers[other_number_id];
                if(number.number === other_number.number && !number.deleted && !other_number.deleted && (
                    (number.x === other_number.x + 1 && number.y === other_number.y) ||
                    (number.x === other_number.x - 1 && number.y === other_number.y) ||
                    (number.y === other_number.y + 1 && number.x === other_number.x) ||
                    (number.y === other_number.y - 1 && number.x === other_number.x)
                )) {
                    nb_possibilities++;
                }
            }
        }
        return nb_possibilities;
    }
    startGame() {
        this.end_game = null;
        this.props.clearNumbers();
        setTimeout(() => {
            this.props.addNumber(2);
            this.props.addNumber(2);
        }, 200);
    }
    render() {
        let number_list = Object.keys(this.props.numbers).map((key) => {
            if (key === 'has_moved') return;
            return <Number
                key={key}
                number={this.props.numbers[key].number}
                x={this.props.numbers[key].x}
                y={this.props.numbers[key].y}
                deleted={this.props.numbers[key].deleted}
                merged={this.props.numbers[key].merged}
            />
        });
        return (
            <div className="App">
                <h1>2048</h1>
                <div className="grid">
                    {number_list}
                    {[...Array(16)].map((x, i) =>
                        <div className="case" key={i}></div>
                    )}
                    {this.end_game}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        numbers: state.numbers
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ addNumber, moveNumbers, clearNumbers }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
