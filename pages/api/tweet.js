const { MongoClient } = require("mongodb");

const apiData = {
  token: "",
  mongoURI: "mongodb://127.0.0.1/crossing?retryWrites=true&w=majority",
};

const getClient = async () => {
  const client = new MongoClient(apiData.mongoURI);
  await client.connect();
  return client;
};

let timestamp = new Date().getTime() / 1000;

const pollTweets = async () => {
  console.log("ayo");
  const time = new Date().getTime() / 1000;
  if (time < timestamp) {
    console.log(`waiting... ${timestamp - time} seconds left`);
    return;
  }
  timestamp = time + 1500;

  const client = await getClient();
  const db = client.db("crossing");
  const collection = db.collection("tweets");
  const meta = db.collection("meta");
  const api = db.collection("api");

  const tweetApiData = await api.findOne();

  apiData.token = tweetApiData.token;

  const meta_record = await meta.findOne();

  let next_token = "";
  let until_id = "";

  for (let i = 0; i < 10; i++) {
    let duplicates = 0;
    let tweets = {};
    console.log("fetching... " + i);

    if (next_token === undefined) {
      next_token = "";
      until_id = "";
    }

    const url = `https://api.twitter.com/2/tweets/search/recent?query=%23AnimalCrossing%20%23NintendoSwitch%20has%3Ahashtags%20has%3Avideos%20lang%3Aen%20-is%3Aretweet&sort_order=relevancy&max_results=100&expansions=attachments.media_keys,author_id&tweet.fields=attachments,author_id,id,text&media.fields=preview_image_url,variants&user.fields=profile_image_url,username${
      next_token != 0 ? `&next_token=${next_token}` : ""
    }`; //`${until_id != 0 ? `&until_id=${until_id}` : ""}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiData.token}`,
      },
    });
    const data = await response.json();

    next_token = data.meta.next_token;
    until_id = data.meta.oldest_id;

    for (const tweet of data.data) {
      const existingTweet = await collection.findOne({ id: tweet.id });
      if (existingTweet != null) {
        duplicates++;
        continue;
      }

      if (tweet.attachments == null) {
        // no video? no dice
        continue;
      }

      tweets[tweet.id] = {
        id: tweet.id,
        text: tweet.text,
        author_id: tweet.author_id,
        attachments: tweet.attachments,
      };

      for (const attachment of data.includes.media) {
        for (const variant of attachment.variants) {
          if (
            // our way of getting 1280x720 videos
            attachment.media_key ===
              tweets[tweet.id].attachments.media_keys[0] &&
            variant.bit_rate === 2176000
          ) {
            // verify that the video actually works before we push to the stack (basically confirm that the data is valid)
            tweets[tweet.id].media = {
              url: variant.url,
              preview_image_url: attachment.preview_image_url,
            };
          }
        }
      }

      for (const user of data.includes.users) {
        if (user.id === tweets[tweet.id].author_id) {
          tweets[tweet.id].author_image = user.profile_image_url;
          tweets[tweet.id].author_username = user.username;
          tweets[tweet.id].author_name = user.name;
        }
      }
    }

    await meta.updateOne(
      {},
      {
        $set: {
          last_id: data.meta.oldest_id,
          next_token: data.meta.next_token,
        },
      }
    );

    const tweetCount = Object.keys(tweets).length;

    console.log(
      `Saving tweets to database... (${tweetCount} tweet${
        tweetCount != 1 ? "s" : ""
      }) (found ${duplicates} duplicate${duplicates != 1 ? "s" : ""})`
    );
    if (tweetCount > 0) {
      await collection.insertMany(Object.values(tweets));
    } else {
      console.log("No new tweets found.");
    }
  }

  await client.close();
};

const getTweet = async () => {
  const client = await getClient();
  const db = client.db("crossing");
  const collection = db.collection("tweets");

  const tweet = await collection
    .aggregate([{ $sample: { size: 1 } }])
    .toArray();
  // remember to close the client each time we use mongodb
  await client.close();
  return tweet;
};

export const handler = async (req, res) => {
  pollTweets();

  const tweet = await getTweet();

  res.status(200).json(tweet);
};

export default handler;
