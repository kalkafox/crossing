import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTransition, animated as a } from "react-spring";

const AudioButton = ({ states }) => {
  const transitionElements = {
    play: { icon: faPlay },
    pause: { icon: faPause },
  };

  const transition = useTransition(
    states.audio.value
      ? transitionElements.pause.icon
      : transitionElements.play.icon,
    {
      config: {
        friction: 10,
      },
      key: states.audio.value
        ? transitionElements.pause.icon
        : transitionElements.play.icon,
      from: {
        opacity: 0,
        scale: 0.5,
      },
      enter: { opacity: 1, scale: 1 },
      leave: { opacity: 0, scale: 0.5 },
    }
  );

  const setAudio = () => {
    states.audio.value && states.audio.set(false);
    !states.audio.value && states.audio.set(true);
  };
  return (
    <>
      <div>
        <button
          onClick={setAudio}
          className="font-['Rodin_Pro_DB'] dark:text-[rgb(216,216,237)] w-24 h-8 left-0 right-0 m-auto p-2 rounded-3xl absolute bottom-4">
          {transition((style, i) => (
            <a.div style={style} className="absolute right-5 top-1 text-center">
              <FontAwesomeIcon icon={i} />
              {states.audio.value ? " Pause" : " Play"}
            </a.div>
          ))}
        </button>
      </div>
    </>
  );
};

export default AudioButton;
