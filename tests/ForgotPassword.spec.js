import React from 'react';
import { shallow, mount, render } from 'enzyme';
import ForgotPassword from "../src/components/ForgotPassword";
import TextField from "@material-ui/core/TextField/TextField";
import Button from '@material-ui/core/Button';

describe('SignUp', () => {
  it('renders', () => {
    const wrapper = shallow(<ForgotPassword />);

    expect(wrapper.exists()).toBe(true);
  });

  it('matches snapshot', () => {
    const wrapper = render(<ForgotPassword />);

    expect(wrapper).toMatchSnapshot();
  });

  it('shows the email field', () => {
    const wrapper = mount(<ForgotPassword />);

    expect(wrapper.find(TextField).length).toEqual(1);
  });

  it('shows the send reset link and back buttons', () => {
    const wrapper = mount(<ForgotPassword />);

    expect(wrapper.find(Button).length).toEqual(2);
  });
});