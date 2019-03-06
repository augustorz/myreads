import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
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
      this.searchBooks();
    }
  }

  searchBooks = async () => {
    const { query } = this.state;

    try {
      const books = await BooksAPI.search(query);

      if (books && !books.error) {
        this.setState({ books });
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
  onChangeBookShelf: PropTypes.func.isRequired,
};

export default BookSearch;
