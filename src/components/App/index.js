import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import * as BooksAPI from '../../api/BooksAPI';

import './index.css';

import BookList from '../../pages/BookList';
import BookSearch from '../../pages/BookSearch';

class App extends Component {
  state = {
    shelves: {},
  }

  setShelvesFromStorage = () => {
    const shelves = JSON.parse(localStorage.getItem('shelves'));

    if (shelves) {
      this.setState({ shelves });
    }
  };

  updateShelvesState = (shelves) => {
    this.setState({ shelves });
    localStorage.setItem('shelves', JSON.stringify(shelves));
  }

  addBooksToShelves = (books = []) => {
    const shelves = books.reduce((acc, book) => ({
      ...acc,
      [book.shelf]: [
        ...(acc[book.shelf] || []),
        book,
      ],
    }), {});

    this.updateShelvesState(shelves);
  }

  changeBookShelf = ({ book, newShelf }) => {
    this.removeBookFromShelf(book);
    this.addBookToShelf({ book, newShelf });
    this.updateBookShelf({ book, newShelf });
  }

  removeBookFromShelf = (book = {}) => {
    const { shelves } = this.state;

    if (book.shelf) {
      shelves[book.shelf] = shelves[book.shelf].filter(({ id }) => (
        id !== book.id
      ));

      this.updateShelvesState(shelves);
    }
  }

  addBookToShelf = ({ book, newShelf } = {}) => {
    const { shelves } = this.state;
    const newBook = book || {};

    if (newShelf) {
      newBook.oldShelf = newBook.shelf;
      newBook.shelf = newShelf;

      shelves[newShelf].push(newBook);
      this.updateShelvesState(shelves);
    }
  }

  updateBookShelf = async ({ book, newShelf = 'none' }) => {
    try {
      await BooksAPI.update(book, newShelf);
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
        <Switch>
          <Route
            exact
            path="/"
            render={() => (
              <BookList
                shelves={shelves}
                onMount={this.setShelvesFromStorage}
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
        </Switch>
      </div>
    );
  }
}

export default App;
