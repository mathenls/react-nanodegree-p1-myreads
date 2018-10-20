import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Book from './Book';
import BookShelfSelector from './BookShelfSelector';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
	root: {
		width: '100%',
	},
	heading: {
		fontSize: theme.typography.pxToRem(24),
		flexBasis: '33.33%',
		flexShrink: 0
	},
	secondaryHeading: {
		fontSize: theme.typography.pxToRem(18),
		color: theme.palette.text.secondary
	},
	expansionPanel: {
		margin: '12px'
	},
	typography: {
		useNextVariants: true
	},
});
class BookShelf extends Component {
	static propTypes = {
		shelves: PropTypes.array.isRequired,
		shelf: PropTypes.object.isRequired,
		books: PropTypes.array.isRequired,
		onShelfChange: PropTypes.func.isRequired,
		onShelfMultipleChange: PropTypes.func.isRequired,
		classes: PropTypes.object.isRequired,
		onBookCheckedChange: PropTypes.func.isRequired
	}
    render() {
		const { shelves, shelf, books, onShelfChange, onShelfMultipleChange, classes, onBookCheckedChange } = this.props;
		const checkedBooks = books.filter(book => book.checked);

        return (
            <div>
				<ExpansionPanel defaultExpanded={true} disabled={books.length === 0} className={classes.expansionPanel}>
					<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
						<Typography className={classes.heading}>{shelf.title}</Typography>
						<Typography className={classes.secondaryHeading}>{books.length ? `${books.length} books` : 'No books in this shelf'}</Typography>
					</ExpansionPanelSummary>
					<ExpansionPanelDetails className={classes.expansionPanel}>
						<div className="bookshelf">
							{checkedBooks.length > 0 && (
								<div>
									<span className="bookshelf-selected-books"> {checkedBooks.length} selected books.</span>
									<BookShelfSelector 
										books={checkedBooks} 
										shelves={shelves} 
										shelf={shelf} 
										handleShelfChange={onShelfChange} 
										handleShelfMultipleChange={onShelfMultipleChange} 
										cssClass="book-shelf-changer-multiple"
									/>
								</div>
							)}
							<div className="bookshelf-books">
								<ol className="books-grid">
									{books.map((book) => (
										<Book 
											key={book.id}
											shelves={shelves}
											shelf={shelf} 
											book={book} 
											handleShelfChange={onShelfChange}
											onBookCheckedChange={onBookCheckedChange}
										/>
									))}
								</ol>
							</div>
						</div>
					</ExpansionPanelDetails>
				</ExpansionPanel>
            </div>
        )
    }
}

export default withStyles(styles)(BookShelf);