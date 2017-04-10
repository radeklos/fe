import React from "react";

import CompanyForm from "../forms/CompanyForm.jsx";


export const U = React.createClass({

    render: function () {
        if (this.props.user === undefined) {
            return (
                <div>
                    <h1>Join us</h1>
                </div>
            )
        } else {
            return (
                <div>
                    { this.props.user.isInCompany() ? <EmployeeList /> : <CreateCompany /> }
                </div>
            )
        }
    }
});

export const CreateCompany = React.createClass({

    getInitialState: function () {
        return {};
    },

    render: function () {
        return (
            <div>
                <h1 className="display-1">Hello stranger</h1>

                <p className="lead">
                    It seems that you just created your account. Please set up your company before you invite your
                    employee.
                </p>

                <CompanyForm />

            </div>
        )
    }
});

export const EmployeeList = React.createClass({

    getInitialState: function () {
        return {};
    },

    render: function () {
        return (<div>
            <h1>{"Look who's working here"}</h1>
        </div>)
    }
});
