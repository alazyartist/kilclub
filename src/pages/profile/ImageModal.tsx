import React from "react";

interface ImageModalProps {
  imageUrl: string;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, onClose }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div className="relative p-6">
        <img src={imageUrl} alt="Modal" />
        <button
          className="absolute top-2 right-2 text-white text-2xl"
          onClick={onClose}
        >
          X
        </button>
      </div>
    </div>
  );
};

export default ImageModal;

