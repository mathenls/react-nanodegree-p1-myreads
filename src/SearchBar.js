import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class SearchBar extends Component {
    state = {
        query: ''
    }
    updateQuery = (query) => {
        this.setState(() => ({
            query: query.trim()
        }))
    }
    clearQuery = () => {
        this.updateQuery('')
    }
    render() {
        const { query } = this.state;

        return (
            <div className="search-books-bar">
                <Link
                    to='/'
                    className='close-search'
                    >
                    Close Search
                </Link>
                <div className="search-books-input-wrapper">
                    <input 
                        type="text" 
                        value={query}
                        onChange={(event) => this.updateQuery(event.target.value)} 
                        placeholder="Search by title or author"
                    />
                </div>
            </div>
        )
    }
}

export default SearchBar