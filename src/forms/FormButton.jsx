import React from "react";
import {Button} from "react-bootstrap";


export default class FormButton extends React.Component {

    render() {
        const {bsStyle} = this.props;
        return (
            <Button
                bsStyle={ bsStyle }
                type="submit"
                disabled={ this.props.isLoading }>{ this.props.children }</Button>
        )
    }

}
