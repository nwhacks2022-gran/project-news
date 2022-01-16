class Article {

    constructor(author, title, url, source, image, published_at, category, sentiment) {
        this.author = author;
        this.title = title;
        this.url = url;
        this.source = source;
        this.image = image;
        this.published_at = published_at;
        this.category = category;
        this.sentiment = sentiment;
    }
}

export default Article;