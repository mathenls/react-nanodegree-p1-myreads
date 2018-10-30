import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

const Authors = (props) => {
    const { authors } = props;

    return (
        authors.map((author) => (
            <Typography key={author} variant="body1" color="textSecondary">
                {author}
            </Typography>
        ))
    );
}

Authors.propTypes = {
    authors: PropTypes.array.isRequired
}

export default Authors

