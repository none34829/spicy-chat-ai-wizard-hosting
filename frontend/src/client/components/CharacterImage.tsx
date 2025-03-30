import React, { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface CharacterImageProps {
  imageUrl: string;
  characterName: string;
  style: string;
}

export default function CharacterImage({ imageUrl, characterName, style }: CharacterImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  
  useEffect(() => {
    console.log('CharacterImage component mounted with URL:', imageUrl);
    
    // Reset states when imageUrl changes
    if (imageUrl) {
      setIsLoading(true);
      setImageError(false);
    }
  }, [imageUrl]);
  
  if (!imageUrl) {
    return null;
  }
  
  return (
    <div className="mt-8 p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Generated Image</h3>
      <div className="relative flex justify-center items-center min-h-[200px]">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
            <LoadingSpinner size="large" color="purple" />
          </div>
        )}
        
        {imageError ? (
          <div className="p-4 bg-red-50 text-red-700 rounded-md">
            <p className="font-semibold">Failed to load image.</p>
            <p className="text-sm mt-1">The image URL might be invalid or the server might be blocking cross-origin requests.</p>
            <div className="mt-2 text-xs text-gray-500 break-all">
              URL: {imageUrl}
            </div>
          </div>
        ) : (
          <img 
            key={imageUrl} // Force re-render when URL changes
            src={imageUrl} 
            alt={`${characterName} - ${style}`}
            className="max-w-full h-auto rounded-lg shadow-lg"
            style={{ maxHeight: '512px' }}
            crossOrigin="anonymous"
            onLoad={() => {
              console.log('Image loaded successfully:', imageUrl);
              setIsLoading(false);
            }}
            onError={(e) => {
              console.error('Image failed to load:', imageUrl);
              console.error('Error event:', e);
              setImageError(true);
              setIsLoading(false);
            }}
          />
        )}
      </div>
    </div>
  );
} 