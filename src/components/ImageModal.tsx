import React from "react";

interface ImageModalProps {
  imageUrl: string;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, onClose }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center backdrop-blur-md bg-black bg-opacity-60 z-50">
      <button
        className="absolute top-2 right-4 text-white text-2xl"
        onClick={onClose}
      >
        X
      </button>
      <div className="relative p-6">
        <img className="object-contain max-w-[95vw] max-h-[95vh]" src={imageUrl} alt="Modal" />
      </div>
    </div>
  );
};

export default ImageModal;

