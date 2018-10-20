import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BookShelfSelector from './BookShelfSelector';
import RatingComponent from './Rating';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

class Book extends Component {
    state = {
        checked: this.props.book.checked
    }
    static propTypes = {
        handleShelfChange: PropTypes.func.isRequired,
        onBookCheckedChange: PropTypes.func.isRequired
    }
    handleBookCheckedChange = (book) => {
        this.setState((currentState) => ({
            checked: !currentState.checked
        }), () => {
            this.props.onBookCheckedChange(book);
        });
    }
    render() {
        const { book, shelves, shelf, handleShelfChange } = this.props;
        const { checked } = this.state;

        return (  
            <li>
                <div className="book">
                    <div className="book-top">
                        <Checkbox 
                            checked={checked} 
                            style={{position: "absolute", right: "-14px", top: "-14px", color: "#00c853"}}
                            icon={<CheckBoxOutlineBlankIcon fontSize="large" />}
                            checkedIcon={<CheckBoxIcon fontSize="large" />} 
                            onChange={() => this.handleBookCheckedChange(book)}
                        />
                        <div className="book-cover" title={book.title} style={{ width: 128, height: 188, backgroundImage: `url(${book.imageLinks.smallThumbnail})`}}></div>
                        <BookShelfSelector book={book} shelves={shelves} shelf={shelf} handleShelfChange={handleShelfChange} cssClass="book-shelf-changer"/>
                    </div>
                    <div className="book-title">{book.title}</div>
                    <div className="book-authors">
                        {book.authors.map((author) => (
                            <span key={author}>{author}</span>
                        ))}
                    </div>
                    {book.averageRating ? (
                        <RatingComponent averageRating={book.averageRating} ratingsCount={book.ratingsCount} />
                    ) : (
                        <span className="rating-label"> No ratings yet</span>
                    )}
                </div>
            </li>
        )
    }
}

export default Book