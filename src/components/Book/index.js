import React from 'react';

import SelectShelf from '../SelectShelf';

const Book = ({ book, onChangeBookShelf }) => (
  <li>
    <div className="book">
      <div className="book-top">
        <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url("${book.imageLinks.thumbnail}")` }}></div>
        <SelectShelf book={book} onChangeBookShelf={onChangeBookShelf} />
      </div>
      <div className="book-title">{book.title}</div>
      {book.authors.map((author, index) => (
        <div className="book-authors" key={index}>{author}</div>
      ))}
    </div>
  </li>
)

export default Book