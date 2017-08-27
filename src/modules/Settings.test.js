import React from 'react';
import {shallow} from 'enzyme';
import {expect} from 'chai';

import {DepartmentTable} from './Settings';


describe('<DepartmentTable />', function() {

    it('render department table', () => {
        const wrapper = shallow(<DepartmentTable />);
        wrapper.setState({departments: [{name: 'HR', boss: {label: 'Boss name'}, daysOff: 27}]});

        expect(wrapper.html()).to.contains('<td>HR</td>');
        expect(wrapper.html()).to.contains('<td>Boss name</td>');
        expect(wrapper.html()).to.contains('<td>27</td>');
    });

});

