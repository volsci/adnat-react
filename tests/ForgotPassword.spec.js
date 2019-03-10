import React from 'react';
import { shallow, mount, render } from 'enzyme';
import ForgotPassword from "../src/components/ForgotPassword";
import TextField from "@material-ui/core/TextField/TextField";
import Button from '@material-ui/core/Button';
import { BrowserRouter as Router } from 'react-router-dom';

describe('SignUp', () => {
  it('renders', () => {
    const wrapper = shallow(
      <Router>
        <ForgotPassword />
      </Router>);

    expect(wrapper.exists()).toBe(true);
  });

  it('matches snapshot', () => {
    const wrapper = render(
      <Router>
        <ForgotPassword />
      </Router>);

    expect(wrapper).toMatchSnapshot();
  });

  it('shows the email field', () => {
    const wrapper = mount(
      <Router>
        <ForgotPassword />
      </Router>);

    expect(wrapper.find(TextField).length).toEqual(1);
  });

  it('shows the send reset link and back buttons', () => {
    const wrapper = mount(
      <Router>
        <ForgotPassword />
      </Router>);

    expect(wrapper.find(Button).length).toEqual(2);
  });
});