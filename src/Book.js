import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BookShelfSelector from './BookShelfSelector';
import RatingComponent from './Rating';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
    card: {
      display: 'flex',
      minWidth: 125,
      minHeight: 360
    },
    details: {
      display: 'flex',
      flexDirection: 'column',
    },
    content: {
      flex: '1 0 auto',
      padding: 12,
      position: 'relative',
      minWidth: 210
    },
    cover: {
      minWidth: 130,
      minHeight: 200,
      backgroundSize: 'contain'
    },
});

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
        const { book, shelves, shelf, handleShelfChange, classes } = this.props;
        const { checked } = this.state;

        return (  
            <li>
                <div className="book">
                    <Card className={classes.card}>
                        <div className={classes.details}>
                            <CardMedia
                                className={classes.cover}
                                image={book.imageLinks.smallThumbnail}
                                title={book.title}
                            />
                            <CardContent className={classes.content}>
                                <Typography component="h6" variant="h6">
                                    {book.title}
                                    <Checkbox 
                                        checked={checked} 
                                        style={{margin: 4, padding: 0}}
                                        icon={<CheckBoxOutlineBlankIcon fontSize="medium" />}
                                        checkedIcon={<CheckBoxIcon fontSize="medium" />} 
                                        onChange={() => this.handleBookCheckedChange(book)}
                                    />
                                </Typography>
                                {book.authors.map((author) => (
                                    <Typography component="subtitle2" color="textSecondary" className>
                                        {author}
                                    </Typography>
                                ))}
                                {book.averageRating ? (
                                    <RatingComponent averageRating={book.averageRating} ratingsCount={book.ratingsCount} />
                                ) : (
                                    <span className="rating-label"> No ratings yet</span>
                                )}
                                <BookShelfSelector book={book} shelves={shelves} shelf={shelf} handleShelfChange={handleShelfChange} cssClass="book-shelf-changer-multiple"/>
                            </CardContent>
                        </div>
                    </Card>
                </div>
            </li>
        )
    }
}

export default withStyles(styles, { withTheme: true })(Book);