import React from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

const ArticlePopup = (article, index) => {
    return <li key={index} style={{ backgroundColor: getBackgroundColor(article.sentiment), textAlign: 'left', listStyleType: 'none', listStylePosition: 'inside', border: '1px solid black' }}>
        {article.title}
        <Popup contentStyle={{width: "400px"}} trigger={<button> SHOW ARTICLE</button>}
            position="right center">
            <div>Author: {getAuthor(article.author)}</div>
            <a href={article.url}>Link to article</a>
            <div>Source: {article.source}</div>
            <div>Published on: {getFormattedDate(article.publishedAt)}</div>
            <div>Category: {article.category}</div>
            <div>Date Range: {article.dateRange.split(",")[0] + " , " + article.dateRange.split(",")[1]}</div>
            <div>Sentiment Score: {getSentimentDescription(article.sentiment)}</div>
        </Popup>
    </li>
};
const getAuthor = (author) => {
    //TODO: not sure why it still shows up as null or undefined, should be caught when changing json to model

    if (author === null || author === undefined || author == '') {
        return "Unavailable";
    } else {
        return author;
    }

}
const getFormattedDate = (date) => {
    let dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    const dateObject = new Date(date);
    return dateObject.toLocaleDateString("en-US", dateOptions);
}

const getBackgroundColor = (sentiment) => {

    if (sentiment < -0.5) {
        //red 
        return '#FF0000';
    } else if (sentiment < 0.5) {
        //orange
        return '#FFA500';
    } else {
        //green
        return '#00FF00';
    }
};

const getSentimentDescription = (sentiment) => {

    if (sentiment < -0.5) {
        return 'Article is mostly negative with a score of ' + sentiment;
    } else if (sentiment < 0.5) {
        return 'Article is somewhat neutral with a score of ' + sentiment;
    } else {
        return 'Article is mostly positive with a score of ' + sentiment;
    }
}

export default ArticlePopup;