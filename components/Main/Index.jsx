import dynamic from "next/dynamic";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { animated as a } from "react-spring";
import { useTransition } from "react-spring";

const Index = () => {
  const games = ["gc", "ww", "cf"];
  const [game, setGame] = useState("gc");

  const transition = useTransition(game, {
    from: {
      opacity: 0,
      scale: 1,
    },
    enter: { opacity: 1, scale: 1.2 },
    leave: { opacity: 0, scale: 1 },
  });

  const buttonClick = () => {
    let rand_game = games[Math.floor(Math.random() * games.length)];
    while (rand_game === game) {
      rand_game = games[Math.floor(Math.random() * games.length)];
    }
    setGame(rand_game);
  };

  return (
    <div className="bg-black h-full">
      <div className="fixed w-20 h-20 z-30">
        <button onClick={buttonClick} type="button" className="z-30">
          test2
        </button>
      </div>
    </div>
  );
};

export default Index;
