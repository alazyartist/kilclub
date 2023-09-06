import React, { useState } from "react";

interface PostingProps {
  location: string;
  zipcode: number;
  star_rating: number;
  date: Date;
  photos: string[];
}

const Posting: React.FC<PostingProps> = ({
  location,
  zipcode,
  star_rating,
  date,
  photos,
}) => {
  const [showLocation, setShowLocation] = useState(true);

  const toggleLocation = () => {
    setShowLocation((prevShowLocation) => !prevShowLocation);
  };

  return (
    <div className="w-[80vw] max-h-[20vh] bg-base-light text-black pl-4 pr-4 flex-coll -center">
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
      <div className="w-full flex-row justify-center overflow-auto">
        {photos.map((photo, index) => (
          <img
            key={index} // Use a unique key for each photo
            width={100}
            height={100}
            src={`./temp_photos/${photo}`} // Replace 'temp_photos' with your actual photo path
            alt={`Photo ${index + 1}`}
            style={{ maxWidth: "100%", height: "auto" }} // Adjust the style as needed
          />
        ))}
      </div>
    </div>
  );
};

export default Posting;

