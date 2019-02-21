import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import * as BooksAPI from '../../BooksAPI';

import Book from '../../components/Book';

class BookSearch extends Component {
  state = {
    query: '',
    books: [],
  }

  handleSearch = (event) => {
    const query = event.target.value;

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
          <ol className="books-grid">
            {books.map(book => (
              <Book key={book.id} book={book} onChangeBookShelf={onChangeBookShelf} />
            ))}
          </ol>
        </div>
      </div>
    );
  }
}

BookSearch.propTypes = {
  onChangeBookShelf: PropTypes.func.isRequired,
};

export default BookSearch;
