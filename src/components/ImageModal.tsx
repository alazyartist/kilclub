import Image from "next/image";
import React from "react";

interface ImageModalProps {
  imageUrl: string;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, onClose }) => {
  return (
    <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black bg-opacity-60 backdrop-blur-md">
      <button
        className="absolute right-4 top-2 text-2xl text-white"
        onClick={onClose}
      >
        X
      </button>
      <div className="relative p-6">
        <Image
          className="max-h-[95vh] max-w-[95vw] object-contain"
          src={imageUrl}
          alt="Modal"
        />
      </div>
    </div>
  );
};

export default ImageModal;
