import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { SHELVES } from './constants';
import './index.css';
import * as BooksAPI from '../../api/BooksAPI';

import BookShelf from '../../components/BookShelf';

class BookList extends Component {
  componentDidMount = async () => {
    const { onMount } = this.props;

    onMount();
    this.loadBooks();
  }

  loadBooks = async () => {
    const { onBooksLoad } = this.props;

    try {
      const books = await BooksAPI.getAll();
      onBooksLoad(books);
    } catch (error) {
      throw (error);
    }
  }

  render() {
    const { shelves, onChangeBookShelf } = this.props;

    return (
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
  }
}

BookList.propTypes = {
  shelves: PropTypes.shape({
    currentlyReading: PropTypes.instanceOf(Array),
    wantToRead: PropTypes.instanceOf(Array),
    read: PropTypes.instanceOf(Array),
  }).isRequired,
  onChangeBookShelf: PropTypes.func.isRequired,
  onBooksLoad: PropTypes.func.isRequired,
  onMount: PropTypes.func.isRequired,
};

export default BookList;
