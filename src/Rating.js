import React, { Component } from 'react';
import Rating from 'react-rating';
import PropTypes from 'prop-types';

class RatingComponent extends Component {
    state = {
        rating: this.props.book.rating || this.props.book.averageRating || 0,
        averageRating: this.props.book.averageRating || 0,
        ratingsCount: this.props.book.ratingsCount || 0,
        rated: this.props.book.rating > 0 || false,
        yourRating: this.props.book.rating || 0
    }
    handleChange = (value) => {
        this.setState((currentState) => ({
            rating: (((currentState.ratingsCount * currentState.averageRating) + value) / (currentState.ratingsCount + 1)).toFixed(1),
            averageRating: (((currentState.ratingsCount * currentState.averageRating) + value) / (currentState.ratingsCount + 1)).toFixed(1),
            ratingsCount: currentState.ratingsCount + 1,
            rated: true,
            yourRating: value
        }));
        this.props.onBookRated(this.props.book, value)
    }
    handleHover = (value) => {
        value ? this.setState((currentState) => ({
            rating: currentState.yourRating
        })) : this.setState((currentState) => ({
            rating: currentState.averageRating
        }))
    }
    render() {
        const { rating, ratingsCount, rated } = this.state;

        return (<div>
            <span className="rating-label">
                <b>{rating} / 5</b> ({rated ? 'Your rating' : ratingsCount})
            </span>
            <div className={rated ? 'rating-stars-rated' : 'rating-stars'}>    
                <Rating
                    emptySymbol="fa fa-star-o fa-2x"
                    fullSymbol="fa fa-star fa-2x"
                    onChange={(value) => {this.handleChange(value)}}
                    fractions={2}
                    initialRating={rating}
                    onHover={(value) => {this.handleHover(value)}}
                    readonly={rated}
                />   
            </div>
        </div>)
    }

}

RatingComponent.propTypes = {
    book: PropTypes.object.isRequired,
    onBookRated: PropTypes.func.isRequired
}

export default RatingComponent