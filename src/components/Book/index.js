import React from 'react';
import PropTypes from 'prop-types';

import BookSelect from '../BookSelect';

const Book = ({ book, onChangeBookShelf }) => (
  <li>
    <div className="book">
      <div className="book-top">
        <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url("${book.imageLinks && book.imageLinks.thumbnail}")` }} />
        <BookSelect book={book} onChangeBookShelf={onChangeBookShelf} />
      </div>
      <div className="book-title">{book.title}</div>
      {book.authors && book.authors.map(author => (
        <div className="book-authors" key={author}>{author}</div>
      ))}
    </div>
  </li>
);

Book.propTypes = {
  book: PropTypes.instanceOf(Object).isRequired,
  onChangeBookShelf: PropTypes.func.isRequired,
};

export default Book;
