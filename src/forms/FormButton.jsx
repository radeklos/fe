import React from "react";
import {Button} from "react-bootstrap";


export default class FormButton extends React.Component {

    render() {
        const {bsStyle, isLoading} = this.props;
        return (
            <Button
                bsStyle={ bsStyle }
                type="submit"
                disabled={ isLoading }>{ this.props.children }</Button>
        )
    }

}
