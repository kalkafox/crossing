import { useRef, useEffect, useState } from "react";
import { animated as a, useSpring } from "react-spring";

const AudioLogic = ({ states }) => {
  const audio = useRef();

  const [audioHour, setAudioHour] = useState(states.date.value.getHours());

  // TODO: Implement later, it's too dang hard

  // const [savedVolume, setSavedVolume] = useState(states.volume.value);
  // const [scalar, setScalar] = useState(savedVolume);

  // const scalar_two = states.volume.value;

  // const fadeOut = () => {
  //   if (scalar > 0 && !audio.current.paused) {
  //     scalar_two -= 0.1;
  //     states.volume.set(scalar_two > 0 ? scalar_two : 0);
  //     setScalar(scalar_two);
  //     console.log(states.volume.value);
  //     setTimeout(fadeOut, 0.01);
  //   } else {
  //     audio.current.pause();
  //   }
  // };

  // const fadeIn = () => {
  //   if (scalar < savedVolume && audio.current.paused) {
  //     scalar_two += 0.1;

  //     setScalar(scalar_two);
  //     states.volume.set(scalar_two > 0 ? scalar_two : 0);
  //     setTimeout(fadeIn, 0.001);
  //   }
  // };

  setInterval(() => {
    states.date.set(new Date());
  }, 100);

  useEffect(() => {
    setAudioHour(states.date.value.getHours());
  }, [states.date.value]);

  const audioPause = () => {
    audio.current.pause();
  };
  const audioPlay = () => {
    audio.current.play();
  };
  useEffect(() => {
    audio.current.volume = states.volume.value / 100;
  }, [states.volume.value]);
  useEffect(() => {
    states.audio.value ? audioPlay() : audioPause();
    console.log("lel");
  }, [states.audio.value]);
  useEffect(() => {
    const currentTime = audio.current.currentTime;
    audio.current.pause();
    audio.current.load();
    audio.current.currentTime = currentTime;
    audio.current.play();
    states.audio.set(true);
  }, [states.game.value]);

  const doRestart = (e) => {
    audio.current.currentTime = 0;
    audio.current.play();
  };

  return (
    <>
      <audio ref={audio} autoPlay preload onEnded={doRestart}>
        <source
          src={`/audio/animal_crossing/${states.game.value}/${audioHour}.ogg`}
          type="audio/ogg"></source>
      </audio>
    </>
  );
};

export default AudioLogic;
