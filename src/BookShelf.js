import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Book from './Book';

class BookShelf extends Component {
	static propTypes = {
		shelf: PropTypes.string.isRequired,
		books: PropTypes.array.isRequired,
		title: PropTypes.string.isRequired
	}
    render() {
		const { shelf, books, title } = this.props;
		const shelfBooks = books.filter(book => book.shelf === shelf);

        return (
            <div>
                <div className="bookshelf">
					<h2 className="bookshelf-title">{title}</h2>
					<div className="bookshelf-books">
						<ol className="books-grid">
							{shelfBooks.map((book) => (
								<Book book={book} />
							))}
						</ol>
					</div>
				</div>
            </div>
        )
    }
}

export default BookShelf