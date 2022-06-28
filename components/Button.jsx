import { animated as a, useSpring } from "react-spring";
import { useEffect } from "react";
import { gamecolors } from "../components/Const";

const Button = ({ states, text, game }) => {
  const [buttonSpring, buttonApi] = useSpring(() => ({
    config: { friction: 5 },
    scale: 1,
    rotateZ: 0,
  }));
  const buttonClick = (selectedGame) => {
    states.transition.set(true);
    states.game.set(selectedGame);
    states.gamecolor.set(gamecolors[selectedGame]);
  };

  useEffect(() => {
    states.game.value === game
      ? buttonApi.start({ scale: 1.3, rotateZ: 0 })
      : buttonApi.start({ scale: 1, rotateZ: 0 });
  }, [states.game.value]);

  const buttonMouseEnter = () => {
    buttonApi.start({ scale: 1.2, rotateZ: 5 });
  };

  const buttonMouseLeave = () => {
    states.game.value != game && buttonApi.start({ scale: 1, rotateZ: 0 });
  };

  return (
    <a.button
      style={buttonSpring}
      onMouseEnter={buttonMouseEnter}
      onMouseLeave={() => {
        buttonMouseLeave(game);
      }}
      disabled={!states.gameButtonReady.value || game === states.game.value}
      className="text-[#7D6839] dark:text-[rgb(216,216,237)] dark:bg-[rgb(42,36,55)] p-4 rounded-3xl bg-[#feed9f]"
      type="button"
      onClick={() => buttonClick(game)}>
      {text}
    </a.button>
  );
};

export default Button;
