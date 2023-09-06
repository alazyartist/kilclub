import React, { useState } from "react";

interface PostingProps {
  location: string;
  zipcode: number;
  star_rating: number;
  date: Date;
  jobid?: number;
}

const Posting: React.FC<PostingProps> = ({
  location,
  zipcode,
  star_rating,
  date,
  jobid,
}) => {
  const [showLocation, setShowLocation] = useState(true);

  const toggleLocation = () => {
    setShowLocation((prevShowLocation) => !prevShowLocation);
  };

  return (
    <div className=" w-[80vw] max-h-[20vh] bg-base-light text-black pl-4 pr-4 rounded-lg flex-coll -center">
      <span
        className="w-full p-1 font-strong text-2xl text-right border-2 border-accent "
        onClick={toggleLocation}
      >
        {showLocation ? zipcode : location}
      </span>
      <div className="w-full flex-row justify-around">
        <span>{star_rating}/5</span>
        <span>{date.toLocaleDateString()}</span>
      </div>
      {/* Rest of your component code */}
    </div>
  );
};

export default Posting;

