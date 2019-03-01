import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import * as BooksAPI from '../../api/BooksAPI';

import './index.css';

import BookList from '../../pages/BookList';
import BookSearch from '../../pages/BookSearch';

class App extends Component {
  state = {
    shelves: {},
  }

  addBooksToShelves = (books = []) => {
    const shelves = books.reduce((acc, book) => ({
      ...acc,
      [book.shelf]: [
        ...(acc[book.shelf] || []),
        book,
      ],
    }), {});

    this.setState({ shelves });
  }

  changeBookShelf = ({ book, newShelf }) => {
    this.removeBookFromShelf(book);
    this.addBookToShelf({ book, newShelf });
    this.updateBookShelf({ book, newShelf });
  }

  removeBookFromShelf = (book) => {
    const { shelves } = this.state;

    if (book.shelf) {
      shelves[book.shelf] = shelves[book.shelf].filter(({ id }) => (
        id !== book.id
      ));
    }

    this.setState({ shelves });
  }

  addBookToShelf = ({ book, newShelf }) => {
    const { shelves } = this.state;
    const newBook = book;
    newBook.oldShelf = book.shelf;
    newBook.shelf = newShelf;

    if (newShelf) {
      shelves[newShelf].push(newBook);
    }

    this.setState({ shelves });
  }

  updateBookShelf = async ({ book, newShelf }) => {
    try {
      await BooksAPI.update(book, newShelf || 'none');
    } catch (error) {
      this.removeBookFromShelf(book);
      this.addBookToShelf({ book, newShelf: book.oldShelf });
      throw (error);
    }
  }

  render() {
    const { shelves } = this.state;

    return (
      <div className="app">
        <Route
          exact
          path="/"
          render={() => (
            <BookList
              shelves={shelves}
              onBooksLoad={this.addBooksToShelves}
              onChangeBookShelf={this.changeBookShelf}
            />
          )}
        />
        <Route
          path="/search"
          render={() => (
            <BookSearch
              onChangeBookShelf={this.changeBookShelf}
            />
          )}
        />
      </div>
    );
  }
}

export default App;
