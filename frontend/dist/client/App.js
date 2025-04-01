import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import CharacterForm from './components/CharacterForm';
import ImageGenerator from './components/ImageGenerator';
import Modal from './components/Modal';
export default function App() {
    const [activeStep, setActiveStep] = useState(1);
    const [characterData, setCharacterData] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const progressLineRef = useRef(null);
    const stepRefs = useRef([]);
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
    const handleCharacterGenerated = (data) => {
        setCharacterData(data);
        setActiveStep(2);
        setError('');
    };
    const handleImageGenerated = (url) => {
        const scrollPosition = window.scrollY;
        setImageUrl(url);
        setActiveStep(3);
        setError('');
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
    };
    const handleExport = () => {
        if (!characterData)
            return;
        const scrollPosition = window.scrollY;
        const formattedDialogue = Array.isArray(characterData.exampleConversation)
            ? characterData.exampleConversation
                .map(exchange => `User: ${exchange.user}\n${characterData.name}: ${exchange.character}`)
                .join('\n\n')
            : characterData.exampleConversation;
        // character card data with renamed fields for export
        const characterCard = {
            name: characterData.name,
            title: characterData.title,
            first_mes: characterData.greeting, // renamed from greeting
            description: characterData.persona, // renamed from chatbot_personality
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
    return (_jsxs("div", { className: "min-h-screen py-8", children: [_jsxs("header", { className: "text-center mb-12", children: [_jsx("h1", { className: "gradient-text", children: "SpicyChat Character Wizard" }), _jsx("p", { children: "Create AI characters with ease and bring them to life" })] }), _jsxs("div", { className: "progress-steps relative", children: [_jsx("div", { className: "progress-line absolute" }), _jsx("div", { ref: progressLineRef, className: "progress-line-fill absolute" }), [1, 2, 3].map((step, index) => (_jsxs("div", { className: "step-container", ref: el => { stepRefs.current[index] = el; }, children: [_jsx("div", { className: `step-number ${activeStep === index + 1 ? 'active' : ''}`, onClick: () => setActiveStep(index + 1), children: index + 1 }), _jsx("div", { className: "step-label", children: step === 1 ? 'Create Character' : step === 2 ? 'Generate Image' : 'Export' })] }, step)))] }), _jsxs("div", { className: "form-container", children: [error && (_jsx("div", { className: "info-box bg-red-50 border-red-200 mb-6", children: _jsx("p", { className: "text-red-800", children: error }) })), activeStep === 1 && (_jsx(CharacterForm, { onGenerate: handleCharacterGenerated, setIsGenerating: setIsGenerating, setError: setError })), activeStep === 2 && characterData && (_jsx(ImageGenerator, { character: characterData, onImageGenerated: handleImageGenerated, setIsGenerating: setIsGenerating, setError: setError })), activeStep === 3 && characterData && (_jsxs("div", { className: "character-preview", children: [_jsxs("h3", { className: "form-section-title", children: [_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }), "Character Preview"] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsxs("div", { className: "mb-4", children: [_jsx("label", { htmlFor: "preview-name", className: "font-medium text-gray-700", children: "Name" }), _jsx("p", { id: "preview-name", className: "mt-1", children: characterData.name })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { htmlFor: "preview-title", className: "font-medium text-gray-700", children: "Title" }), _jsx("p", { id: "preview-title", className: "mt-1", children: characterData.title })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { htmlFor: "preview-greeting", className: "font-medium text-gray-700", children: "Greeting" }), _jsx("p", { id: "preview-greeting", className: "mt-1 whitespace-pre-wrap", children: characterData.greeting })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { htmlFor: "preview-persona", className: "font-medium text-gray-700", children: "Chatbot's Personality" }), _jsx("p", { id: "preview-persona", className: "mt-1 whitespace-pre-wrap", children: characterData.persona })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { htmlFor: "preview-relationship", className: "font-medium text-gray-700", children: "Relationship" }), _jsx("p", { id: "preview-relationship", className: "mt-1", children: characterData.relationship })] }), _jsxs("div", { className: "mt-4", children: [_jsx("label", { htmlFor: "preview-scenario", className: "font-medium text-gray-700", children: "Scenario" }), _jsx("p", { id: "preview-scenario", className: "mt-1 whitespace-pre-wrap", children: characterData.scenario })] }), _jsxs("div", { className: "mt-4", children: [_jsx("label", { htmlFor: "preview-conversation", className: "font-medium text-gray-700", children: "Example Conversation" }), _jsx("div", { id: "preview-conversation", className: "mt-1", children: Array.isArray(characterData.exampleConversation) ? (characterData.exampleConversation.map((exchange, index) => (_jsxs("div", { className: "conversation-exchange", children: [_jsxs("p", { className: "user-message", children: ["User: ", exchange.user] }), _jsxs("p", { className: "character-message", children: [characterData.name, ": ", exchange.character] })] }, index)))) : (_jsx("p", { className: "text-red-500", children: "Conversation format not supported" })) })] })] }), imageUrl && (_jsx("div", { className: "image-preview", children: _jsx("img", { src: imageUrl, alt: characterData.name, className: "w-full h-auto rounded-lg" }) }))] })] })), _jsxs("div", { className: "button-group mt-8", children: [activeStep > 1 && (_jsxs("button", { onClick: handleBack, className: "btn btn-back", children: [_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M10 19l-7-7m0 0l7-7m-7 7h18" }) }), "Back"] })), activeStep === 3 && (_jsxs("button", { onClick: handleExport, className: "btn btn-primary", children: [_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" }) }), "Export Character"] }))] })] }), _jsx(Modal, { isOpen: showModal, onClose: () => setShowModal(false), children: _jsxs("div", { className: "modal-content", children: [_jsxs("div", { className: "mb-8", children: [_jsx("svg", { className: "mx-auto h-12 w-12 text-green-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }), _jsx("h3", { className: "mt-3 text-lg font-medium text-gray-900", children: "Success!" }), _jsx("div", { className: "mt-2 text-sm text-gray-600", children: _jsx("p", { children: "Your character has been exported to SpicyChat. You can now complete the character creation process there." }) })] }), _jsx("div", { className: "mt-6", children: _jsx("button", { onClick: () => setShowModal(false), className: "btn btn-success", children: "Close" }) })] }) })] }));
}
