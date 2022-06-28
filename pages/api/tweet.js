const { MongoClient } = require("mongodb");

const apiData = {
  token: "",
  mongoURI: "mongodb://127.0.0.1:27017/crossing?retryWrites=true&w=majority",
};

const getClient = async () => {
  const client = new MongoClient(apiData.mongoURI);
  await client.connect();
  return client;
};

let timestamp = new Date().getTime() / 1000;

const pollTweets = async () => {
  const time = new Date().getTime() / 1000;
  if (time < timestamp) {
    console.log(`waiting... ${timestamp - time} seconds left`);
    return;
  }
  timestamp = time + 10;

  const client = await getClient();
  const db = client.db("crossing");
  const collection = db.collection("tweets");
  const meta = db.collection("meta");

  const meta_record = await meta.findOne();

  let next_token = meta_record.next_token || "";
  let until_id = meta_record.until_id || 0;

  for (let i = 0; i < 10; i++) {
    console.log("fetching... " + i);

    console.log(next_token);

    const url = `https://api.twitter.com/2/tweets/search/recent?query=%23AnimalCrossing%20%23NintendoSwitch%20has%3Ahashtags%20has%3Avideos&max_results=100&expansions=attachments.media_keys,author_id&tweet.fields=attachments,author_id,id,text&media.fields=preview_image_url,variants&user.fields=profile_image_url,username${
      next_token ? `&next_token=${next_token}` : ""
    }${until_id != 0 ? `&until_id=${until_id}` : ""}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiData.token}`,
      },
    });
    const data = await response.json();

    next_token = data.meta.next_token;
    until_id = data.meta.oldest_id;

    let tweets = {};

    let duplicates = 0;

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
            attachment.media_key ===
              tweets[tweet.id].attachments.media_keys[0] &&
            variant.bit_rate === 2176000
          ) {
            tweets[tweet.id].media = variant.url;
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
    console.log(
      `Saving tweets to database... (found ${duplicates} duplicate${
        duplicates != 1 ? "s" : ""
      })`
    );
    if (Object.keys(tweets).length > 0) {
      await collection.insertMany(Object.values(tweets));
    } else {
      console.log("No new tweets found.");
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
  return tweet;
};

export const handler = async (req, res) => {
  //pollTweets();

  const tweet = await getTweet();

  res.status(200).json(tweet);
};

export default handler;
