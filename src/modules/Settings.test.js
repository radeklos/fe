import React from 'react';
import {shallow} from 'enzyme';
import {expect} from 'chai';

import {DepartmentTable, Department, AddNewDepartment} from './Settings';


describe('<DepartmentTable />', function() {

    it('render department table', () => {
        const wrapper = shallow(<DepartmentTable />);
        wrapper.setState({departments: [{name: 'HR', boss: {label: 'Boss name'}, daysOff: 27}]});

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
