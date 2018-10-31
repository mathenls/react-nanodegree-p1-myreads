import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import BookShelfSelector from './BookShelfSelector';
import Authors from './Authors';
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
      height: 470,
      width: 220,
      boxShadow: '0 0 10px 2px rgba(0,0,0,0.18) !important'
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
	title: {
		fontSize: theme.typography.pxToRem(14),
		flexBasis: '33.33%',
        flexShrink: 0,
        marginTop: '4px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        maxWidth: '30ch',
        fontWeight: 'bold'
    },
    shelfTitle: {
        textAlign: 'center',
        fontSize: theme.typography.pxToRem(14)
    }
});

class Book extends PureComponent {
    state = {
        checked: this.props.book.checked
    }
    static propTypes = {
        handleShelfChange: PropTypes.func.isRequired,
        onBookCheckedChange: PropTypes.func.isRequired,
        onBookRated: PropTypes.func.isRequired,
        isSearchPage: PropTypes.bool.isRequired
    }
    handleBookCheckedChange = (book) => {
        this.setState((currentState) => ({
            checked: !currentState.checked
        }), () => {
            this.props.onBookCheckedChange(book);
        });
    }
    render() {
        const { book, shelves, shelf, handleShelfChange, onBookRated, classes, isSearchPage } = this.props;
        const { checked } = this.state;
        const shelfTitle = book.shelf !== 'none' ? shelves.find((shelf) => shelf.type === book.shelf).title : '';

        return (
            <li>
                <div className="book">
                    <Card className={classes.card}>
                        <div className={classes.details}>
                            <Checkbox
                                checked={checked}
                                style={{margin: 4, padding: 0, textAlign: 'left', display: 'inline'}}
                                icon={<CheckBoxOutlineBlankIcon fontSize="default" />}
                                checkedIcon={<CheckBoxIcon fontSize="default" />}
                                onChange={() => this.handleBookCheckedChange(book)}
                            />
                            <CardMedia
                                className={classes.cover}
                                image={(book.imageLinks && book.imageLinks.smallThumbnail) || '/no-image.jpg'}
                                title={book.title}
                            />
                            <CardContent className={classes.content}>
                                {(isSearchPage && book.shelf !== 'none') &&  (
                                    <Typography variant="subtitle2" color="textSecondary" className={classes.shelfTitle}>
                                        {shelfTitle}
                                    </Typography>
                                )}
                                <Typography variant="h6" className={classes.title}>
                                    {book.title}
                                </Typography>
                                {book.authors && book.authors.length > 0 && (
                                    <Authors authors={book.authors} />
                                )}
                                <RatingComponent
                                    book={book}
                                    onBookRated={onBookRated}
                                />
                                <BookShelfSelector
                                    book={book}
                                    shelves={shelves}
                                    shelf={shelf}
                                    handleShelfChange={handleShelfChange}
                                    cssClass="book-shelf-changer-multiple"
                                />
                            </CardContent>
                        </div>
                    </Card>
                </div>
            </li>
        )
    }
}

export default withStyles(styles, { withTheme: true })(Book);