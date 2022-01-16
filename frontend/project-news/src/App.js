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

  const onSubmit = async () => {

    // attempt to contact API; send parameters
    // use isFetching to determine loading state

    const params = {
      keywords,
      beforeDate,
      afterDate
    }

    const GET_ARTICLES_ENDPOINT = "getarticles";

    const customUrl = apiUrl + GET_ARTICLES_ENDPOINT
    //const customUrl = `${apiUrl}/getarticles?keywords=${keywords}&beforeDate=${beforeDate}&afterDate=${afterDate}`
    console.log(customUrl)

    setIsFetching(true)

    axios.get(customUrl, {
      params: {
        keywords: keywords,
        date: beforeDate + "," + afterDate
      }

    }).then(function (response) {
      console.log(response.data);
      //response.data is the raw article data:
      const articleObjects = parseArticleData(response.data)

    }).catch(function (error) {
      console.log(error);

    }).then(function (finalReponse) {
      console.log(finalReponse);
    });

    setIsFetching(false)

    // setIsFetching(true)
    // const response = await fetch(customUrl)
    // setIsFetching(false)
  }

  const parseArticleData = (responseJson) => {
    const data = responseJson['data']
    let articleObjects = []

    data.forEach((article) => {

      let articleObject = new Article(article['author'], article['title'], article['url'], article['source'], article['image'], article['published_at'], article['category'])
      articleObjects.push(articleObject)

    });

    setArticles(articleObjects);
  }

  const SetArticlePopups = () => {

    let articlePopupButtons = [];

    const params = {
      articles,
    };

    if (articles !== []) {      

      articles.forEach((article) => {

        articlePopupButtons.push(ArticlePopup(article));
      });

      return <div>{articlePopupButtons}</div>;

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
          <SetArticlePopups></SetArticlePopups>
        </div>
      </header>
    </div>
  )
}

export default App
