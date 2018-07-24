import React, {Component} from 'react';

class Number extends Component {
    render() {
        let classes = `number num-${this.props.number} position-${this.props.x}-${this.props.y}`;
        if (this.props.deleted) classes += ' deleted';
        return (
            <div className={ classes }>
                <div className="value">
                    { this.props.number }
                </div>
            </div>
        );
    }
}


export default Number;
