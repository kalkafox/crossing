import json
import requests
from requests.auth import HTTPBasicAuth

class TweetSearch:
  def __init__(self):
    self.session = requests.Session()
    self.key = "dUJ2dkpGSTFrZFk2SzJHZUw1TE46MTpjaQ"
    self.secret = "lP-yg-EvE241xn4fXCRCQlkOUrASGJhJFdDW5FbBz_jY_D4Es_"
    self.token = "AAAAAAAAAAAAAAAAAAAAAOyHdwEAAAAAC5lvDzX8%2FwVMaYwQxQ4xBnY7ScI%3D8xrC6ag6wzsm2Nvh1WXGqbTIAnvOgTUW4lCvZwU16RgtiyfWrT"
  
  def test(self):
    print(self.token)
    with open("tweets.json") as f:
      tweet_data = json.loads(f.read())
    self.session.headers["Authorization"] = f"Bearer {self.token}"
    self.session.headers["User-Agent"] = "v2TweetLookup"
    #r = self.session.get("https://api.twitter.com/oauth2/token", data={"grant_type": "client_credentials"}, auth=HTTPBasicAuth(self.key, self.secret))
    next_token = ""
    try:
      until_id = tweet_data['meta']['oldest_id']
    except KeyError:
      until_id = 0
    for i in range(12):
      r = self.session.get(f"https://api.twitter.com/2/tweets/search/recent?query=%23AnimalCrossing%20%23NintendoSwitch%20has%3Ahashtags%20has%3Avideos&max_results=10&expansions=attachments.media_keys,author_id&tweet.fields=attachments,author_id,id,text&media.fields=preview_image_url,variants&user.fields=profile_image_url,username{next_token and f'&next_token={next_token}' or ''}{until_id and f'&until_id={until_id}' or ''}")
      api_tweet_data = r.json()
      print(api_tweet_data)
      media_index = -1
      for key, tweet in enumerate(api_tweet_data['data']):
        if tweet['id'] in [id.get('id') for id in tweet_data['data']]:
          continue
        try:
          tweet_payload = {"data": tweet}
          for m in api_tweet_data['includes']['media']:
            if tweet['attachments']['media_keys'][0] == m['media_key']:
              try:
                for v in m['variants']:
                  if '640x360' in v['url']:
                    tweet_payload["media"] = v
                    tweet_payload["media"]["preview_image_url"] = m["preview_image_url"]
                try:
                  tweet_payload["media"]
                except KeyError:
                  tweet_payload["media"] = m['variants'][0]
                  tweet_payload["media"]["preview_image_url"] = m["preview_image_url"]
              except KeyError:
                print("+++++++++++++++++++",  m)
              break
          for u in api_tweet_data['includes']['users']:
            if tweet['author_id'] == u['id']:
              tweet_payload["user"] = u
              break
          tweet_data["data"].append(tweet_payload)
        except KeyError:
          continue
      next_token = api_tweet_data['meta']['next_token']
      tweet_data['meta'] = api_tweet_data['meta']
      
    with open("tweets.json", "w") as f:
      f.write(json.dumps(tweet_data))


def main():
  ts = TweetSearch()
  ts.test()

main()
