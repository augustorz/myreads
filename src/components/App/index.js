import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import * as BooksAPI from '../../BooksAPI';

import './index.css';

import BookList from '../../pages/BookList';
import BookSearch from '../../pages/BookSearch';

class App extends Component {
  state = {
    shelves: {},
  }

  componentDidMount = async () => {
    try {
      const books = await BooksAPI.getAll();
      this.addBooksToShelves(books);
    } catch (error) {
      throw (error);
    }
  }

  addBooksToShelves = (books = []) => {
    const shelves = {};

    books.forEach((book) => {
      if (!shelves[book.shelf]) {
        shelves[book.shelf] = [];
      }

      shelves[book.shelf].push(book);
    });

    this.setState({ shelves });
  }

  changeBookShelf = ({ book, newShelf }) => {
    const { shelves } = this.state;

    if (shelves[book.shelf]) {
      shelves[book.shelf] = this.removeBookFromShelf({ shelves, book });
    }

    this.updateBookShelf({ book, newShelf });
    this.addBookToShelf({ shelves, book, newShelf });
    this.setState({ shelves });
  }

  removeBookFromShelf = ({ shelves, book }) => (
    shelves[book.shelf].filter(({ id }) => (
      id !== book.id
    ))
  )

  addBookToShelf = ({ shelves, book, newShelf }) => {
    const currentBook = book;
    currentBook.shelf = newShelf;

    if (newShelf !== 'none') {
      shelves[newShelf].push(currentBook);
    }
  }

  updateBookShelf = async ({ book, newShelf }) => {
    const { shelves } = this.state;

    try {
      //await BooksAPI.update(book, newShelf);
      throw new Error('Opa!');
    } catch (error) {
      const { shelf: oldShelf } = book;

      shelves[book.newShelf] = this.removeBookFromShelf({ shelves, book });
      this.addBookToShelf({ shelves, book, oldShelf });
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
