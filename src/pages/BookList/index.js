import React from 'react';
import { Link } from 'react-router-dom';
import { instanceOf, shape, func } from 'prop-types';
import { SHELVES } from './constants';
import './index.css';

import BookShelf from '../../components/BookShelf';

const BookList = ({ shelves, onChangeBookShelf }) => (
  <div className="list-books">
    <div className="list-books-title">
      <h1>MyReads</h1>
    </div>
    <div className="list-books-content">
      {SHELVES.map(({ title, key }) => (
        <BookShelf
          key={key}
          title={title}
          books={shelves[key]}
          onChangeBookShelf={onChangeBookShelf}
        />
      ))}
    </div>
    <div className="open-search">
      <Link to="/search">
        <button type="button">Add a book</button>
      </Link>
    </div>
  </div>
);

BookList.propTypes = {
  shelves: shape({
    currentlyReading: instanceOf(Array),
    wantToRead: instanceOf(Array),
    read: instanceOf(Array),
  }).isRequired,
  onChangeBookShelf: func.isRequired,
};

export default BookList;
