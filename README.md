# MyReads Project

This is my first React practical project from Udacity's React Nanodegree program. It's basically an app
that you can use to search books and organize them in shelves (Currently Reading, Want To Read, Read).
I implemented two new features to the application:
* You can move multiple books to a shelf
* You can rate a book (1 to 5 stars) (The rating is stored in the browser's localStorage)

## React

* react@16.6.0
* react-dom@16.3.2
* react-rating@1.4.1
* react-router-dom@4.3.1"

## External Libraries Used

* @material-ui/core@3.2.2
* @material-ui/icons@3.0.1
* react-rating@1.4.1
* font-awesome@4.7.0

## Setup

To get started

* install all project dependencies with `npm install`
* start the development server with `npm start` or `yarn start`
```

## Important
The backend API uses a fixed set of cached search results and is limited to a particular set of search terms, which can be found in [SEARCH_TERMS.md](SEARCH_TERMS.md). That list of terms are the _only_ terms that will work with the backend, so don't be surprised if your searches for Basket Weaving or Bubble Wrap don't come back with any results.

## Create React App

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app). You can find more information on how to perform common tasks [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).
