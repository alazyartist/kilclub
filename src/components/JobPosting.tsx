import React, { useState } from "react";
import ImageModal from "./ImageModal";
import type { Category } from "@prisma/client";
import Image from "next/image";

interface PostingProps {
  location?: string;
  zipcode: string;
  star_rating: number;
  date: Date;
  photos: string[];
  jobCategories: Category[];
}

const Posting: React.FC<PostingProps> = ({
  // location,
  // zipcode,
  star_rating,
  date,
  photos,
  jobCategories,
}) => {
  // const [showLocation, setShowLocation] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // const toggleLocation = () => {
  //   setShowLocation((prevShowLocation) => !prevShowLocation);
  // };

  const openImageModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="flex-coll -center w-[95vw] max-w-[800px] rounded-lg border-2 border-accent bg-base-light text-white">
      <div className="flex-coll font-strong w-full border-b-2 border-accent bg-accent p-1">
        <span className="w-full text-center text-2xl font-bold">
          {jobCategories.map((j) => j.name)}
        </span>
        <div className="w-full flex-row justify-around text-lg">
          <span>{star_rating}/5</span>
          <span>{date && date.toDateString()}</span>
        </div>
      </div>

      <div className="flex-coll minimalistScroll max-h-[460px] w-full  justify-start gap-4 overflow-y-auto p-2">
        <div className="grid grid-cols-3 grid-rows-2 gap-4">
          {Array.isArray(photos) &&
            photos
              .slice(0, 1)
              .map((photo, index) => (
                <Image
                  width={200}
                  className="aspect-square object-cover"
                  key={photo}
                  height={200}
                  src={photo}
                  alt={`Photo ${index + 1}`}
                  style={{ gridColumn: "span 2", gridRow: "span 2" }}
                  onClick={() => openImageModal(photo)}
                />
              ))}
          {Array.isArray(photos) &&
            photos
              .slice(1, 3)
              .map((photo, index) => (
                <Image
                  className="aspect-square object-cover"
                  key={photo}
                  width={200}
                  height={200}
                  src={photo}
                  alt={`Photo ${index + 1}`}
                  onClick={() => openImageModal(photo)}
                />
              ))}
        </div>
        <div className="grid grid-cols-4 gap-4">
          {Array.isArray(photos) &&
            photos
              .slice(3)
              .map((photo, index) => (
                <Image
                  className="aspect-square object-cover"
                  key={photo}
                  width={100}
                  height={100}
                  src={photo}
                  alt={`Photo ${index + 1}`}
                  onClick={() => openImageModal(photo)}
                />
              ))}
        </div>
      </div>

      {selectedImage && (
        <ImageModal imageUrl={selectedImage} onClose={closeImageModal} />
      )}
    </div>
  );
};

export default Posting;
