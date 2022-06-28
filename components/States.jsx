import { useState, useEffect } from "react";
import { gamecolors } from "./Const";

export const States = () => {
  const [game, setGame] = useState("gc");
  const [audio, setAudio] = useState(false);
  const [date, setDate] = useState(new Date());
  const [transitionActive, transitionActiveSet] = useState(false);
  const [gamecolor, setGameColor] = useState(gamecolors[game]);
  const [volume, setVolume] = useState(20);
  const [backgroundOpacity, backgroundOpacitySet] = useState(0.0);
  const [tweetState, setTweetState] = useState({
    author_image: "/favicon.ico",
    author_name: "",
    tweet: "",
    media: "",
  });
  const [changeGame, setChangeGame] = useState(false);
  const [videoUrl, setVideoUrl] = useState({
    url: "",
    preview_image_url: "/favicon.ico",
  });
  const [gameButtonReady, setGameButtonReady] = useState(true);
  const [focus, setFocus] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);

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
    gameButtonReady: { value: gameButtonReady, set: setGameButtonReady },
    changeGame: { value: changeGame, set: setChangeGame },
    focus: { value: focus, set: setFocus },
    videoEnded: { value: videoEnded, set: setVideoEnded },
  };
  return states;
};

export default States;
