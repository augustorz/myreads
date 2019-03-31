import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import * as BooksAPI from '../../api/BooksAPI';
import './index.css';

import BooksGrid from '../../components/BooksGrid';

class BookSearch extends Component {
  state = {
    query: '',
    books: [],
  }

  handleSearch = ({ target: { value: query } }) => {
    this.setState({
      books: [],
      query,
    });

    if (query) {
      debounce(this.searchBooks, 1000)();
    }
  }

  isBookInShelf = ({ book, shelf }) => shelf.some(({ id }) => id === book.id)

  putShelfInBook = (book) => {
    const { shelves } = this.props;
    const shelvesBooks = Object.entries(shelves);
    const bookWithShelf = book;

    shelvesBooks.some(([shelf, books]) => {
      if (this.isBookInShelf({ book, shelf: books })) {
        bookWithShelf.shelf = shelf;
        return true;
      }

      return false;
    });

    return bookWithShelf;
  }

  putShelvesInBooks = (books = []) => books.map(this.putShelfInBook)

  searchBooks = async () => {
    const { query } = this.state;

    try {
      const books = await BooksAPI.search(query);

      if (books && !books.error) {
        this.setState({ books: this.putShelvesInBooks(books) });
      }
    } catch (error) {
      throw error;
    }
  }

  render() {
    const { query, books } = this.state;
    const { onChangeBookShelf } = this.props;

    return (
      <div className="search-books">
        <div className="search-books-bar">
          <Link className="close-search" to="/">Close</Link>
          <div className="search-books-input-wrapper">
            <input
              type="text"
              placeholder="Search by title or author"
              value={query}
              onChange={this.handleSearch}
            />
          </div>
        </div>
        <div className="search-books-results">
          <BooksGrid books={books} onChangeBookShelf={onChangeBookShelf} />
        </div>
      </div>
    );
  }
}

BookSearch.propTypes = {
  shelves: PropTypes.shape({
    currentlyReading: PropTypes.instanceOf(Array),
    wantToRead: PropTypes.instanceOf(Array),
    read: PropTypes.instanceOf(Array),
  }),
  onChangeBookShelf: PropTypes.func.isRequired,
};

BookSearch.defaultProps = {
  shelves: {},
};

export default BookSearch;
