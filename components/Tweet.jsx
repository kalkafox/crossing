const Tweet = ({ tweet_data }) => {
  return (
    <>
      <div className="bg-[rgb(255,251,236)] dark:bg-[rgb(42,36,55)] text-[rgb(16,16,37)] dark:text-[rgb(216,216,237)] font-['Rodin_Pro'] rounded-t-[850px] rounded-b-[400px] h-content m-auto p-20 text-center">
        <div className="bottom-1 left-40 absolute font-['Rodin_Pro_M']">
          <a
            href={`https://twitter.com/${tweet_data.user.id}/status/${tweet_data.data.id}`}
            target="_blank"
            rel="noreferrer">
            @{tweet_data.user.username}
          </a>{" "}
          via Twitter
        </div>
        <div className="text-2xl">
          {tweet_data.data.text.replace("&lt; ", "\n")}
        </div>
      </div>
      <div className="bg-[rgb(214,212,188)] text-[rgb(16,16,37)] dark:text-[rgb(216,216,237)] dark:bg-[rgb(95,88,114)] px-8 py-1 top-2 left-12 absolute text-3xl font-['Rodin_Pro_M'] rounded-3xl">
        <img
          className="w-8 h-8 absolute flex-col justify-center items-center align-center rounded-3xl"
          src={tweet_data.user.profile_image_url}
        />
        <div className="inline-block px-12">{tweet_data.user.name}</div>
      </div>
    </>
  );
};

export default Tweet;
