import os
import requests
import urllib.parse
import json
from Article import Article

from flask import Flask, jsonify, request
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

@app.route('/hello/', methods=['GET', 'POST'])
def welcome():
    return "Hello World!"

@app.route('/getarticles')
def get_news_articles():
  # request_data = request.data
  # print('request_data: ', request_data) #not gonna work now since there's no frontend
  # request_args = request.args
  # print('request_args: ', request_args) #not gonna work now since there's no frontend

  request_url = 'http://api.mediastack.com/v1/news'
  access_key = os.getenv('MEDIASTACK_API_ACCESS_KEY')
  NUMBER_ARTICLES_LIMIT = 25
  print('access key: ', access_key) 
  
  keywords = 'tennis canada' #TODO: not working with mulitple keywords
  date = '2021-11-12,2021-12-01'

  query = { 
    'access_key': access_key,
    'keywords':  keywords,
    'date': date,
    'limit': NUMBER_ARTICLES_LIMIT,
  } 

  encoded_query = urllib.parse.urlencode(query)
  response = requests.get(request_url, params=encoded_query)
  parsed_articles = parse_articles(response.json())
  #now, use this list of articles to make call to scarpe the article
  return 'Good request!'

def parse_articles(response_json):
  data = response_json['data']
  articles_objects = []

  for article in data:
    article_object = Article(article['author'], article['title'], article['url'],article['source'],article['image'],article['published_at'],article['category'])
    articles_objects.append(article_object)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)