import Image from "next/image";
import React, { useState, useEffect, useMemo, useRef } from "react";
import { animated as a, useSpring, useTransition } from "react-spring";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import Button from "./Button";
import gamecolors from "./Const";
import AudioLogic from "./AudioLogic";
import TweetTransitions from "./TweetTransitions";
import AudioButton from "./AudioButton";
import States, { randomTweet } from "./States";
import Video from "./Video";
import Tweet from "./Tweet";

const Main = () => {
  const states = States();
  const videoRef = useRef();

  useEffect(() => {
    const tweet = randomTweet();
    states.tweet.set(tweet);
  }, []);

  const [videoPreview, setVideoPreview] = useState(
    states.tweet.value.media.preview_image_url
  );

  const transitionStopped = () => {
    states.transition.set(false);
  };

  const transition = useTransition(states.game.value, {
    config: {
      friction: 15,
    },
    key: states.game.value,
    from: {
      opacity: 0,
      scale: 0.5,
      x: -900,
    },
    enter: { opacity: 1, scale: 1, x: 0 },
    leave: { opacity: 0, scale: 0.5, x: 300 },
    onRest: transitionStopped,
  });

  const [zoomSpring, zoomSpringApi] = useSpring(() => ({
    config: { friction: 5 },
    scale: 1,
  }));

  const wheelScale = 1;

  const clampScale = (scale) => {
    scale = scale > 1.2 ? 1.2 : scale;
    scale = scale < 0.9 ? 0.9 : scale;
    return scale;
  };

  const wheelEvent = (e) => {
    wheelScale += -e.deltaY / 10000;
    wheelScale = clampScale(wheelScale);
    console.log(wheelScale);
    console.log(wheelScale);
    zoomSpringApi.start({ to: { scale: wheelScale } });
  };

  const onInput = (e) => {
    states.volume.set(e.target.value);
    states.backgroundOpacity.set(e.target.value * 0.005);
  };

  const mouseEnter = (e) => {
    zoomSpringApi.start({ to: { scale: wheelScale + 0.05 } });
    clampScale(wheelScale);
  };

  const mouseLeave = (e) => {
    zoomSpringApi.start({ to: { scale: wheelScale } });
  };

  useEffect(() => {
    const url = states.tweet.value.media.url;
    setVideoPreview(url);
    states.video.set({
      url: url,
      preview_url: states.tweet.value.media.preview_image_url,
    });
  }, [states.tweet.value]);

  const tweetTransition = useTransition(states.tweet.value, {
    key: states.tweet.value,
    config: {
      friction: 20,
    },
    enter: { opacity: 1, scale: 1 },
    from: { opacity: 0.5, scale: 0.8 },
    leave: { opacity: 0, scale: 0.8 },
  });

  const videoTransition = useTransition(states.video.value, {
    key: states.video.value,
    config: {
      friction: 20,
    },
    enter: {
      opacity: 1,
      scale: 1,
    },
    from: {
      opacity: 0.5,
      scale: 0.8,
    },
    leave: {
      opacity: 0,
      scale: 0.8,
    },
  });

  const [tweetSpring, tweetSpringApi] = useSpring(() => ({
    config: {
      friction: 15,
    },
    from: {
      rotateZ: 0,
    },
  }));

  const [videoSpring, videoSpringApi] = useSpring(() => ({
    config: {
      friction: 15,
    },
    from: {
      rotateZ: 0,
      scale: 1,
    },
  }));

  const videoMouseEnter = () => {
    videoSpringApi.start({ rotateZ: 5, scale: 1.1 });
  };

  const videoMouseLeave = () => {
    videoSpringApi.start({ rotateZ: 0, scale: 1 });
  };

  const tweetMouseEnter = () => {
    tweetSpringApi.start({ rotateZ: 5, scale: 1.1 });
  };

  const tweetMouseLeave = () => {
    tweetSpringApi.start({ rotateZ: 0, scale: 1 });
  };

  return (
    <>
      <div className="flex justify-center">
        <AudioLogic states={states} />
        <div className="dark:bg-slate-800/80 bg-white/50 w-full h-full fixed"></div>
        <div className="fixed w-full h-full bg-[url('/img/ac.jpg')] bg-cover z-[-5]"></div>
        <a.div
          style={zoomSpring}
          className="fixed z-10 m-auto bg-[rgb(255,251,236)] dark:bg-[rgb(42,36,55)]/50 w-[250px] h-[250px] top-5 right-20 rounded-[300px] flex justify-center">
          <div className="w-[284px] h-[284px]">
            <CircularProgressbar
              background={false}
              strokeWidth={4}
              value={states.volume.value}
              styles={buildStyles({
                pathTransitionDuration: 0.2,
                pathColor: `rgba(${states.gamecolor.value},${50 / 100})`,
                textColor: "#f88",
              })}
            />
          </div>
          {transition((style, i) => (
            <a.div style={style} className="w-[184px] h-[184px] top-6 absolute">
              <Image
                width="184px"
                height="184px"
                layout="responsive"
                alt="logo"
                src={`/img/${i}_logo.webp`}
              />
            </a.div>
          ))}
        </a.div>
        <div
          style={{
            backgroundColor: `rgba(${states.gamecolor.value},1)`,
            opacity: states.backgroundOpacity.value,
          }}
          className="w-full h-full z-[-1] fixed transition-colors"></div>
        <a.div
          style={zoomSpring}
          onMouseEnter={mouseEnter}
          onMouseLeave={mouseLeave}
          className="w-[600px] h-[200px] m-auto left-20 absolute text-center bg-[rgb(255,251,236)] dark:bg-[rgb(42,36,55)]/50 rounded-[500px] top-14">
          <div className="border-none p-8 text-lg font-['Rodin_Pro'] space-x-8">
            <Button states={states} text="City Folk" game="cf" />
            <Button states={states} text="Wild World" game="ww" />
            <Button states={states} text="GameCube" game="gc" />
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={states.volume.value}
            className="slider form-range appearance-none w-[90%] h-2 p-0 rounded-lg dark:bg-gray-700/50 bg-[#7c6636]/50 cursor-pointer decoration-slate-400 accent-slate-600"
            id="slider"
            step="1"
            onInput={onInput}></input>
          <AudioButton states={states} />
        </a.div>
        <a.div
          style={videoSpring}
          className="absolute top-20 right-96 m-auto text-center w-[640px] h-[360px]"
          onMouseEnter={videoMouseEnter}
          onMouseLeave={videoMouseLeave}>
          {videoTransition((style, i) => (
            <a.div
              style={{ ...style, backgroundImage: i.preview_url }}
              className={`absolute`}>
              <Video url={i.url} states={states} />
            </a.div>
          ))}
        </a.div>
        <a.div
          style={tweetSpring}
          onMouseEnter={tweetMouseEnter}
          onMouseLeave={tweetMouseLeave}
          className="absolute m-auto bottom-20 left-20 w-[800px] h-72">
          {tweetTransition((style, i) => (
            <a.div style={style} className="absolute">
              <Tweet tweet_data={i} />
            </a.div>
          ))}
        </a.div>
      </div>
    </>
  );
};

export default Main;
