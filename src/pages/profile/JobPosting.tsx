import React, { useState } from "react";
import ImageModal from "./ImageModal";

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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const toggleLocation = () => {
    setShowLocation((prevShowLocation) => !prevShowLocation);
  };

  const openImageModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="w-[80vw] text-black pl-4 pr-4 flex-coll -center">
      <span
        className="w-full p-1 font-strong text-2xl text-right border-2 border-accent"
        onClick={toggleLocation}
      >
        {showLocation ? zipcode : location}
      </span>
      <div className="w-full flex-row justify-around">
        <span>{star_rating}/5</span>
        <span>{date.toLocaleDateString()}</span>
      </div>
      <div className="w-full flex-coll justify-start overflow-y-auto no-scrollbar gap-4 max-h-[256px]">
        <div className="grid grid-cols-3 grid-rows-2 gap-4">
          {photos.slice(0, 1).map((photo, index) => (
            <img
              key={index}
              height={200}
              src={`./temp_photos/${photo}`}
              alt={`Photo ${index + 1}`}
              style={{ gridColumn: "span 2", gridRow: "span 2" }}
              onClick={() => openImageModal(`./temp_photos/${photo}`)}
            />
          ))}
          {photos.slice(1, 3).map((photo, index) => (
            <img
              key={index}
              width={200}
              height={200}
              src={`./temp_photos/${photo}`}
              alt={`Photo ${index + 1}`}
              onClick={() => openImageModal(`./temp_photos/${photo}`)}
            />
          ))}
        </div>
        <div className="grid grid-cols-4 gap-4">
          {photos.slice(3).map((photo, index) => (
            <img
              key={index}
              width={100}
              height={100}
              src={`./temp_photos/${photo}`}
              alt={`Photo ${index + 1}`}
              onClick={() => openImageModal(`./temp_photos/${photo}`)}
            />
          ))}
        </div>
      </div>

      {/* Render the image modal if an image is selected */}
      {selectedImage && (
        <ImageModal imageUrl={selectedImage} onClose={closeImageModal} />
      )}
    </div>
  );
};

export default Posting;

