import React, { useState } from 'react';
import { CharacterData } from '../../types';
import { fetchFromApi } from '../../utils/api';

interface ImageGeneratorProps {
  character: CharacterData;
  onImageGenerated: (imageUrl: string) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setError: (error: string) => void;
  className?: string;
}

const STYLE_OPTIONS = [
  { value: 'realistic portrait', label: 'Realistic Portrait' },
  { value: 'anime style', label: 'Anime Style' },
  { value: 'cartoon', label: 'Cartoon' },
  { value: 'fantasy character', label: 'Fantasy Character' },
  { value: 'oil painting', label: 'Oil Painting' },
  { value: 'watercolor', label: 'Watercolor' },
  { value: 'sketch', label: 'Sketch' },
  { value: 'character portrait', label: 'Character Portrait' },
  { value: 'other', label: 'Other (Custom)' }
];

export default function ImageGenerator({ 
  character, 
  onImageGenerated, 
  setIsGenerating, 
  setError,
  className
}: ImageGeneratorProps) {
  const [selectedStyle, setSelectedStyle] = useState<string>('realistic portrait');
  const [customStyle, setCustomStyle] = useState<string>('');
  const [additionalDetails, setAdditionalDetails] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string>('');
  
  const handleGenerateImage = async () => {
    setIsLoading(true);
    setIsGenerating(true);
    setError('');
    setGeneratedImageUrl('');
    
    try {
      const finalStyle = selectedStyle === 'other' ? customStyle : selectedStyle;
      
      if (selectedStyle === 'other' && !customStyle.trim()) {
        throw new Error('Please enter a custom style description');
      }
      
      const result = await fetchFromApi('/image/generate', {
        method: 'POST',
        body: JSON.stringify({
          characterData: {
            name: character.name,
            title: character.title,
            persona: additionalDetails 
              ? `${character.persona}\n\nAdditional visual details: ${additionalDetails}` 
              : character.persona,
            originalDescription: character.originalDescription || '',
          },
          style: finalStyle,
        }),
      });
      
      console.log('Raw API response:', result);
      console.log('Response type:', typeof result);
      console.log('Response keys:', Object.keys(result));
      console.log('Response stringify:', JSON.stringify(result, null, 2));
      console.log('Result status:', result.status);
      
      if (result.data) {
        console.log('Result data:', result.data);
        console.log('Result data type:', typeof result.data);
        console.log('Result data keys:', Object.keys(result.data));
        
        if (result.data.imageUrl) {
          console.log('Image URL from response:', result.data.imageUrl);
          console.log('Image URL type:', typeof result.data.imageUrl);
        }
      }
      
      if (result.status === 'error') {
        throw new Error(result.message || 'Failed to generate image');
      }
      
      if (!result.data?.imageUrl) {
        console.error('Invalid response format:', result);
        throw new Error('No image URL in response');
      }

      const imageUrl = result.data.imageUrl;
      console.log('Setting image URL:', imageUrl);
      console.log('Image URL length:', imageUrl.length);
      console.log('First 100 chars of URL:', imageUrl.substring(0, 100));
      setGeneratedImageUrl(imageUrl);
      onImageGenerated(imageUrl);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Frontend error when generating image:', error.message);
        setError(error.message);
      } else {
        console.error('Frontend unknown error:', error);
        setError('An unknown error occurred');
      }
    } finally {
      setIsLoading(false);
      setIsGenerating(false);
    }
  };
  
  return (
    <div className={`space-y-4 ${className}`}>
      <h2 className="form-section-title">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Character Details
      </h2>

      <div className="character-details-card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-gray-700 font-medium">Name</label>
              <p className="mt-1 text-lg">{character.name}</p>
            </div>
            <div>
              <label className="text-gray-700 font-medium">Title</label>
              <p className="mt-1 text-lg">{character.title}</p>
            </div>
            <div>
              <label className="text-gray-700 font-medium">Persona</label>
              <p className="mt-1 text-gray-800 whitespace-pre-wrap">{character.persona}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-gray-700 font-medium">Greeting</label>
              <p className="mt-1 text-gray-800 whitespace-pre-wrap">{character.greeting}</p>
            </div>
            <div>
              <label className="text-gray-700 font-medium">Scenario</label>
              <p className="mt-1 text-gray-800 whitespace-pre-wrap">{character.scenario}</p>
            </div>
            <div>
              <label className="text-gray-700 font-medium">Example Conversation</label>
              <div className="mt-1 text-gray-800 space-y-2">
                {Array.isArray(character.exampleConversation) ? (
                  character.exampleConversation.map((exchange, index) => (
                    <div key={index} className="conversation-exchange">
                      <p className="font-medium text-purple-700">User: {exchange.user}</p>
                      <p className="ml-4">{character.name}: {exchange.character}</p>
                    </div>
                  ))
                ) : (
                  <p className="whitespace-pre-wrap">{character.exampleConversation}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <h2 className="form-section-title mt-8">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Generate Character Image
      </h2>
      
      <div className="info-box">
        <p>
          Now that your character details are ready, let's generate an avatar image for them.
          Select a style and add any specific details you want to include in the image.
        </p>
      </div>

      {generatedImageUrl && (
        <div className="mt-8 p-4 bg-white rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Generated Image</h3>
          <div className="relative flex justify-center">
            <img 
              src={generatedImageUrl} 
              alt={`${character.name} - ${selectedStyle}`} 
              className="w-full max-w-md mx-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
      )}
      
      <div className="form-group">
        <label htmlFor="style">Image Style</label>
        <select
          id="style"
          value={selectedStyle}
          onChange={(e) => setSelectedStyle(e.target.value)}
          disabled={isLoading}
        >
          {STYLE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      
      {selectedStyle === 'other' && (
        <div className="form-group">
          <label htmlFor="customStyle">Custom Style Description</label>
          <input
            id="customStyle"
            type="text"
            placeholder="E.g., cyberpunk style, steampunk portrait, etc."
            value={customStyle}
            onChange={(e) => setCustomStyle(e.target.value)}
            disabled={isLoading}
          />
          <p className="help-text">
            Be descriptive to get the best results. Example: "cyberpunk character with neon lighting"
          </p>
        </div>
      )}

      <div className="form-group">
        <label htmlFor="additionalDetails">Additional Image Details (Optional)</label>
        <textarea
          id="additionalDetails"
          rows={3}
          placeholder="Add specific details about how you want the character to appear in the image (e.g., holding a magnifying glass, wearing specific clothing, etc.)"
          value={additionalDetails}
          onChange={(e) => setAdditionalDetails(e.target.value)}
          disabled={isLoading}
        />
        <p className="help-text">
          These details will help create a more accurate representation of your character.
        </p>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleGenerateImage}
          disabled={isLoading || (selectedStyle === 'other' && !customStyle.trim())}
          className="btn btn-primary btn-lg"
        >
          {isLoading ? (
            <span>Generating Image...</span>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="ml-2">Generate Image</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}