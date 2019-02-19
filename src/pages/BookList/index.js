import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as BooksAPI from '../../BooksAPI';

import BookShelf from '../../components/BookShelf';

const SHELVES = [
  { title: 'Current Reading', key: 'currentlyReading' },
  { title: 'Want to Read', key: 'wantToRead' },
  { title: 'Read', key: 'read' },
];

class BookList extends Component {
  state = {
    shelves: {},
  }

  componentDidMount = () => {
    BooksAPI.getAll().then((books) => {
      this.addBooksToShelves(books);
    }, (error) => {
      console.log(error);
    });
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

  changeBookShelf = ({ book, newShelf }) => {
    const { shelves } = this.state;

    shelves[book.shelf] = this.removeBookFromShelf({ shelves, book });
    this.addBookToShelf({ shelves, book, newShelf });
    this.setState({ shelves });
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

  render() {
    const { shelves } = this.state;

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
              onChangeBookShelf={this.changeBookShelf}
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

export default BookList;
