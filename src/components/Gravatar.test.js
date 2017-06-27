import React from 'react';
import {shallow} from 'enzyme';
import {expect} from 'chai';

import {Gravatar} from './Gravatar';


describe('<Gravatar />', function() {

    it('has rigth props', () => {
        const wrapper = shallow(<Gravatar email='example@example.com' />);

        expect(wrapper.prop('circle')).to.equal(true)
        expect(wrapper.prop('src')).to.equal('https://www.gravatar.com/avatar/23463b99b62a72f26ed677cc556c44e8?s=50&d=mm')
        expect(wrapper.prop('width')).to.equal('50')
        expect(wrapper.prop('width')).to.equal('50')
    });

});
