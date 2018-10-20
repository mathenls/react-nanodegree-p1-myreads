import React, { Component } from 'react';
import PropTypes from 'prop-types';


class BookShelfSelector extends Component {
    static propTypes = {
		shelves: PropTypes.array.isRequired,
		shelf: PropTypes.object.isRequired,
        cssClass: PropTypes.string.isRequired,
        handleShelfChange: PropTypes.func.isRequired,
        handleShelfMultipleChange: PropTypes.func,
        book: PropTypes.object,
        books: PropTypes.array
    }
    handleChange = (books, event) => {
        const { value } = event.target;
        event.preventDefault();
        !Array.isArray(books) ? this.props.handleShelfChange(books, value) : this.props.handleShelfMultipleChange(books, value);
    }

    render() {
        const { shelves, shelf, cssClass, book, books } = this.props;

        return (
            <div className={cssClass}>
                <select value={shelf.type || 'none'} onChange={book ? (event) => this.handleChange(book, event) : (event) => this.handleChange(books, event)}>
                    <option value="move" disabled>Move to...</option>
                    {shelves.map((shelf) => (
                        <option key={shelf.type} value={shelf.type}>{shelf.title}</option>
                    ))}
                    <option value="none">None</option>
                </select>
            </div>
        );
    }
}

export default BookShelfSelector
