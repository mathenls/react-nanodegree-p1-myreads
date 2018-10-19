import React, { Component } from 'react';
import * as BooksAPI from './BooksAPI';
import './App.css';
import { Route } from 'react-router-dom';
import BookShelf from './BookShelf';


class BooksApp extends Component {
  state = {
	currentlyReading: [],
	wantToRead: [],
	read: []
  }

  componentDidMount() {
    BooksAPI.getAll()
      .then((books) => this.setState({
		allBooks: books,
		currentlyReading: books.filter(book => book.shelf === 'currentlyReading'),
		wantToRead: books.filter(book => book.shelf === 'wantToRead'),
		read: books.filter(book => book.shelf === 'read')
      }));
  }
/**
* @description This function handles when the user changes a book from a shelf to another, calling the API and rearranging
*			   the books to it's current shelf
* @param {object} book - The book that the user wants to change shelf
* @param {string} shelf - The new shelf that the user wants to put the book ('currentlyReading', 'wantToRead', 'Read', 'None')
*/
  handleShelfChange = (book, shelf) => {
    BooksAPI.update(book, shelf)
      .then((shelves) => this.setState((prevState) => ({
		  currentlyReading: prevState.allBooks.filter(book => shelves.currentlyReading.includes(book.id)),
		  wantToRead: prevState.allBooks.filter(book => shelves.wantToRead.includes(book.id)),
		  read: prevState.allBooks.filter(book => shelves.read.includes(book.id))
	  })));
  }
  render() {
    const shelves = [{
      type: 'currentlyReading',
      title: 'Currently Reading'
    }, {
      type:'wantToRead',
	  title:'Want To Read' 
    }, {
      type: 'read',
      title: 'Read'}
    ];

    return (
      <div className="app">
        <Route exact path='/search' render={({ history  }) => (
          <div className="search-books">
            <div className="search-books-bar">
              <a className="close-search" onClick={() => history.push('/')}>Close</a>
              <div className="search-books-input-wrapper">
                {/*
                  NOTES: The search from BooksAPI is limited to a particular set of search terms.
                  You can find these search terms here:
                  https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

                  However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                  you don't find a specific author or title. Every search is limited by search terms.
                */}
                <input type="text" placeholder="Search by title or author"/>

              </div>
            </div>
            <div className="search-books-results">
              <ol className="books-grid"></ol>
            </div>
          </div>
        )}
        />
        <Route exact path='/' render={({ history }) => (
			<div>
				<div className="list-books">
					<div className="list-books-title">
						<h1>MyReads</h1>
					</div>
					<div className="list-books-content">
						<div>
							{shelves.map((shelf) => (
								<BookShelf key={shelf.type} shelf={shelf} books={this.state[`${shelf.type}`]} handleShelfChange={this.handleShelfChange} />
							))}
						</div>
					</div>
				</div>
				<div className="open-search">
					<a onClick={() => history.push('/search')}>Add a book</a>
				</div>
			</div>
        )}
      />
      </div>
    )
  }
}

export default BooksApp
