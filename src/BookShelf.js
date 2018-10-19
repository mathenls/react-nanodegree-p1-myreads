import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Book from './Book';

class BookShelf extends Component {
	static propTypes = {
		shelf: PropTypes.object.isRequired,
		books: PropTypes.array.isRequired,
		handleShelfChange: PropTypes.func.isRequired
	}
    render() {
		const { shelf, books, handleShelfChange } = this.props;

        return (
            <div>
                <div className="bookshelf">
					<h2 className="bookshelf-title">{shelf.title}</h2>
					<div className="bookshelf-books">
						<ol className="books-grid">
							{books.map((book) => (
								<Book key={book.id} book={book} handleShelfChange={handleShelfChange} />
							))}
						</ol>
					</div>
				</div>
            </div>
        )
    }
}

export default BookShelf