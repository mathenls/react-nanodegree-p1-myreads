import React from 'react';
import Rating from 'react-rating';
import PropTypes from 'prop-types';

const RatingComponent = props => {
    return <div>
        <span className="rating-label">
            <b>{props.averageRating}/5</b> ({props.ratingsCount})
        </span>
        <div className="rating-stars">    
            <Rating
                emptySymbol="fa fa-star-o fa-2x"
                fullSymbol="fa fa-star fa-2x"
                fractions={2}
                initialRating={props.averageRating}
                readonly={true}
            />   
        </div>
    </div>
}

RatingComponent.propTypes = {
    averageRating: PropTypes.number.isRequired,
    ratingsCount: PropTypes.number.isRequired
}

export default RatingComponent