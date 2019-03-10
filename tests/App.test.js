import React from 'react';
import { render, shallow } from "enzyme";

import App from '../src/components/App';

describe('App', () => {
  it('renders', () => {
    const wrapper = shallow(<App/>);

    expect(wrapper.exists()).toBe(true);
  });

  it('matches snapshot', () => {
    const wrapper = render(<App />);

    expect(wrapper).toMatchSnapshot();
  });
});