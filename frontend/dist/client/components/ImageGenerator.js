import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { fetchFromApi } from '../../utils/api';
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
export default function ImageGenerator({ character, onImageGenerated, setIsGenerating, setError, className }) {
    const [selectedStyle, setSelectedStyle] = useState('realistic portrait');
    const [customStyle, setCustomStyle] = useState('');
    const [additionalDetails, setAdditionalDetails] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [generatedImageUrl, setGeneratedImageUrl] = useState('');
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
        }
        catch (error) {
            if (error instanceof Error) {
                console.error('Frontend error when generating image:', error.message);
                setError(error.message);
            }
            else {
                console.error('Frontend unknown error:', error);
                setError('An unknown error occurred');
            }
        }
        finally {
            setIsLoading(false);
            setIsGenerating(false);
        }
    };
    return (_jsxs("div", { className: `space-y-4 ${className}`, children: [_jsxs("h2", { className: "form-section-title", children: [_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" }) }), "Character Details"] }), _jsx("div", { className: "character-details-card", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "text-gray-700 font-medium", children: "Name" }), _jsx("p", { className: "mt-1 text-lg", children: character.name })] }), _jsxs("div", { children: [_jsx("label", { className: "text-gray-700 font-medium", children: "Title" }), _jsx("p", { className: "mt-1 text-lg", children: character.title })] }), _jsxs("div", { children: [_jsx("label", { className: "text-gray-700 font-medium", children: "Persona" }), _jsx("p", { className: "mt-1 text-gray-800 whitespace-pre-wrap", children: character.persona })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "text-gray-700 font-medium", children: "Greeting" }), _jsx("p", { className: "mt-1 text-gray-800 whitespace-pre-wrap", children: character.greeting })] }), _jsxs("div", { children: [_jsx("label", { className: "text-gray-700 font-medium", children: "Scenario" }), _jsx("p", { className: "mt-1 text-gray-800 whitespace-pre-wrap", children: character.scenario })] }), _jsxs("div", { children: [_jsx("label", { className: "text-gray-700 font-medium", children: "Example Conversation" }), _jsx("div", { className: "mt-1 text-gray-800 space-y-2", children: Array.isArray(character.exampleConversation) ? (character.exampleConversation.map((exchange, index) => (_jsxs("div", { className: "conversation-exchange", children: [_jsxs("p", { className: "font-medium text-purple-700", children: ["User: ", exchange.user] }), _jsxs("p", { className: "ml-4", children: [character.name, ": ", exchange.character] })] }, index)))) : (_jsx("p", { className: "whitespace-pre-wrap", children: character.exampleConversation })) })] })] })] }) }), _jsxs("h2", { className: "form-section-title mt-8", children: [_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" }) }), "Generate Character Image"] }), _jsx("div", { className: "info-box", children: _jsx("p", { children: "Now that your character details are ready, let's generate an avatar image for them. Select a style and add any specific details you want to include in the image." }) }), generatedImageUrl && (_jsxs("div", { className: "mt-8 p-4 bg-white rounded-lg shadow-md", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Generated Image" }), _jsx("div", { className: "relative flex justify-center", children: _jsx("img", { src: generatedImageUrl, alt: `${character.name} - ${selectedStyle}`, className: "w-full max-w-md mx-auto rounded-lg shadow-lg" }) })] })), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "style", children: "Image Style" }), _jsx("select", { id: "style", value: selectedStyle, onChange: (e) => setSelectedStyle(e.target.value), disabled: isLoading, children: STYLE_OPTIONS.map((option) => (_jsx("option", { value: option.value, children: option.label }, option.value))) })] }), selectedStyle === 'other' && (_jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "customStyle", children: "Custom Style Description" }), _jsx("input", { id: "customStyle", type: "text", placeholder: "E.g., cyberpunk style, steampunk portrait, etc.", value: customStyle, onChange: (e) => setCustomStyle(e.target.value), disabled: isLoading }), _jsx("p", { className: "help-text", children: "Be descriptive to get the best results. Example: \"cyberpunk character with neon lighting\"" })] })), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "additionalDetails", children: "Additional Image Details (Optional)" }), _jsx("textarea", { id: "additionalDetails", rows: 3, placeholder: "Add specific details about how you want the character to appear in the image (e.g., holding a magnifying glass, wearing specific clothing, etc.)", value: additionalDetails, onChange: (e) => setAdditionalDetails(e.target.value), disabled: isLoading }), _jsx("p", { className: "help-text", children: "These details will help create a more accurate representation of your character." })] }), _jsx("div", { className: "flex justify-center", children: _jsx("button", { onClick: handleGenerateImage, disabled: isLoading || (selectedStyle === 'other' && !customStyle.trim()), className: "btn btn-primary btn-lg", children: isLoading ? (_jsx("span", { children: "Generating Image..." })) : (_jsxs(_Fragment, { children: [_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", className: "w-6 h-6", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" }) }), _jsx("span", { className: "ml-2", children: "Generate Image" })] })) }) })] }));
}
