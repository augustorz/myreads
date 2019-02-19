import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import BookShelf from '../../components/BookShelf';

const SHELVES = [
  { title: 'Current Reading', key: 'currentlyReading' },
  { title: 'Want to Read', key: 'wantToRead' },
  { title: 'Read', key: 'read' },
];

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
  shelves: PropTypes.instanceOf(Object).isRequired,
  onChangeBookShelf: PropTypes.func.isRequired,
};

export default BookList;
