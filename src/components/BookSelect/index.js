import React from 'react';
import PropTypes from 'prop-types';
import { SHELVES } from './constants';

const BookSelect = ({ book, onChangeBookShelf }) => {
  const onChange = ({ target: { value: newShelf } }) => {
    onChangeBookShelf({ book, newShelf });
  };

  return (
    <div className="book-shelf-changer">
      <select
        value={book.shelf}
        onChange={onChange}
      >
        <option value="move" disabled>
          Move to...
        </option>
        {
          SHELVES.map(({ value, text }) => (
            <option key={value} value={value}>
              {text}
            </option>
          ))
        }
      </select>
    </div>
  );
};

BookSelect.propTypes = {
  book: PropTypes.instanceOf(Object).isRequired,
  onChangeBookShelf: PropTypes.func.isRequired,
};

export default BookSelect;
