import React from 'react';
import {shallow} from 'enzyme';
import {expect} from 'chai';
import {MenuItem, SplitButton, Table, Media, Badge, Pager, Button, Row, Col, Modal, Form, FormGroup, ControlLabel, FormControl, InputGroup, DropdownButton} from "react-bootstrap";

import {Gravatar} from '../components/Gravatar'
import {EmployeesTable, Days} from './Employees';


describe('<EmployeesTable />', function() {

    it('employee has filled details', () => {
        const emp = {
            email: 'example@example.com',
            firstName: 'John',
            lastName: 'Doe',
            department: 'Missing',
            remaining: 20,
        }
        const wrapper = shallow(<EmployeesTable
                                    employees={[emp]}
                                    firstDay={new Date(2017, 1, 1)}
                                    lastDay={new Date(2017, 1, 31)} />);

        expect(wrapper.find(".person")).to.have.length(1);

        expect(wrapper.find(Badge).render().text()).to.equal('20');
        expect(wrapper.find(Media.Heading).render().text()).to.equal('John Doe');
        expect(wrapper.find(Media.Body).find('p').render().text()).to.equal('Missing');
    });

    it('table contains all employees', () => {
        const emp1 = {
            email: 'example1@example.com',
            firstName: 'John1',
            lastName: 'Doe2',
            department: 'Missing',
            remaining: 20,
        }
        const emp2 = {
            email: 'example2@example.com',
            firstName: 'John2',
            lastName: 'Doe1',
            department: 'Missing',
            remaining: 20,
        }
        const wrapper = shallow(<EmployeesTable
                                    employees={[emp1, emp2]}
                                    firstDay={new Date(2017, 1, 1)}
                                    lastDay={new Date(2017, 1, 31)} />);

        expect(wrapper.find(".person")).to.have.length(2);
    });

    it('format remaining float is transformed into fraction', () => {
        const emp = {
            email: 'example@example.com',
            firstName: 'John',
            lastName: 'Doe',
            department: 'Missing',
            remaining: 20.5,
        }
        const wrapper = shallow(<EmployeesTable
                                    employees={[emp]}
                                    firstDay={new Date(2017, 1, 1)}
                                    lastDay={new Date(2017, 1, 31)} />);

        expect(wrapper.find(Badge).html()).to.equal('<span class="badge">20<small>½</small></span>');
    });

    it('format remaining decimal', () => {
        const emp = {
            email: 'example@example.com',
            firstName: 'John',
            lastName: 'Doe',
            department: 'Missing',
            remaining: 20,
        }
        const wrapper = shallow(<EmployeesTable
                                    employees={[emp]}
                                    firstDay={new Date(2017, 1, 1)}
                                    lastDay={new Date(2017, 1, 31)} />);

        expect(wrapper.find(Badge).html()).to.equal('<span class="badge">20</span>');
    });

});

describe('<Days />', function() {

    it('Days has always 31 items - one passed', () => {
        const wrapper = shallow(<Days days={[new Date(2017, 1, 1)]} />);
        expect(wrapper.find('td')).to.have.length(31)
    });

    it('Days has always 31 items - 60 passed', () => {
        const days = new Array(60).fill().map(u => new Date(2017, 1, 1));

        const wrapper = shallow(<Days days={days} />);
        expect(wrapper.find('td')).to.have.length(31)
    });

    it('Monday is marked as weekday', () => {
        const wrapper = shallow(<Days days={[new Date(2017, 6, 3)]} />);
        expect(wrapper.find('td').first().prop('className')).to.have.equal('nwd day')
    });

    it('Tuesday is marked as weekday', () => {
        const wrapper = shallow(<Days days={[new Date(2017, 6, 4)]} />);
        expect(wrapper.find('td').first().prop('className')).to.have.equal('nwd day')
    });

    it('Wednesday is marked as weekday', () => {
        const wrapper = shallow(<Days days={[new Date(2017, 6, 5)]} />);
        expect(wrapper.find('td').first().prop('className')).to.have.equal('nwd day')
    });

    it('Thursday is marked as weekday', () => {
        const wrapper = shallow(<Days days={[new Date(2017, 6, 6)]} />);
        expect(wrapper.find('td').first().prop('className')).to.have.equal('nwd day')
    });

    it('Friday is marked as weekday', () => {
        const wrapper = shallow(<Days days={[new Date(2017, 6, 7)]} />);
        expect(wrapper.find('td').first().prop('className')).to.have.equal('nwd day')
    });

    it('Saturday is marked as weekend', () => {
        const wrapper = shallow(<Days days={[new Date(2017, 6, 8)]} />);
        expect(wrapper.find('td').first().prop('className')).to.have.equal('wd day')
    });

    it('Sunday is marked as weekend', () => {
        const wrapper = shallow(<Days days={[new Date(2017, 6, 9)]} />);
        expect(wrapper.find('td').first().prop('className')).to.have.equal('wd day')
    });

});
