import React, { useState } from 'react'
import './App.css'
import ArticlePopup from './ArticleDialog';
import Article from './Article';

import { NewsCluster } from './components';

const axios = require('axios');

const apiUrl = 'https://news4ubackend-7ifydvqqkq-ue.a.run.app/'

const App = () => {

  const [keywords, setKeywords] = useState([])
  const [isFetching, setIsFetching] = useState(false)
  const [beforeDate, setBeforeDate] = useState()
  const [afterDate, setAfterDate] = useState()
  const [articles, setArticles] = useState([])
  const [dateRanges, setDateRanges] = useState([])

  const onSubmit = async () => {

    setIsFetching(true)
    // attempt to contact API; send parameters
    // use isFetching to determine loading state

    const params = {
      keywords,
      beforeDate,
      afterDate
    }
    
    const GET_ARTICLES_ENDPOINT = "getarticles";
    const customFetchArticlesUrl = apiUrl + GET_ARTICLES_ENDPOINT

    const GET_TRENDS_DATERANGES = "get/trends";
    const customFetchDateRangesUrl = apiUrl + GET_TRENDS_DATERANGES

    setIsFetching(true)

    axios.get(customFetchDateRangesUrl, {
      params: {
        keywords: keywords,
        date: beforeDate + "," + afterDate
      }

    }).then(function (response) {

      const dateRanges = response.data['top_dates'];
      setDateRanges(dateRanges);

      let allNewsArticles = [];
      let promises = [];

      dateRanges.forEach((dateRange) => {

        promises.push(axios.get(customFetchArticlesUrl, {
          params: {
            keywords: keywords,
            date: dateRange
          }

        }).then(function (response) {
          //response.data is the raw article data:

          allNewsArticles.push(parseArticleData(response.data, dateRange))

        }).catch(function (error) {
          console.log(error);

        }).then(function (finalReponse) {
          console.log(finalReponse);
        }));

      });

      Promise.all(promises).then(() => {
        console.log(allNewsArticles)
        setArticles(allNewsArticles);
        setIsFetching(false)
      });

    }).catch(function (error) {
      console.log(error);

    }).then(function (finalReponse) {
    });

  }

  const parseArticleData = (responseJson, dateRange) => {
    const data = responseJson['data']
    let articleObjects = []

    data.forEach((article) => {
      let articleObject = new Article(article['author'], article['title'], article['url'], article['source'], article['image'], article['published_at'], article['category'], article['magnitude'], dateRange, article['sentiment']);

      articleObjects.push(articleObject)

    });

    return articleObjects;

  }

  const SetArticlePopups = () => {
    let listOfArticlesGroups = [];

    if (articles !== []) {

      for (let i = 0; i < articles.length; i++) {
        const articleGroup = articles[i];
        let dateRange = dateRanges[i].split(",");

        let finalArticleGroup = [];
        articleGroup.forEach((article) => {
          let index = Math.floor(Math.random() * (1000000 - 1 + 1) + 1)
          finalArticleGroup.push(ArticlePopup(article, index));
        });

        let anotherIndex = Math.floor(Math.random() * (1000000 - 1 + 1) + 1)
        listOfArticlesGroups.push(<div key={anotherIndex}>Date Range of: {dateRange[0] + ' to ' + dateRange[1]} <div>{finalArticleGroup}</div></div>);
      }

      return listOfArticlesGroups;
    } else {
      return <div></div>
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>In The Loop</h1>
        <div className="container">
          <div className="input-container">
            <input
              id="keyword-text"
              className="text-input"
              placeholder="Enter keyword"
              onChange={e => setKeywords(encodeURIComponent(e.target.value))} />
            <div className="date-container">
              <input id="date-before" className="date-picker" type="date" placeholder="yyyy-mm-dd" onChange={e => setBeforeDate(e.target.value)} />
              <input id="date-after" className="date-picker" type="date" placeholder="yyyy-mm-dd" onChange={e => setAfterDate(e.target.value)} />
            </div>
            <button id="submit" onClick={onSubmit}>Submit</button>
            <div style={{ color: 'white', fontSize: '20px' }}>
              Colour key for Sentiment:<br></br>
              <div style={{ color: 'red', fontSize: '20px' }}>Red: Sentiment is below -0.5 <br></br></div>
              <div style={{ color: 'orange', fontSize: '20px' }}>Orange: Sentiment is between -0.5 and 0<br></br></div>
              <div style={{ color: 'yellow', fontSize: '20px' }}>Orange: Sentiment is 0<br></br></div>
              <div style={{ color: 'blue', fontSize: '20px' }}>Blue: Sentiment is between 0 and 0.5<br></br></div>
              <div style={{ color: 'green', fontSize: '20px' }}>Green: Sentiment is above 0.5</div>
            </div>
          </div>
          <div>
            {isFetching ? (
              <div>Loading</div>
            ) :
              <div>
                {
                  dateRanges.length > 0 && articles.length > 0 ? (
                    articles.map((article, index) => <NewsCluster dateRange={dateRanges[index]} articles={article} />)
                  ) : []
                }
              </div>
            }
          </div>
        </div>
      </header>
    </div>
  )
}

export default App
