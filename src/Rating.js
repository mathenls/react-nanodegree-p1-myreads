import React, { Component } from 'react';
import Rating from 'react-rating';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

class RatingComponent extends Component {
    state = {
        rating: this.props.book.rating || this.props.book.averageRating || 0,
        averageRating: this.props.book.averageRating || 0,
        ratingsCount: this.props.book.ratingsCount || this.props.book.rating ? 1 : 0,
        rated: this.props.book.rating || false,
        yourRating: this.props.book.rating || 0
    }
    handleChange = (value) => {
        this.setState((currentState) => {
            const { averageRating, ratingsCount, rated } = currentState;
            const average = ratingsCount === 0
                            ? value.toFixed(1)
                            : (((averageRating * ratingsCount) + value) / (ratingsCount + 1)).toFixed(1)

            return ({
                rating: average,
                averageRating: average,
                ratingsCount: !rated ? ratingsCount + 1 : ratingsCount || 1,
                rated: true,
                hovered: true,
                yourRating: value
            })
        });
        this.props.onBookRated(this.props.book, value)
    }
    handleHover = (value) => {
        value ? this.setState((currentState) => ({
            rating: currentState.yourRating,
            hovered: true
        })) : this.setState((currentState) => ({
            rating: currentState.averageRating,
            hovered: false
        }))
    }
    render() {
        const { rating, ratingsCount, hovered, rated } = this.state;

        return (
            <div>
                <div className={hovered ? 'rating-stars-rated' : 'rating-stars'}>
                    <Typography variant="body1" color="textSecondary">
                        {rating}
                        {hovered ? ' (Your rating)' : ` (${ratingsCount})`}
                    </Typography>
                    <Rating
                        emptySymbol="fa fa-star-o fa-2x"
                        fullSymbol="fa fa-star fa-2x"
                        onChange={(value) => {this.handleChange(value)}}
                        fractions={2}
                        initialRating={parseFloat(rating)}
                        onHover={(value) => {this.handleHover(value)}}
                        quiet={!hovered}
                    />
                </div>
                <span className="rating-label">
                    <b>{!rated && ('Rate The Book')}</b>
                </span>
            </div>
        )
    }

}

RatingComponent.propTypes = {
    book: PropTypes.object.isRequired,
    onBookRated: PropTypes.func.isRequired
}

export default RatingComponent