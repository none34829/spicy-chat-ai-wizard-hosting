import React, { useState, useEffect, useRef } from 'react';
import CharacterForm from './components/CharacterForm';
import CharacterPreview from './components/CharacterPreview';
import ImageGenerator from './components/ImageGenerator';
import Modal from './components/Modal';
import { CharacterData } from '../types';


export default function App() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [characterData, setCharacterData] = useState<CharacterData | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const progressLineRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (progressLineRef.current && stepRefs.current[activeStep - 1]) {
      const progressLine = progressLineRef.current;
      const activeStepElement = stepRefs.current[activeStep - 1];
      
      if (activeStepElement) {
        const targetWidth = activeStepElement.offsetLeft + activeStepElement.offsetWidth / 2;
        progressLine.style.width = `${targetWidth}px`;
      }
    }
  }, [activeStep]);

  // Reset isGenerating when changing steps
  useEffect(() => {
    setIsGenerating(false);
  }, [activeStep]);
  
  const handleCharacterGenerated = (data: CharacterData) => {
    setCharacterData(data);
    setActiveStep(2);
    setError('');
    setIsGenerating(false);
  };
  
  const handleImageGenerated = (url: string) => {
    const scrollPosition = window.scrollY;
    
    setImageUrl(url);
    setActiveStep(3);
    setError('');
    setIsGenerating(false);
    
    requestAnimationFrame(() => {
      window.scrollTo({
        top: scrollPosition,
        behavior: 'smooth'
      });
    });
  };
  
  const handleBack = () => {
    if (activeStep > 1) {
      // Store current scroll position
      const scrollPosition = window.scrollY;
      
      // just clear the image URL but keep the character data
      if (activeStep === 3) {
        setImageUrl('');
      }
      
      setActiveStep(activeStep - 1);
      setIsGenerating(false);
      
      requestAnimationFrame(() => {
        window.scrollTo({
          top: scrollPosition,
          behavior: 'smooth'
        });
      });
    }
  };
  
  const handleReset = () => {
    setCharacterData(null);
    setImageUrl('');
    setActiveStep(1);
    setError('');
    setIsGenerating(false);
  };
  
  const handleExport = () => {
    if (!characterData) return;
    
    const scrollPosition = window.scrollY;
    
    const formattedDialogue = Array.isArray(characterData.exampleConversation) 
      ? characterData.exampleConversation
          .map(exchange => `User: ${exchange.user}\n${characterData.name}: ${exchange.character}`)
          .join('\n\n')
      : characterData.exampleConversation;
    
    // character card data
    const characterCard = {
      name: characterData.name,
      title: characterData.title,
      greeting: characterData.greeting,
      chatbot_personality: characterData.persona,
      scenario: characterData.scenario,
      relationship: characterData.relationship,
      example_dialogue: formattedDialogue,
      image_url: imageUrl,
    };
    
    // create and download JSON file
    const blob = new Blob([JSON.stringify(characterCard, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${characterData.name.toLowerCase().replace(/\s+/g, '-')}-character-card.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setShowModal(true);
    requestAnimationFrame(() => {
      window.scrollTo({
        top: scrollPosition,
        behavior: 'smooth'
      });
    });
  };
  
  return (
    <div className="min-h-screen py-8">
      <header className="text-center mb-12">
        <h1 className="gradient-text">SpicyChat Character Wizard</h1>
        <p>Create AI characters with ease and bring them to life</p>
      </header>

      <div className="progress-steps relative">
        <div className="progress-line absolute"></div>
        <div 
          ref={progressLineRef} 
          className="progress-line-fill absolute"
        ></div>
        
        {[1, 2, 3].map((step, index) => (
          <div 
            key={step} 
            className="step-container"
            ref={el => { stepRefs.current[index] = el; }}
          >
            <div 
              className={`step-number ${activeStep === index + 1 ? 'active' : ''}`}
              onClick={() => {
                if (!isGenerating) {
                  setActiveStep(index + 1);
                }
              }}
            >
              {index + 1}
            </div>
            <div className="step-label">
              {step === 1 ? 'Create Character' : step === 2 ? 'Generate Image' : 'Export'}
            </div>
          </div>
        ))}
      </div>

      <div className="form-container">
        {error && (
          <div className="info-box bg-red-50 border-red-200 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {activeStep === 1 && (
          <CharacterForm
            onGenerate={handleCharacterGenerated}
            setIsGenerating={setIsGenerating}
            setError={setError}
          />
        )}

        {activeStep === 2 && characterData && (
          <ImageGenerator
            character={characterData}
            onImageGenerated={handleImageGenerated}
            setIsGenerating={setIsGenerating}
            setError={setError}
          />
        )}

        {activeStep === 3 && characterData && (
          <div className="character-preview">
            <h3 className="form-section-title">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Character Preview
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="mb-4">
                  <label htmlFor="preview-name" className="font-medium text-gray-700">Name</label>
                  <p id="preview-name" className="mt-1">{characterData.name}</p>
                </div>
                <div className="mb-4">
                  <label htmlFor="preview-title" className="font-medium text-gray-700">Title</label>
                  <p id="preview-title" className="mt-1">{characterData.title}</p>
                </div>
                <div className="mb-4">
                  <label htmlFor="preview-greeting" className="font-medium text-gray-700">Greeting</label>
                  <p id="preview-greeting" className="mt-1">{characterData.greeting}</p>
                </div>
              </div>
              <div>
                <div className="mb-4">
                  <label htmlFor="preview-persona" className="font-medium text-gray-700">Persona</label>
                  <p id="preview-persona" className="mt-1">{characterData.persona}</p>
                </div>
                <div className="mb-4">
                  <label htmlFor="preview-scenario" className="font-medium text-gray-700">Scenario</label>
                  <p id="preview-scenario" className="mt-1">{characterData.scenario}</p>
                </div>
                <div className="mb-4">
                  <label htmlFor="preview-relationship" className="font-medium text-gray-700">Relationship</label>
                  <p id="preview-relationship" className="mt-1">{characterData.relationship}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <button
                onClick={handleExport}
                className="btn btn-primary btn-lg"
                disabled={isGenerating}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export Character
              </button>
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-center space-x-4">
          {activeStep > 1 && (
            <button
              onClick={handleBack}
              className="btn btn-secondary"
              disabled={isGenerating}
            >
              Back
            </button>
          )}
          {activeStep === 3 && (
            <button
              onClick={handleReset}
              className="btn btn-secondary"
              disabled={isGenerating}
            >
              Create New Character
            </button>
          )}
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <div className="p-6">
          <h3 className="text-xl font-semibold text-purple-600 mb-4">Success!</h3>
          <p className="text-gray-700 mb-6">
            Your character has been exported to SpicyChat. You can now complete the character creation process there.
          </p>
          <button
            onClick={() => setShowModal(false)}
            className="btn btn-primary w-full"
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
}