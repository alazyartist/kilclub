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
  review: string;
  jobCategories: Category[];
}

const Posting: React.FC<PostingProps> = ({
  // location,
  // zipcode,
  star_rating,
  date,
  photos,
  review,
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
    <div className="flex-coll -center w-[95vw] max-w-[800px] rounded-lg border-2 border-accent-light bg-base-light text-white">
      <div className="flex-coll w-full border-b-2 border-accent bg-accent-light p-1">
        <span className="w-full text-left text-2xl font-bold">
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
                  width={1000}
                  className="aspect-square h-full w-full rounded-xl object-cover"
                  key={photo}
                  height={1000}
                  quality={100}
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
                  className="aspect-square h-full w-full rounded-xl object-cover"
                  key={photo}
                  width={600}
                  height={600}
                  src={photo}
                  alt={`Photo ${index + 1}`}
                  onClick={() => openImageModal(photo)}
                />
              ))}
        </div>
        {Array.isArray(photos) && photos.length > 3 && (
          <div className="grid grid-cols-4 gap-4">
            {photos.slice(3).map((photo, index) => (
              <Image
                className="aspect-square rounded-xl object-cover"
                key={photo}
                width={100}
                height={100}
                src={photo}
                alt={`Photo ${index + 1}`}
                onClick={() => openImageModal(photo)}
              />
            ))}
          </div>
        )}
      </div>
      {review && (
        <div className="relative w-full p-2">
          {/* <p className="absolute -top-4 rounded-t-md bg-zinc-300 p-2 text-xl font-bold text-zinc-900 mix-blend-darken"> */}
          <p className="w-full rounded-t-md bg-zinc-300 p-2 text-xl font-bold text-zinc-900">
            customer says
          </p>
          <p className="w-full rounded-b-md bg-zinc-300 p-2 text-zinc-900">
            {review}
          </p>
        </div>
      )}

      {selectedImage && (
        <ImageModal imageUrl={selectedImage} onClose={closeImageModal} />
      )}
    </div>
  );
};

export default Posting;
