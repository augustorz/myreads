import React, { Component } from 'react';
import * as BooksAPI from '../../BooksAPI';

import BookShelf from '../BookShelf'

const SHELVES = [
  { title: 'Current Reading', key: 'currentlyReading' },
  { title: 'Want to Read', key: 'wantToRead' },
  { title: 'Read', key: 'read' }
]

class BookList extends Component {
  state = {
    shelves: {}
  }

  componentDidMount = () => {
    BooksAPI.getAll().then((books) => {
      this.addBooksToShelves(books)
    }, (error) => {
      console.log(error)
    })
  }

  removeBookFromShelf = ({shelves, book}) => {
    return shelves[book.shelf].filter(({ id }) => (
      id !== book.id 
    ))
  }

  addBookToShelf = ({shelves, book, newShelf}) => {
    book.shelf = newShelf

    if (newShelf !== 'none') {
      shelves[newShelf].push(book)
    }
  }

  changeBookShelf = ({book, newShelf}) => {
    let { shelves } = this.state
    
    shelves[book.shelf] = this.removeBookFromShelf({shelves, book})
    this.addBookToShelf({shelves, book, newShelf})
    this.setState({ shelves })
  }

  addBooksToShelves = (books = []) => {
    let shelves = {};

    books.forEach((book) => {
      if (!shelves[book.shelf]) {
        shelves[book.shelf] = [];
      }

      shelves[book.shelf].push(book);
    })
    
    this.setState({ shelves });
  }

  render () {
    const { shelves } = this.state;

    return (
      <div className="list-books">
        <div className="list-books-title">
          <h1>MyReads</h1>
        </div>
        <div className="list-books-content">
          {SHELVES.map(({ title, key }) => (
            <BookShelf key={key} title={title} books={shelves[key]} onChangeBookShelf={this.changeBookShelf} />
          ))}
        </div>
        <div className="open-search">
          <button onClick={() => this.setState({ showSearchPage: true })}>Add a book</button>
        </div>
      </div>
    )
  }
}

export default BookList;