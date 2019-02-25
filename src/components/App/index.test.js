import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { shallow } from 'enzyme';
import App from '.';

describe('App', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    );
  });

  it('should match snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('componentDidMount', () => {
    
  });
});
