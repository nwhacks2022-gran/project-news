# In The Loop
Live website: https://cra-cloud-run-c46fgbbxta-ue.a.run.app/

This is our project for nwHacks 2022. The application fetches news articles based on the 3 most popular (highest trending) date ranges of the given time range for the given keywords. We analyze the news articles to get a sentiment score.

The website takes in 2 inputs from the users: keywords and a beginning/end date. The application fetches news articles based on the keywords and dates, and with these articles we do a sentiment anaylsis. The results are displayed on the website. The users can view a brief summary of the article and can access the news article page by clicking on the post.

We used several libraries and external APIs in our project, including Article3k (Python), pytrend (Python), and the Google Cloud Natural Language API.

### Technologies used:
Frontend: React.js, JavaScript <br />
Backend: Python, Flask <br />
Deployment: Google Cloud Run, Google Cloud Platform Container Registries

### Screenshots:
<img width="1111" alt="image" src="https://user-images.githubusercontent.com/36147173/149671841-4e02829c-e674-4dcc-8406-ffa6fb9aeb24.png">
<img width="1111" alt="image" src="https://user-images.githubusercontent.com/36147173/149671871-485f8c59-cfc5-4671-a7ec-e83a865ca6ea.png">

