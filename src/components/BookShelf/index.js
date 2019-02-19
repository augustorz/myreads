import React from 'react';
import PropTypes from 'prop-types';

import Book from '../Book';

const BookShelf = ({ title, books, onChangeBookShelf }) => (
  <div className="bookshelf">
    <h2 className="bookshelf-title">{title}</h2>
    <div className="bookshelf-books">
      <ol className="books-grid">
        {books.map(book => (
          <Book key={book.id} book={book} onChangeBookShelf={onChangeBookShelf} />
        ))}
      </ol>
    </div>
  </div>
);

BookShelf.propTypes = {
  title: PropTypes.string.isRequired,
  books: PropTypes.instanceOf(Array),
  onChangeBookShelf: PropTypes.func.isRequired,
};

BookShelf.defaultProps = {
  books: [],
};

export default BookShelf;
