import React from 'react'
import {
  Col,
  FormGroup,
  Button,
} from 'react-bootstrap';


export default class FormButton extends React.Component {

  render() {
    return (
      <FormGroup>
        <Col smOffset={2} sm={8}>
          <Button type="submit">{ this.props.children }</Button>
        </Col>
      </FormGroup>
    )
  }

}
