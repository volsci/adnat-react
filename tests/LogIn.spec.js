import React from 'react';
import { shallow, mount, render } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import LogIn from "../src/components/LogIn";
import TextField from "@material-ui/core/TextField/TextField";
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch/Switch';

describe('LogIn', () => {
  it('renders', () => {
    const wrapper = shallow(
      <Router>
        <LogIn />
      </Router>);

    expect(wrapper.exists()).toBe(true);
  });

  it('matches snapshot', () => {
    const wrapper = render(
      <Router>
        <LogIn />
      </Router>);
    expect(wrapper).toMatchSnapshot();
  });

  it('shows the email and password fields', () => {
    const wrapper = mount(
      <Router>
        <LogIn />
      </Router>);
    expect(wrapper.find(TextField).length).toEqual(2);
  });

  it('shows the forgot password, login and signup buttons', () => {
    const wrapper = mount(
      <Router>
        <LogIn />
      </Router>);

    expect(wrapper.find(Button).length).toEqual(3);
  });

  it('shows the remember me switch', () => {
    const wrapper = mount(
      <Router>
        <LogIn />
      </Router>);
    expect(wrapper.find(Switch).length).toEqual(1);
  });
});