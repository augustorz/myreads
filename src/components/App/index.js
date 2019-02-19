import React from 'react';
import { Route } from 'react-router-dom';
import './index.css';

import BookList from '../../pages/BookList';
import BookSearch from '../../pages/BookSearch';

const App = () => (
  <div className="app">
    <Route exact path="/" component={BookList} />
    <Route path="/search" component={BookSearch} />
  </div>
);

export default App;
