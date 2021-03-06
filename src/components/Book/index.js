import React from 'react';
import PropTypes from 'prop-types';
import './index.css';

import BookSelect from '../BookSelect';

const Book = ({ book, onChangeBookShelf }) => (
  <div className="book">
    <div className="book-top">
      <div
        className="book-cover"
        style={{
          width: 128,
          height: 193,
          backgroundImage: `url("${book.imageLinks && book.imageLinks.thumbnail}")`,
        }}
      />
      <BookSelect book={book} onChangeBookShelf={onChangeBookShelf} />
    </div>
    <div className="book-title">{book.title}</div>
    <div className="book-authors">
      {book.authors ? book.authors.join(', ') : ''}
    </div>
  </div>
);

Book.propTypes = {
  book: PropTypes.shape({
    imageLinks: PropTypes.shape({
      thumbnail: PropTypes.string,
    }),
    title: PropTypes.string.isRequired,
    authors: PropTypes.instanceOf(Array),
  }),
  onChangeBookShelf: PropTypes.func.isRequired,
};

Book.defaultProps = {
  book: {
    imageLinks: {
      thumbnail: '',
    },
    authors: [],
  },
};

export default Book;
