import Image from "next/image";
import Head from "next/head";
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
import { NextSeo } from "next-seo";

const Main = () => {
  const states = States();

  const getTweet = async (currentTweet = "", currentVideo = "") => {
    let tweet = await fetch("api/tweet").then((res) => res.json());
    while (tweet.id === currentTweet || tweet.media === currentVideo) {
      tweet = await fetch("api/tweet").then((res) => res.json());
      break;
    }
    states.tweet.set(tweet[0]);
    states.video.set(tweet[0].media);
  };

  const videoRef = useRef();

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
    scale = Math.min(Math.max(scale, 0.5), 1.5);
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
      y: 0,
    },
  }));

  const [videoSpring, videoSpringApi] = useSpring(() => ({
    config: {
      friction: 15,
    },
    from: {
      rotateZ: 0,
      scale: 1,
      y: 0,
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

  useEffect(() => {
    if (!states.focus.value) {
      videoSpringApi.start({ y: -500, scale: 1 });
      tweetSpringApi.start({ y: 500, scale: 1 });
    } else {
      videoSpringApi.start({ y: 0, scale: 1 });
      tweetSpringApi.start({ y: 0, scale: 1 });
      if (states.videoEnded.value) {
        getTweet();
        states.videoEnded.set(false);
      }
    }
  }, [states.focus.value]);

  useEffect(() => {
    getTweet();
    const mouseOver = (e) => {
      states.focus.set(true);
    };

    const mouseOut = (e) => {
      states.focus.set(false);
    };
    window.addEventListener("mouseover", mouseOver);
    window.addEventListener("mouseout", mouseOut);
    return () => {
      window.removeEventListener("mouseOver", mouseOver);
      window.removeEventListener("mouseout", mouseOut);
    };
  }, []);

  return (
    <>
      <NextSeo
        title="Unofficial Crossing Times"
        description="Listen to relax Animal Crossing music while you work! Bonus: ACNH Tweets!"
      />
      <Head>
        <meta
          property="og:audio"
          content={`/audio/animal_crossing/${
            states.game.value
          }/${new Date().getHours()}.ogg`}
        />
        <meta property="og:image" content="/img/ac.png" />
      </Head>
      <div className="flex justify-center">
        <AudioLogic states={states} />
        <div className="dark:bg-slate-800/80 bg-white/50 w-full h-full fixed"></div>
        <div className="fixed min-w-screen h-screen w-screen object-cover grid z-[-5]">
          <Image
            src="/img/ac.jpg"
            layout="responsive"
            width="100%"
            height="100%"
            alt="bg"
          />
        </div>
        <a.div className="fixed z-10 m-auto bg-[rgb(255,251,236)] dark:bg-[rgb(42,36,55)]/50 w-[250px] h-[250px] top-5 right-20 rounded-[300px] flex justify-center">
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
          className="w-[700px] h-[200px] m-auto left-20 absolute text-center bg-[rgb(255,251,236)] dark:bg-[rgb(42,36,55)]/50 rounded-[500px] top-14">
          <div className="border-none p-8 text-lg font-['Rodin_Pro'] space-x-12">
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
              style={{
                ...style,
              }}
              className={`absolute w-full h-full`}>
              <Video url={i.url} states={states} getTweet={getTweet} />
              <Image
                src={i.preview_image_url}
                className="rounded-3xl -z-50"
                layout="fill"
                alt="lel"
              />
            </a.div>
          ))}
        </a.div>
        <a.div
          style={tweetSpring}
          onMouseEnter={tweetMouseEnter}
          onMouseLeave={tweetMouseLeave}
          className="fixed bottom-20 m-auto left-20 w-[800px] portrait:w-8 h-72">
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
