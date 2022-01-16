import React, { useState } from 'react'
import './App.css'
import ArticlePopup from './ArticleDialog';
import Article from './Article';

const axios = require('axios');

// TODO: url for our python API
const apiUrl = `http://localhost:5000/`
const App = () => {

  const [keywords, setKeywords] = useState([])
  const [isFetching, setIsFetching] = useState(false)
  const [beforeDate, setBeforeDate] = useState()
  const [afterDate, setAfterDate] = useState()
  const [articles, setArticles] = useState([])
  const [dateRanges, setDateRanges] = useState([])

  const onSubmit = async () => {

    // attempt to contact API; send parameters
    // use isFetching to determine loading state

    const params = {
      keywords,
      beforeDate,
      afterDate
    }

    const GET_ARTICLES_ENDPOINT = "getarticles";
    //localhost:5000/get/trends?keywords=bitcoin&date=2022-01-01,2022-01-12

    const customFetchArticlesUrl = apiUrl + GET_ARTICLES_ENDPOINT
    //const customUrl = `${apiUrl}/getarticles?keywords=${keywords}&beforeDate=${beforeDate}&afterDate=${afterDate}`

    setIsFetching(true)

    const GET_TRENDS_DATERANGES = "get/trends";
    const customFetchDateRangesUrl = apiUrl + GET_TRENDS_DATERANGES

    axios.get(customFetchDateRangesUrl, {
      params: {
        keywords: keywords,
        date: beforeDate + "," + afterDate
      }

    }).then(function (response) {
      //console.log(response.data);
      //response.data is the raw trends data:

      const dateRanges = response.data['top_dates'];
      //console.log('dataranges: ', dateRanges);
      setDateRanges(dateRanges);

      let allNewsArticles = [];

      dateRanges.forEach((dateRange) => {
        
        axios.get(customFetchArticlesUrl, {
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
        });
      });

      console.log(allNewsArticles)
      setArticles(allNewsArticles);

    }).catch(function (error) {
      console.log(error);

    }).then(function (finalReponse) {
      console.log(finalReponse);
    })


    setIsFetching(false)

    // setIsFetching(true)
    // const response = await fetch(customUrl)
    // setIsFetching(false)
  }

  const parseArticleData = (responseJson, dateRange) => {
    const data = responseJson['data']
    let articleObjects = []

    data.forEach((article) => {
      let articleObject = new Article(article['author'], article['title'], article['url'], article['source'], article['image'], article['published_at'], article['category'], article['magnitude'], dateRange, article['sentiment']);

      //console.log(articleObject.dateRange);
      articleObjects.push(articleObject)

    });

    return articleObjects;

  }

  const SetArticlePopups = () => {
    let index = 1;
    let listOfArticlesGroups = [];

    if (articles !== []) {

      for (let i = 0; i < articles.length; i++) {
        const articleGroup = articles[i];
        let dateRange = dateRanges[i].split(",");

        let finalArticleGroup = [];
        articleGroup.forEach((article) => {
          finalArticleGroup.push(ArticlePopup(article, index));
          index++;
        });

        listOfArticlesGroups.push(<div>Date Range of: {dateRange[0] + ' to ' + dateRange[1]} <div>{finalArticleGroup}</div></div>);
      }

      return listOfArticlesGroups;
    } else {
      return <div></div>
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>News 4 U</h1>
        <div className="input-container">
          <input
            id="keyword-text"
            className="text-input"
            placeholder="Separate keywords using commas: hockey, baseball, Blue Jays"
            onChange={e => setKeywords(encodeURIComponent(e.target.value))} />
          <div className="date-container">
            <input id="date-before" className="date-picker" type="date" onChange={e => setBeforeDate(e.target.value)} />
            <input id="date-after" className="date-picker" type="date" onChange={e => setAfterDate(e.target.value)} />
          </div>
          <button id="submit" onClick={onSubmit}>Submit</button>
          <div style={{ color: 'white', fontSize: '20px' }}>
            Colour key for Sentiment:<br></br>
            <div style={{ color: 'red', fontSize: '20px' }}>Red: Sentiment is below -0.5 <br></br></div>
            <div style={{ color: 'orange', fontSize: '20px' }}>Orange: Sentiment is between -0.5 and 0.5<br></br></div>
            <div style={{ color: 'green', fontSize: '20px' }}>Green: Sentiment is above 0.5</div>
          </div>
          <SetArticlePopups></SetArticlePopups>
        </div>
      </header>
    </div>
  )
}

export default App
