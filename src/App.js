import React, { Component } from 'react';
import * as BooksAPI from './BooksAPI';
import './App.css';
import { Route } from 'react-router-dom';
import BookShelf from './BookShelf';
import CircularProgress from '@material-ui/core/CircularProgress';


class BooksApp extends Component {
	state = {
		allBooks: [],
		currentlyReading: [],
		wantToRead: [],
		read: [],
		loading: true
	}
	componentDidMount() {
		BooksAPI.getAll()
			.then((books) => {
				books = books.map(book => ({...book, checked: false}));
				this.setState({
					allBooks: books,
					currentlyReading: books.filter(book => book.shelf === 'currentlyReading'),
					wantToRead: books.filter(book => book.shelf === 'wantToRead'),
					read: books.filter(book => book.shelf === 'read')
				}, () => {
					this.setState({
						loading: false
					});
				});
			});	
	}

	/**
	* @description This function handles when the user changes a book from a shelf to another, calling the API and rearranging
	*			   the books to it's current shelf
	* @param {object} book - The book that the user wants to change shelf
	* @param {string} shelf - The new shelf that the user wants to put the book ('currentlyReading', 'wantToRead', 'Read', 'None')
	*/
	handleShelfChange = (book, shelf) => {
		const allBooks = this.state.allBooks.slice();
		allBooks.find(searchedBook => searchedBook.id === book.id).shelf = shelf;

		this.setState((prevState) => ({
			allBooks: allBooks,
			currentlyReading: prevState.allBooks.filter(book => book.shelf === 'currentlyReading'),
			wantToRead: prevState.allBooks.filter(book => book.shelf === 'wantToRead'),
			read: prevState.allBooks.filter(book => book.shelf === 'read'),
		}));

		return BooksAPI.update(book, shelf);
	}

	handleShelfMultipleChange = async (books, shelf) => {
		this.setState({
			loading: true
		});
		const requests = books.map((book) => {
			return this.handleShelfChange(book, shelf);
		});
		await Promise.all(requests);
		this.setState({
			loading: false
		});
	}

	handleBookCheckedState = (book) => {
		this.setState((prevState) => ({
			allBooks: prevState.allBooks.map(searchedBook => {
				return searchedBook.id === book.id ? {...searchedBook, checked: !searchedBook.checked} : searchedBook;
			}),
			[book.shelf]: prevState[book.shelf].map(searchedBook => {
				return searchedBook.id === book.id ? {...searchedBook, checked: !searchedBook.checked} : searchedBook;
			})	
		}));
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

		const { loading } = this.state;

		return (
		<div className="app">
				<div>
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
								{loading && (
									<div className="progress">
										<CircularProgress size={80}/>
									</div>
								)} 
									<div className="list-books-content">
										<div>
											{shelves.map((shelf) => (
												<BookShelf 
													key={shelf.type}
													shelves={shelves} 
													shelf={shelf} 
													books={this.state[`${shelf.type}`]} 
													onShelfChange={this.handleShelfChange}
													onShelfMultipleChange={this.handleShelfMultipleChange}
													onBookCheckedChange={this.handleBookCheckedState} 
												/>
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
		</div>
		)
	}
}

export default BooksApp
