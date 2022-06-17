import dynamic from "next/dynamic";
import Image from "next/image";
import React, { useState, useEffect, useMemo } from "react";
import { animated as a, useSpring, useTransition } from "react-spring";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { gamecolors } from "../components/Const";
import Button from "../components/Button";
import AudioLogic from "../components/AudioLogic";
import AudioButton from "../components/AudioButton";

const Index = () => {
  const [game, setGame] = useState("gc");
  const [audio, setAudio] = useState(false);
  const [date, setDate] = useState(new Date());
  const [transitionActive, transitionActiveSet] = useState(false);
  const [gamecolor, setGameColor] = useState(gamecolors[game]);
  const [volume, setVolume] = useState(20);
  const [backgroundOpacity, backgroundOpacitySet] = useState(0.0);

  const states = {
    game: { value: game, set: setGame },
    transition: { value: transitionActive, set: transitionActiveSet },
    gamecolor: { value: gamecolor, set: setGameColor },
    volume: { value: volume, set: setVolume },
    backgroundOpacity: { value: backgroundOpacity, set: backgroundOpacitySet },
    audio: { value: audio, set: setAudio },
    date: { value: date, set: setDate },
  };

  const transitionStopped = () => {
    states.transition.set(false);
  };

  const transition = useTransition(game, {
    config: {
      friction: 15,
    },
    key: game,
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
    setVolume(e.target.value);
    backgroundOpacitySet(e.target.value * 0.005);
  };

  const mouseEnter = (e) => {
    zoomSpringApi.start({ to: { scale: wheelScale + 0.05 } });
    clampScale(wheelScale);
  };

  const mouseLeave = (e) => {
    zoomSpringApi.start({ to: { scale: wheelScale } });
  };

  return (
    <>
      <AudioLogic states={states} />
      <div className="dark:bg-slate-800/80 bg-white/50 w-full h-full fixed"></div>
      <div className="fixed w-full h-full bg-[url('/img/ac.jpg')] bg-cover z-[-5]"></div>
      <a.div
        style={zoomSpring}
        className="fixed z-10 m-auto bg-[#f8f0cd] dark:bg-[#261e7c]/50 border-4 border-[#ebe2ba] dark:border-[#292186] w-[250px] h-[250px] top-5 right-20 rounded-[300px] flex justify-center">
        <div className="w-[284px] h-[284px]">
          <CircularProgressbar
            background={false}
            strokeWidth={4}
            value={volume}
            styles={buildStyles({
              pathTransitionDuration: 0.2,
              pathColor: `rgba(${gamecolor},${50 / 100})`,
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
          backgroundColor: `rgba(${gamecolor},1)`,
          opacity: backgroundOpacity,
        }}
        className="w-full h-full z-[-1] fixed transition-colors"></div>
      <a.div
        style={zoomSpring}
        onWheel={wheelEvent}
        onMouseEnter={mouseEnter}
        onMouseLeave={mouseLeave}
        className="w-[500px] h-[200px] m-auto left-20 absolute text-center bg-[#f8f0cd] dark:bg-[#261f72]/50 border-4 border-[#ebe2ba] dark:border-indigo-800 rounded-[500px] top-14">
        <div className="border-none p-8 text-lg font-['Rodin_Pro'] space-x-4">
          <Button states={states} text="City Folk" game="cf" />
          <Button states={states} text="Wild World" game="ww" />
          <Button states={states} text="GameCube" game="gc" />
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          className="slider form-range appearance-none w-[90%] h-2 p-0 rounded-lg dark:bg-gray-700/50 bg-[#7c6636]/50 cursor-pointer decoration-slate-400 accent-slate-600"
          id="slider"
          step="1"
          onInput={onInput}></input>
        <AudioButton states={states} />
      </a.div>
    </>
  );
};

export default Index;
