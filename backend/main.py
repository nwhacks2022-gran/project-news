import os
import requests
import urllib.parse
import json
from Article import Article
from newspaper import Article as Article3k
from flask import Flask, jsonify, request
from dotenv import load_dotenv
from flask_cors import CORS
from trends import get_google_trends, get_top_k_dates

load_dotenv()

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route('/hello/', methods=['GET', 'POST'])
def welcome():
    return "hello!"


@app.route('/get/trends')
def get_trends():
    request_args = request.args
    keywords = request_args['keywords']
    date = request_args['date']
    trends_df = get_google_trends(keywords, date)
    top_k_dates = get_top_k_dates(trends_df, k=3)
    trends_df.index = trends_df.index.strftime('%Y-%m-%d')
    trends_json = json.loads(trends_df.to_json())
    trends_json.update({'top_dates': top_k_dates})

    return trends_json, 200


@app.route('/getarticles')
def get_news_articles():
  request_args = request.args

  request_url = 'http://api.mediastack.com/v1/news'
  access_key = os.getenv('MEDIASTACK_API_ACCESS_KEY')

  NUMBER_ARTICLES_LIMIT = 5
  LANGUAGES = 'en'
  SORT = 'popularity'
  
  keywords = request_args['keywords'] #TODO: not working with mulitple keywords
  print('keywords: ', keywords)
  date = request_args['date']
  print('date: ', date)  

  query = { 
    'access_key': access_key,
    'keywords':  keywords,
    'date': date,
    'limit': NUMBER_ARTICLES_LIMIT,
    'languges': LANGUAGES,
    'sort': SORT
  }

  encoded_query = urllib.parse.urlencode(query)
  response = requests.get(request_url, params=encoded_query)
  return parse_articles(response.json(), date), 200
  #TODO: error handlings

def parse_articles(response_json, date):
    data = response_json['data']
    articles_objects = []

    for article in data:
        article_object = Article(article['author'], article['title'], article['url'],article['source'],article['image'],article['published_at'],article['category'], date)
        articles_objects.append(article_object)

    jsonObjects = []

    for articleObj in articles_objects:
        # grab article text using newspaper3k
        web_article = Article3k(articleObj.url)
        web_article.download()
        web_article.parse()
        sentiment = calculate_sentiment(web_article)
        articleObj.set_sentiment(sentiment['score'])
        articleObj.set_magnitude(sentiment['magnitude']) 
        jsonObjects.append(Article.article_to_json(articleObj))

    finalJson = {
      'data': jsonObjects
    }

    return json.dumps(finalJson)


def calculate_sentiment(article):
  # make call to google cloud
  gapi_key = os.getenv('GOOGLE_API_ACCESS_KEY')
  gcloudUrl = 'https://language.googleapis.com/v1beta2/documents:analyzeSentiment?key=' + gapi_key
  params = {
      "document": {
        "type": "PLAIN_TEXT",
        "language": "en",
        "content": article.text
      } 
    }

  response = requests.post(gcloudUrl, json=params)
  sentiment = json.loads(response.content)['documentSentiment']
  
  return sentiment


if __name__ == '__main__':
    #app.run(host='0.0.0.0', port=5000)
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))