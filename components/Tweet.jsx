import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Image from "next/image";

import { faTwitter } from "@fortawesome/free-brands-svg-icons";

import { useState } from "react";

const Tweet = ({ tweet_data }) => {
  const [iconHover, setIconHover] = useState(false);

  return (
    <>
      <div className="bg-[rgb(255,251,236)] dark:bg-[rgb(42,36,55)] text-[rgb(16,16,37)] dark:text-[rgb(216,216,237)] font-['Rodin_Pro'] rounded-t-[850px] rounded-b-[400px] h-content m-auto p-20 text-center">
        <div className="bottom-1 left-40 absolute font-['Rodin_Pro_DB']">
          <a
            className="mx-4"
            href={`https://twitter.com/${tweet_data.author_id}/status/${tweet_data.id}`}
            target="_blank"
            rel="noreferrer"
            onMouseEnter={() => setIconHover(true)}
            onMouseLeave={() => setIconHover(false)}>
            <div className="text-4xl">
              <FontAwesomeIcon
                icon={faTwitter}
                className={`${iconHover && "fa-bounce"}`}
              />
            </div>
            @{tweet_data.author_username}
          </a>
        </div>
        <div className="text-2xl portrait:text-sm text-[#6d5949] dark:text-[rgb(216,216,237)]">
          {tweet_data.text
            .replace(/#\S+/g, "")
            .replace(/(?:https?|ftp):\/\/[\n\S]+/g, "")}
        </div>
      </div>
      <div className="bg-[rgb(214,212,188)] text-[rgb(16,16,37)] dark:text-[rgb(216,216,237)] dark:bg-[rgb(95,88,114)] px-8 py-1 top-2 left-12 absolute text-3xl font-['Rodin_Pro_M'] rounded-3xl">
        <Image
          className="absolute flex-col justify-center items-center align-center rounded-full"
          src={tweet_data.author_image}
          width="40"
          height="40"
          alt="profile"
        />
        <div className="inline mx-4 -top-3 relative portrait:text-sm text-lg font['Rodin_Pro_DB']">
          {tweet_data.author_name}
        </div>
      </div>
    </>
  );
};

export default Tweet;
