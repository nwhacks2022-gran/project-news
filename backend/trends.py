from pytrends.request import TrendReq
from utils import timestamp_to_string


def get_google_trends(keywords, dates):
    """

    :param keywords: lst of keywords
    :param dates: 'YYYY-MM-DD, YYYY_MM-DD'
    :return:
    """
    if type(keywords) != list:
        keywords = [keywords]

    timeframe = dates.replace(',', ' ')
    py_trends = TrendReq(hl='en-US', tz=360)
    py_trends.build_payload(keywords, cat=0, timeframe=timeframe, geo='', gprop='')
    trends_df = py_trends.interest_over_time()
    trends_df = trends_df.drop(columns='isPartial')

    return trends_df


def dates_delta(day, next_day):
    return next_day - day


def get_top_k_dates(trends_df, k=3):
    keyword = trends_df.columns[0]
    sorted_trends_df = trends_df.sort_values(keyword, ascending=False)
    top_k_days = sorted_trends_df.head(k)
    date_delta = dates_delta(trends_df.index[0], trends_df.index[1])

    top_dates = []
    for start_date in top_k_days.index:
        date_str = timestamp_to_string(start_date) + ',' + timestamp_to_string(start_date + date_delta)
        top_dates.append(date_str)

    return top_dates


if __name__ == '__main__':
    df = get_google_trends(['bitcoin'], '2021-01-01,2022-01-12')
    print(get_top_k_dates(df, k=3))

