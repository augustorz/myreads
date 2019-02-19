import React from 'react';
import PropTypes from 'prop-types';

const BookSelect = ({ book, onChangeBookShelf }) => (
  <div className="book-shelf-changer">
    <select
      value={book.shelf}
      onChange={(event) => { onChangeBookShelf({ book, newShelf: event.target.value }); }}
    >
      <option value="move" disabled>Move to...</option>
      <option value="currentlyReading">Currently Reading</option>
      <option value="wantToRead">Want to Read</option>
      <option value="read">Read</option>
      <option value="none">None</option>
    </select>
  </div>
);

BookSelect.propTypes = {
  book: PropTypes.instanceOf(Object).isRequired,
  onChangeBookShelf: PropTypes.func.isRequired,
};

export default BookSelect;
