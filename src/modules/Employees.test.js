import React from 'react';
import {shallow, mount} from 'enzyme';
import {expect} from 'chai';
import {MenuItem, SplitButton, Table, Media, Badge, Pager, Button, Row, Col, Modal, Form, FormGroup, ControlLabel, FormControl, InputGroup, DropdownButton} from "react-bootstrap";

import {Gravatar} from '../components/Gravatar'
import {EmployeesTable, Days, BookTimeOffModal, calculateDays} from './Employees';


describe('<EmployeesTable />', function() {

    it('employee has filled details', () => {
        const emp = {
            employee: {
                uid: 'e60ed66f-dd1d-441a-854c-d6c7ed147a39',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@email.com',
                company: null
            },
            department: {
                uid: 'cdaaa9f2-7478-4794-8296-af7ee7b5fc36',
                label: 'Missing',
                href: 'http://localhost:5000/v1/companies/557a9df8-25c7-4d98-885f-aa18c2d5af11/departments/557a9df8-25c7-4d98-885f-aa18c2d5af11'
            },
            remaining: 20,
            leaves:[]
        }
        const wrapper = shallow(<EmployeesTable
                                    employees={[emp]}
                                    firstDay={new Date(2017, 1, 1)}
                                    lastDay={new Date(2017, 1, 31)} />);

        expect(wrapper.find('.person')).to.have.length(1);

        expect(wrapper.find(Badge).render().text()).to.equal('20');
        expect(wrapper.find(Media.Heading).render().text()).to.equal('John Doe');
        expect(wrapper.find(Media.Body).find('p').render().text()).to.equal('Missing');
    });

    it('table contains all employees', () => {
        const emp1 = {
            employee: {
                email: 'example1@example.com',
                firstName: 'John1',
                lastName: 'Doe2',
                department: 'Missing',
                remaining: 20
            }
        }
        const emp2 = {
            employee: {
                email: 'example2@example.com',
                firstName: 'John2',
                lastName: 'Doe1',
                department: 'Missing',
                remaining: 20
            }
        }
        const wrapper = shallow(<EmployeesTable
                                    employees={[emp1, emp2]}
                                    firstDay={new Date(2017, 1, 1)}
                                    lastDay={new Date(2017, 1, 31)} />);

        expect(wrapper.find(".person")).to.have.length(2);
    });

    it('format remaining float is transformed into fraction', () => {
        const emp = {
            employee: {
                email: 'example@example.com',
                firstName: 'John',
                lastName: 'Doe',
                department: 'Missing',
            },
            remaining: 20.5
        }
        const wrapper = shallow(<EmployeesTable
                                    employees={[emp]}
                                    firstDay={new Date(2017, 1, 1)}
                                    lastDay={new Date(2017, 1, 31)} />);

        expect(wrapper.find(Badge).html()).to.equal('<span class="badge">20 <small>½</small></span>');
    });

    it('when number of remaining days is 0 only fraction is present', () => {
        const emp = {
            employee: {
                email: 'example@example.com',
                firstName: 'John',
                lastName: 'Doe',
                department: 'Missing',
            },
            remaining: 0.5
        }
        const wrapper = shallow(<EmployeesTable
                                    employees={[emp]}
                                    firstDay={new Date(2017, 1, 1)}
                                    lastDay={new Date(2017, 1, 31)} />);

        expect(wrapper.find(Badge).html()).to.equal('<span class="badge"> <small>½</small></span>');
    });

    it('format remaining decimal', () => {
        const emp = {
            employee: {
                email: 'example@example.com',
                firstName: 'John',
                lastName: 'Doe',
                department: 'Missing',
            },
            remaining: 20
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

    it('Highlight only one day', () => {
        const leaves = {
            endingAt: 'PM',
            leaveType: null,
            reason: null,
            starting: '2017-01-02',
            ending: '2017-01-02',
            startingAt: 'AM',
            uid: '61528980-61a9-4353-b049-297900381c59'
        }

        const days = calculateDays(new Date("2017-01-01"), new Date("2017-01-31"));
        const wrapper = shallow(<Days leaves={[leaves]} days={days} />);

        expect(wrapper.find('.time-off').parent().first().text()).to.equal('2');
        expect(wrapper.find('.first.time-off')).to.have.length(1);
        expect(wrapper.find('.second.time-off')).to.have.length(1);
    });

    it('Highlight multiple days', () => {
        const leaves = {
            endingAt: 'PM',
            leaveType: null,
            reason: null,
            starting: '2017-01-02',
            ending: '2017-01-08',
            startingAt: 'AM',
            uid: '61528980-61a9-4353-b049-297900381c59'
        }

        const days = calculateDays(new Date("2017-01-01"), new Date("2017-01-31"));
        const wrapper = shallow(<Days leaves={[leaves]} days={days} />);

        expect(wrapper.find('.first.time-off').parent().map(l => l.text())).to.deep.equal(['2', '3', '4', '5', '6', '7', '8']);
        expect(wrapper.find('.first.time-off')).to.have.length(7);
        expect(wrapper.find('.second.time-off')).to.have.length(7);
    });

    it('Highlight multiple days across multiple months at the beginning', () => {
        const leaves = {
            endingAt: 'PM',
            leaveType: null,
            reason: null,
            starting: '2017-01-28',
            ending: '2017-02-05',
            startingAt: 'AM',
            uid: '61528980-61a9-4353-b049-297900381c59'
        }

        const days = calculateDays(new Date("2017-02-01"), new Date("2017-02-28"));
        const wrapper = shallow(<Days leaves={[leaves]} days={days} />);

        expect(wrapper.find('.first.time-off').parent().map(l => l.text())).to.deep.equal(['1', '2', '3', '4', '5']);
        expect(wrapper.find('.first.time-off')).to.have.length(5);
        expect(wrapper.find('.second.time-off')).to.have.length(5);
    });

    it('Highlight multiple days across multiple months at the end', () => {
        const leaves = {
            endingAt: 'PM',
            leaveType: null,
            reason: null,
            starting: '2017-02-25',
            ending: '2017-03-05',
            startingAt: 'AM',
            uid: '61528980-61a9-4353-b049-297900381c59'
        }

        const days = calculateDays(new Date("2017-02-01"), new Date("2017-02-28"));
        const wrapper = shallow(<Days leaves={[leaves]} days={days} />);

        expect(wrapper.find('.first.time-off').parent().map(l => l.text())).to.deep.equal(['25', '26', '27', '28']);
        expect(wrapper.find('.first.time-off')).to.have.length(4);
        expect(wrapper.find('.second.time-off')).to.have.length(4);
    });

    it('Highlight only second half on PM leave', () => {
        const leaves = {
            leaveType: null,
            reason: null,
            startingAt: 'PM',
            starting: '2017-02-05',
            ending: '2017-02-07',
            endingAt: 'PM',
            uid: '61528980-61a9-4353-b049-297900381c59'
        }

        const days = calculateDays(new Date("2017-02-01"), new Date("2017-02-28"));
        const wrapper = shallow(<Days leaves={[leaves]} days={days} />);

        expect(wrapper.find('.second.time-off').parent().map(l => l.text())).to.deep.equal(['5', '6', '7']);
        expect(wrapper.find('.first.time-off')).to.have.length(2);
        expect(wrapper.find('.second.time-off')).to.have.length(3);
    });

    it('Highlight only first half only for PM return', () => {
        const leaves = {
            leaveType: null,
            reason: null,
            startingAt: 'AM',
            starting: '2017-02-05',
            ending: '2017-02-07',
            endingAt: 'AM',
            uid: '61528980-61a9-4353-b049-297900381c59'
        }

        const days = calculateDays(new Date("2017-02-01"), new Date("2017-02-28"));
        const wrapper = shallow(<Days leaves={[leaves]} days={days} />);

        expect(wrapper.find('.first.time-off').parent().map(l => l.text())).to.deep.equal(['5', '6', '7']);
        expect(wrapper.find('.first.time-off')).to.have.length(3);
        expect(wrapper.find('.second.time-off')).to.have.length(2);
    });

});
