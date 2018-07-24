import React, { Component } from 'react';

class Result extends Component {

    render() {
        return (
            <div className="Result">
                <h2>You {this.props.result} !</h2>
                <h3>Your score : {this.props.score}</h3>
                <button onClick={this.props.onValidate}>Retry</button>
            </div>
        );
    }

}

export default Result;