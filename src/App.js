import React, { Component } from 'react';
import * as BooksAPI from './BooksAPI';
import './App.css';
import { Route } from 'react-router-dom';
import BookShelf from './BookShelf';
import SearchBar from './SearchBar';
import Loading from './Loading';
import AppBar from '@material-ui/core/AppBar';
import { withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import BookOutlined from '@material-ui/icons/BookOutlined';
import SearchIcon from '@material-ui/icons/Search';

const styles = {
	root: {
	  flexGrow: 1,
	},
	grow: {
	  flexGrow: 1,
	},
	menuButton: {
	  marginLeft: -12,
	  marginRight: 20,
	},
	searchIcon: {
		width: 30,
		height: '100%',
		position: 'absolute',
		pointerEvents: 'none',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	}
};

const shelves = [{
	type: 'currentlyReading',
	title: 'Currently Reading'
}, {
	type:'wantToRead',
	title:'Want To Read'
}, {
	type: 'read',
	title: 'Read'
}];


class BooksApp extends Component {
	state =  {
		books: [],
		currentlyReading: [],
		wantToRead: [],
		read: [],
		none: [],
		searchResults: [],
		loading: true,
		error: false,
		errorMessage: ''
	}

	componentDidMount() {
		BooksAPI.getAll()
			.then((books) => {
				books = books.map((book) => {
					return {...book, rating: this.searchBookRating(book)};
				});
				this.setState({
					books: books,
					currentlyReading: books.filter(book => book.shelf === 'currentlyReading'),
					wantToRead: books.filter(book => book.shelf === 'wantToRead'),
					read: books.filter(book => book.shelf === 'read')
				}, () => {
					this.handleLoading(false);
				});
			});
	}

	/**
	* @description If the book was already rated by the user, it returns the rating from localStorage
	*
	* @param {object} book Book that is being searched
	*/
	searchBookRating = (book) => {
		const rating = localStorage.getItem(book.id);
		return rating;
	}

	/**
	* @description This function handles when the user changes a book from a shelf to another, calling the API and rearranging
	*			   the books to it's current shelf
	* @param {object} updatedBook The book that the user wants to change shelf
	* @param {string} shelf The new shelf that the user wants to put the book ('currentlyReading', 'wantToRead', 'Read', 'None')
	*/
	handleShelfChange = (updatedBook, shelf) => {
		this.setState((currentState) => ({
			books: this.returnBooksFromShelves([...currentState.books], updatedBook, shelf)
		}), () => {
			this.setState((currentState) => ({
				currentlyReading: currentState.books.filter(book => book.shelf === 'currentlyReading'),
				wantToRead: currentState.books.filter(book => book.shelf === 'wantToRead'),
				read: currentState.books.filter(book => book.shelf === 'read'),
				//Here, I'm merging the books that are already in a shelf with the search results
				searchResults: currentState.searchResults.map((searchedBook) => {
					const bookOnShelf = currentState.books.find(book => book.id === searchedBook.id);
					return bookOnShelf ? bookOnShelf : searchedBook;
				})
			}));
		});
		return BooksAPI.update(updatedBook, shelf); //Returns a promise for the book update request
	}

	/**
	* @description Returns the index of the book in the books array, or -1 if it isn't in a shelf
	*
	* @param {object} book The book that is being searched
	*/
	getIndexFromShelf = (book) => {
		const index = this.state.books.findIndex((searchedBook) => searchedBook.id === book.id);
		return index;
	}

	/**
	* @description Gets the books from the shelfs to update the state, or concat a new book
	*			   to the books array
	*
	* @param {object} books A copy of the current state's books
	* @param {object} updatedBook The book that is being updated from a shelf (or none) to another
	* @param {string} shelf The shelf that is being set for the updated book
	*/
	returnBooksFromShelves = (books, updatedBook, shelf) => {
		const bookIndex = this.getIndexFromShelf(updatedBook);

		/*
		  If a book is already in a shelf, we just change the shelf and checked state
		  Else, we concat the book in the books that has shelves array
		*/
		bookIndex !== -1
		? books[bookIndex] = {...updatedBook, shelf: shelf, checked: false}
		: books = [...books, {...updatedBook, shelf: shelf, checked: false}];

		return books;
	}

	/**
	* @description For each checked book in a shelf, we handle it's change using the default
	*			   change function
	*
	* @param {object} books A copy of the current state's books
	* @param {object} updatedBook The book that is being updated from a shelf (or none) to another
	* @param {string} shelf The shelf that is being set for the updated book
	*/
	handleShelfMultipleChange = async (books, shelf) => {
		this.handleLoading(true);
		const requests = books.map((book) => {
			return this.handleShelfChange(book, shelf); //Get all book update requests promises
		});
		await Promise.all(requests); //Wait for all requests to receive responses
		this.handleLoading(false);
	}
	handleBookRated =  (book, rating) => {
		localStorage.setItem(book.id, rating);
	}
	handleBookCheckedState = (book) => {
		this.setState((prevState) => {
			if (book.shelf === 'none') {
				return {
					searchResults: prevState.searchResults.map((searchedBook) => {
						return searchedBook.id === book.id ? {...searchedBook, checked: !searchedBook.checked} : searchedBook;
					})
				}
			} else {
				return {
					books: prevState.books.map((searchedBook) => {
						return searchedBook.id === book.id ? {...searchedBook, checked: !searchedBook.checked} : searchedBook;
					}),
					[book.shelf]: prevState[book.shelf].map((searchedBook) => {
						return searchedBook.id === book.id ? {...searchedBook, checked: !searchedBook.checked} : searchedBook;
					}),
					searchResults: prevState.searchResults.map((searchedBook) => {
						return searchedBook.id === book.id ? {...searchedBook, checked: !searchedBook.checked} : searchedBook;
					})
				}
			}
		});
	}
	handleUpdateQuery = (query) => {
		this.handleLoading(true);
		BooksAPI.search(query).then((response) => {
			if (!response.error) {
				const books = response.map((book) => {
					const bookIndex = this.getIndexFromShelf(book);
					book = {
						...book,
						shelf: bookIndex !== -1 ? this.state.books[bookIndex].shelf : 'none',
						rating: this.searchBookRating(book)
					};
					return book;
				});
				this.setState({
					error: false,
					searchResults: books
				}, () => {
					this.handleLoading(false);
				});
			} else {
				this.setState({
					errorMessage: response.error,
					error: true,
					searchResults: []
				}, () => {
					this.handleLoading(false);
				});
			}
		}).catch((error) => {
			this.setState({
				errorMessage: error,
				error: true,
				searchResults: []
			}, () => {
				this.handleLoading(false);
			});
		});
	}
	handleSearchPageNavigation = (history) => {
		this.setState({
			searchResults: []
		}, () => {
			history.push('/search');
		});
	}
	handleLoading = (status) => {
		this.setState({
			loading: status
		});
	}
	render() {
		const { loading, searchResults, error } = this.state;
		const { classes } = this.props;

		return (
			<div className="app">
				<div>
					<Route exact path='/search' render={() => (
						<div className="search-books">
							<SearchBar onUpdateQuery={this.handleUpdateQuery}/>
							{loading ? (
								<Loading />
							) : (
								<div className="search-books-results">
									{!error ? (
										<BookShelf
											key={'search'}
											shelves={shelves}
											shelf={{type: 'search', title: 'Search Results'}}
											books={searchResults}
											onShelfChange={this.handleShelfChange}
											onShelfMultipleChange={this.handleShelfMultipleChange}
											onBookCheckedChange={this.handleBookCheckedState}
											onBookRated={this.handleBookRated}
											onUpdateQuery={this.onUpdateQuery}
											isSearchPage={true}
										/>
									) : (
										<Typography variant="h4" className="error" color="textSecondary">
											No results found
										</Typography>
									)}
								</div>
							)}
						</div>
					)}
					/>
					<Route exact path='/' render={({ history }) => (
						<div>
							<div className="list-books">
								<div className={classes.root}>
									<AppBar position="static">
										<Toolbar>
											<IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
												<BookOutlined />
											</IconButton>
											<Typography variant="h5" color="inherit" className={classes.grow}>
												MyReads
											</Typography>
											<Button color="inherit" onClick={() => this.handleSearchPageNavigation(history)}>
												<SearchIcon />
												Search
											</Button>
										</Toolbar>
									</AppBar>
								</div>
								{loading ? (
									<Loading />
								) : (
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
													onBookRated={this.handleBookRated}
													isSearchPage={false}
												/>
											))}
										</div>
									</div>
								)}
							</div>
						</div>
					)}
				/>
			</div>
		</div>
		)
	}
}

export default withStyles(styles)(BooksApp);