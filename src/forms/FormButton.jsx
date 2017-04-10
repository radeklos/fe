import React from "react";
import {Button} from "react-bootstrap";


export default class FormButton extends React.Component {

    render() {
        return (
            <Button
                bsStyle="primary"
                type="submit"
                disabled={ this.props.isLoading }>{ this.props.children }</Button>
        )
    }

}
