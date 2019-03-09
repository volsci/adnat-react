import React from 'react';
import { shallow, mount } from 'enzyme';
import SignUp from "../src/components/SignUp";
import TextField from "@material-ui/core/TextField/TextField";
import Button from '@material-ui/core/Button';

describe('SignUp', () => {
  it('renders', () => {
    const wrapper = shallow(<SignUp />);

    expect(wrapper.exists()).toBe(true);
  });

  it('matches snapshot', () => {
    const wrapper = shallow(<SignUp />);

    expect(wrapper).toMatchSnapshot();
  });

  it('shows the email, password, name and password confirmation fields', () => {
    const wrapper = mount(<SignUp />);

    expect(wrapper.find(TextField).length).toEqual(4);
  });

  it('shows the sign up and back', () => {
    const wrapper = mount(<SignUp />);

    expect(wrapper.find(Button).length).toEqual(2);
  });
});