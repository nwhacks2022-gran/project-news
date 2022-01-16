class Article(object):

    def __init__(self, author, title, url, source, image, published_at, category, date_range):
        self.author = author
        self.title = title
        self.url = url
        self.source = source
        self.image = image
        self.published_at = published_at
        self.category = category
        self.date_range = date_range
        self.sentiment = 0  # initially it's 0
        self.magnitude = 0

    def article_to_json(article):
        return {
            'author': article.author,
            'title': article.title,
            'url': article.url,
            'source': article.source,
            'image': article.image,
            'published_date': article.published_at,
            'category': article.category,
            'date_range': article.date_range,
            'sentiment': article.sentiment,
            'magnitude': article.magnitude
        }

    def set_sentiment(self, sentiment):
        self.sentiment = sentiment
    
    def set_magnitude(self, magnitude):
        self.magnitude = magnitude

    """
    mock data object for development
        {
           "author":null,
           "title":"Daniil Medvedev advances to debut Australian Open final with dominant win over Stefanos Tsitsipas",
           "description":"Daniil Medvedev produced an impressive display against world No. 6 Stefanos Tsitsipas to advance to the final of the Australian Open.",
           "url":"http://rss.cnn.com/~r/rss/edition_tennis/~3/TAY2kwpOFbs/index.html",
           "source":"CNN Tennis",
           "image":"https://cdn.cnn.com/cnnnext/dam/assets/210219101515-03-aus-open-0219-daniil-medvedev-super-169.jpg",
           "published_at":"2021-04-19T17:05:31+00:00",
           "category":"sports",
           "date_range": "2021-01-01, 2021-02-02",
           "sentiment": "0"
        }
    """
