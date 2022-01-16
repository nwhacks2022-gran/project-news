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
            'published_at': article.published_at,
            'category': article.category,
            'date_range': article.date_range,
            'sentiment': article.sentiment,
            'magnitude': article.magnitude
        }

    def set_sentiment(self, sentiment):
        self.sentiment = sentiment
    
    def set_magnitude(self, magnitude):
        self.magnitude = magnitude
