import React, { useState } from 'react'
import './style.css'

import { NewsCard } from '..'
import arrow from './arrow.png'

export const NewsCluster = ({ articles, dateRange }) => {

    const [isOpen, setIsOpen] = useState(false)

    const calcOverallScore = () => {
        const total = articles.reduce((acc, article) => {
            return acc + article.sentiment * article.magnitude
        }, 0)

        let result = total / articles.length
        // + drops extra zeroes if necessary
        result = +result.toFixed(3)
        return result
    }

    return(
        <div className="cluster-container">
            <div className="date-toggle flex-row space-between" onClick={() => setIsOpen(!isOpen)}>
                <div>{dateRange.replace(',', ' to ') + ` | Score: ${calcOverallScore()}`}</div>
                <div className={isOpen ? "icon rotate" : "icon"}>
                    <img src={arrow} />
                </div>
            </div>
            {isOpen && (
            <div className="newscard-container flex-row wrap space-around">
                {articles.map(article => <NewsCard article={article} />)}
            </div>
            )}
        </div>
    )

}