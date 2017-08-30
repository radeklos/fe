import React from "react";
import {Alert} from "react-bootstrap";


export class Toast extends React.Component {

    render() {
        if (!this.props.show) {
            return (null)
        }
        return (
            <div className="toast">
                <Alert bsStyle={ this.props.style }>{ this.props.text }</Alert>
            </div>
        )
    }

}
