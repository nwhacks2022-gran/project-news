import React from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

const contentStyle = { background: '#00FF00' };
const overlayStyle = { background: 'rgba(0,0,0,0.5)' };

const ArticlePopup = (article) => (

    <Popup trigger={<button> SHOW ARTICLE</button>}
        {...{ contentStyle, overlayStyle }}
        position="right center">
        <div>Title: {article.title}</div>
        <div>Author: {article.author}</div>
        <div>Link: {article.url}</div>
        <div>Source: {article.source}</div>
        <div>Published at: {article.published_at}</div>
        <div>Category: {article.category}</div>
        <div>Sentiment Score: {article.sentiment}</div>
    </Popup>
);

export default ArticlePopup;