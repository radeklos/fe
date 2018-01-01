import React from 'react';
import {shallow, mount} from 'enzyme';
import {expect} from 'chai';

import {DepartmentTable, Department, AddNewDepartment, ChangePasswordForm} from './Settings';
import Setup from './../setup';


describe('<DepartmentTable />', function() {

    it('render department table', () => {
        const wrapper = shallow(
            <DepartmentTable departments={[{name: 'HR', boss: {label: 'Boss name'}, daysOff: 27}]} />
        );

        expect(wrapper.html()).to.contains('<td>HR</td>');
        expect(wrapper.html()).to.contains('<td>Boss name</td>');
        expect(wrapper.html()).to.contains('<td>27</td>');
    });

});

describe('<AddNewDepartment />', function() {

    it('has button with label add new', () => {
        const wrapper = shallow(<AddNewDepartment employees={[]} />);

        expect(wrapper.find('.pull-right').render().text()).to.contains('Add new');
    });

    it('when add new button is clicked modal is present', () => {
        const wrapper = shallow(<AddNewDepartment employees={[]} />);

        wrapper.find('.pull-right').simulate('click');
        expect(wrapper.state('show')).to.equals(true);
    });

});

describe('<ChangePasswordForm />', function() {

    it('password must be same', () => {
        const wrapper = mount(<ChangePasswordForm employees={[]} />);

        wrapper.find('input#password').simulate('change', {target: {name: 'password', value: 'password1'}});
        wrapper.find('input#retryPassword').simulate('change', {target: {name: 'retryPassword', value: 'password2'}});
        wrapper.find('form').simulate('submit');

        expect(wrapper.state('formData')['password']).to.equals('password1');
        expect(wrapper.state('formData')['retryPassword']).to.equals('password2');

        expect(wrapper.html()).to.contains('Passwords do not match');
    });

});
