import os
import requests
import urllib.parse
import json

from Article import Article
from newspaper import Article as Article3k

from flask import Flask, jsonify, request
# from dotenv import load_dotenv
from flask_cors import CORS

from pytrends.request import TrendReq

# load_dotenv()

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route('/hello/', methods=['GET', 'POST'])
def welcome():
    return "hello!"


@app.route('/getarticles')
def get_news_articles():
  request_args = request.args

  request_url = 'http://api.mediastack.com/v1/news'
  access_key = os.getenv('MEDIASTACK_API_ACCESS_KEY')
  NUMBER_ARTICLES_LIMIT = 25
  
  keywords = request_args['keywords'] #TODO: not working with mulitple keywords
  print('keywords: ', keywords)
  date = request_args['date']
  print('date: ', date)  

  query = { 
    'access_key': access_key,
    'keywords':  keywords,
    'date': date,
    'limit': NUMBER_ARTICLES_LIMIT,
  } 

  encoded_query = urllib.parse.urlencode(query)
  response = requests.get(request_url, params=encoded_query)
  parsed_articles = parse_articles(response.json())
  #TODO: error handlings
  #now, use this list of articles to make call to scrape the article
  #return "good request!"
  return response.json(), 200

def parse_articles(response_json):
    data = response_json['data']
    articles_objects = []

    for article in data:
        article_object = Article(article['author'], article['title'], article['url'],article['source'],article['image'],article['published_at'],article['category'])
        articles_objects.append(article_object)

    for articleObj in articles_objects:
        # grab article text using newspaper3k
        web_article = Article3k(articleObj.url)
        web_article.download()
        web_article.parse()
        sentiment_score = calculate_sentiment(web_article.text)
        articleObj.set_sentiment(sentiment_score)

    return 'Good job!'


def calculate_sentiment(url):
    # make call to google cloud
    return 0.2


def get_google_trends(keywords, dates):
    """

    :param keywords:
    :param dates: 'YYYY-MM-DD, YYYY_MM-DD'
    :return:
    """

    timeframe = dates.replace(',', ' ')
    print(timeframe)

    py_trends = TrendReq(hl='en-US', tz=360)
    py_trends.build_payload(keywords, cat=0, timeframe=timeframe, geo='', gprop='')
    trends_df = py_trends.interest_over_time()
    trends_df = trends_df.drop(columns='isPartial')
    return trends_df.to_json()


if __name__ == '__main__':
    print(get_google_trends(['bitcoin'], '2022-01-01,2022-01-12'))
    # app.run(host='0.0.0.0', port=5000)
