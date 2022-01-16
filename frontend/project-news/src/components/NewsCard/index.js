import React from 'react'
import './style.css'


export const NewsCard = ({ article }) => {

    function getFormattedDate(input) {
        let date = new Date(input)
        var year = date.getFullYear();

        var month = (1 + date.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;

        var day = date.getDate().toString();
        day = day.length > 1 ? day : '0' + day;

        return month + '/' + day + '/' + year;
    }

    const openNewTab = (url) => {
        window.open(url, '_blank').focus()
    } 

    const getColour = (score) => {
        if (score < -0.5){
            return 'red'
        } else if (score >= -0.5 && score < 0) {
            return 'orange'
        } else if (score === 0) {
            return 'yellow'
        } else if (score > 0 && score <= 0.5) {
            return 'blue'
        } else {
            return 'green'
        }
    }

    return (
        <div className={"card-container flex-column space-between " + getColour(article.sentiment)} onClick={() => openNewTab(article.url)}>
            <div className="info-container">
                <div className="source-header flex-row space-between">
                    <p className="source bold">{article.source}</p>
                </div>
                <div className="picture-title flex-row v-center">
                    <img src={article.image || "http://placekitten.com/250/250"} />
                    <p className="title">{article.title}</p>
                </div>
                <div className="date-sentiment flex-row space-between">
                    <p className="date">{getFormattedDate(article.publishedAt)}</p>
                    <p className="sentiment">Sentiment: {article.sentiment} Magnitude: {article.magnitude}</p>
                </div>
            </div>
        </div>
    )
}