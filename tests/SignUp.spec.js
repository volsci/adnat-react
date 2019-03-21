import React from 'react';
import { shallow, mount, render } from 'enzyme';
import SignUp from "../src/components/SignUp";
import { BrowserRouter as Router } from 'react-router-dom';
import TextField from "@material-ui/core/TextField/TextField";
import Button from '@material-ui/core/Button';

describe('SignUp', () => {
  it('renders', () => {
    const wrapper = shallow(
      <Router>
        <SignUp />
      </Router>);

    expect(wrapper.exists()).toBe(true);
  });

  it('matches snapshot', () => {
    const wrapper = render(
      <Router>
        <SignUp />
      </Router>);

    expect(wrapper).toMatchSnapshot();
  });

  it('shows the email, password, name and password confirmation fields', () => {
    const wrapper = mount(
      <Router>
        <SignUp />
      </Router>);

    expect(wrapper.find(TextField).length).toEqual(4);
  });

  it('shows the sign up and back buttons', () => {
    const wrapper = mount(
      <Router>
        <SignUp />
      </Router>);

    expect(wrapper.find(Button).length).toEqual(2);
  });
});