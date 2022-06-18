import { randomTweet } from "./States";

const Video = ({ url, states }) => {
  const videoEnded = () => {
    states.tweet.set(randomTweet(states.tweet.value, states.video.value));
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
