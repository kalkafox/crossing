import { randomTweet } from "./States";

const Video = ({ url, states, getTweet }) => {
  console.log(url);
  const videoEnded = () => {
    if (states.focus.value) {
      getTweet();
    }
    states.videoEnded.set(true);
  };
  return (
    <video
      className="rounded-3xl overflow-hidden"
      muted
      autoPlay
      preload="true"
      onEnded={videoEnded}>
      <source src={url} type="video/mp4"></source>
    </video>
  );
};

export default Video;
