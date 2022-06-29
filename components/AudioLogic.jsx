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
  }, [states.audio.value]);

  useEffect(() => {
    states.gameButtonReady.set(false);
    const currentVolume = states.volume.value / 100;

    const fadeOutInterval = setInterval(() => {
      if (states.volume.value === 0) {
        audio.current.play();
        clearInterval(fadeOutInterval);
        return;
      }
      try {
        audio.current.volume -= 0.01;
      } catch (e) {
        audio.current.volume = 0;
      }
      if (audio.current.volume === 0) {
        clearInterval(fadeOutInterval);
        const currentTime = audio.current.currentTime;
        audio.current.pause();
        audio.current.load();
        audio.current.currentTime = currentTime;
        if (states.audio.value) {
          states.audio.set(true);
          audio.current.play();
        }
        const fadeInInterval = setInterval(() => {
          try {
            audio.current.volume += 0.01;
          } catch (e) {
            audio.current.volume = currentVolume;
          }
          if (audio.current.volume >= currentVolume) {
            audio.current.volume = currentVolume;
            states.gameButtonReady.set(true);
            clearInterval(fadeInInterval);
          }
        }, 50);
        if (audio.current.volume >= currentVolume) {
          clearInterval(fadeInInterval);
        }
      }
    }, 50);
    return () => {
      clearInterval(fadeOutInterval);
    };
  }, [states.game.value]);

  const doRestart = (e) => {
    audio.current.currentTime = 0;
    audio.current.play();
  };

  return (
    <>
      <audio ref={audio} preload="true" onEnded={doRestart}>
        <source
          src={`/audio/animal_crossing/${states.game.value}/${audioHour}.ogg`}
          type="audio/ogg"></source>
      </audio>
    </>
  );
};

export default AudioLogic;
