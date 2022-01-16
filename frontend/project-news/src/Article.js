class Article {

    constructor(author, title, url, source, image, publishedAt, category, magnitude, dateRange, sentiment) {
        this.author = author;
        this.title = title === undefined ? "No author" : title;
        this.url = url;
        this.source = source;
        this.image = image;
        this.publishedAt = publishedAt;
        this.category = category;
        this.magnitude = magnitude;
        this.dateRange = dateRange;
        this.sentiment = sentiment;
    }
}

export default Article;