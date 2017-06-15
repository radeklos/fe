import React from "react";

import {Image} from "react-bootstrap";
import md5 from "md5";

export class Gravatar extends React.Component {

    render () {
        let hash = md5(this.props.email);
        let url = 'https://www.gravatar.com/avatar/' + hash + '?s=50&d=mm';

        return (
            <Image src={url} circle width="50" height="50" />
        )
    }

}
