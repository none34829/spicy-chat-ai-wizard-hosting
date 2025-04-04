import React, { useState } from 'react';
import { CharacterData } from '../../types';
import { fetchFromApi } from '../../utils/api';

interface CharacterFormProps {
  onGenerate: (character: CharacterData) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setError: (error: string) => void;
  className?: string;
}

export default function CharacterForm({ onGenerate, setIsGenerating, setError, className }: CharacterFormProps) {
  const [description, setDescription] = useState<string>('');
  const [relationship, setRelationship] = useState<string>('');
  const [url, setUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUrlValid, setIsUrlValid] = useState<boolean>(true);
  
  const validateUrl = (value: string) => {
    if (!value) {
      setIsUrlValid(true);
      return;
    }
    
    try {
      new URL(value);
      setIsUrlValid(true);
    } catch {
      setIsUrlValid(false);
    }
  };
  
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUrl(value);
    validateUrl(value);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!description.trim()) {
      setError('Please provide a character description');
      return;
    }

    if (!relationship.trim()) {
      setError('Please specify your relationship with the character');
      return;
    }
    
    if (url && !isUrlValid) {
      setError('Please provide a valid URL or leave the field empty');
      return;
    }
    
    setIsLoading(true);
    setIsGenerating(true);
    setError('');
    
    try {
      console.log("Sending character data:", { description, relationship, url: url.trim() || undefined });
      
      const result = await fetchFromApi('/character/generate', {
        method: 'POST',
        body: JSON.stringify({
          description,
          relationship,
          url: url.trim() || undefined,
        }),
      });
      
      console.log("Character generation result:", result);
      
      if (result.status === 'error') {
        throw new Error(result.message || 'Failed to generate character');
      }
      if (result.status === 'success' && result.data) {
        onGenerate(result.data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error generating character:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      setIsLoading(false);
      setIsGenerating(false);
      return;
    } finally {
      setIsLoading(false);
      setIsGenerating(false);
    }
  };
  
  return (
    <div>
      <h2 className="form-section-title">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        Character Details
      </h2>
      
      <form onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(e);
      }}>
        <div className="form-group">
          <label htmlFor="description">Character Description*</label>
          <textarea
            id="description"
            rows={5}
            placeholder="Describe your character in detail. The more information you provide, the better the result will be."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            disabled={isLoading}
          ></textarea>
          <p className="help-text">
            Example: "A wise old wizard who specializes in fire magic. He is kind but stern, and has a soft spot for teaching young mages."
          </p>
        </div>
        
        <div className="form-group">
          <label htmlFor="relationship">Your Relationship with the Character*</label>
          <input
            type="text"
            id="relationship"
            placeholder="How do you know this character? (e.g., 'old friends from college', 'my mentor', 'regular customers at the same café')"
            value={relationship}
            onChange={(e) => setRelationship(e.target.value)}
            required
            disabled={isLoading}
          />
          <p className="help-text">
            This will help set the tone for your interactions with the character.
          </p>
        </div>
        
        <div className="form-group">
          <label htmlFor="url">Reference URL (Optional)</label>
          <input
            type="url"
            id="url"
            placeholder="https://example.com/reference-content"
            value={url}
            onChange={handleUrlChange}
            disabled={isLoading}
          />
          <p className="help-text">
            You can provide a URL to a webpage that contains additional information about your character.
          </p>
        </div>
        
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isLoading || !description.trim() || !relationship.trim() || (url.trim() !== '' && !isUrlValid)}
            className="btn btn-primary btn-lg"
          >
            {isLoading ? (
              <span>Generating...</span>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Generate Character
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}