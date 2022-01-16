import os
import requests
import urllib.parse
import json
from Article import Article

from flask import Flask, jsonify, request
from dotenv import load_dotenv
from flask_cors import CORS

load_dotenv()

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
  #now, use this list of articles to make call to scrape the article
  #return "good request!"
  return 'successfully gotten articles!', 200 

def parse_articles(response_json):
  data = response_json['data']
  articles_objects = []

  for article in data:
    article_object = Article(article['author'], article['title'], article['url'],article['source'],article['image'],article['published_at'],article['category'])
    articles_objects.append(article_object)

  return articles_objects


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)