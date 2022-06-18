import { useState } from "react";
import { gamecolors } from "./Const";
import tweets from "./tweets.json";

export const randomTweet = (currentTweet = "", currentVideo = "") => {
  let tweet = tweets["data"][Math.floor(Math.random() * tweets["data"].length)];
  while (currentTweet === tweet.data.id || currentVideo === tweet.media.url) {
    tweet = tweets["data"][Math.floor(Math.random() * tweets["data"].length)];
  }
  return tweet;
};

export const States = () => {
  const [game, setGame] = useState("gc");
  const [audio, setAudio] = useState(false);
  const [date, setDate] = useState(new Date());
  const [transitionActive, transitionActiveSet] = useState(false);
  const [gamecolor, setGameColor] = useState(gamecolors[game]);
  const [volume, setVolume] = useState(20);
  const [backgroundOpacity, backgroundOpacitySet] = useState(0.0);
  const [tweetState, setTweetState] = useState(tweets["data"][0]);
  const [videoUrl, setVideoUrl] = useState({
    url: tweetState.media.url,
    preview_url: tweetState.media.preview_image_url,
  });
  const states = {
    game: { value: game, set: setGame },
    transition: { value: transitionActive, set: transitionActiveSet },
    gamecolor: { value: gamecolor, set: setGameColor },
    volume: { value: volume, set: setVolume },
    backgroundOpacity: { value: backgroundOpacity, set: backgroundOpacitySet },
    audio: { value: audio, set: setAudio },
    date: { value: date, set: setDate },
    tweet: { value: tweetState, set: setTweetState },
    video: { value: videoUrl, set: setVideoUrl },
  };
  return states;
};

export default States;
