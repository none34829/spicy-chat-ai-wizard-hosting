import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { fetchFromApi } from '../../utils/api';
export default function CharacterForm({ onGenerate, setIsGenerating, setError, className }) {
    const [description, setDescription] = useState('');
    const [relationship, setRelationship] = useState('');
    const [url, setUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isUrlValid, setIsUrlValid] = useState(true);
    const validateUrl = (value) => {
        if (!value) {
            setIsUrlValid(true);
            return;
        }
        try {
            new URL(value);
            setIsUrlValid(true);
        }
        catch {
            setIsUrlValid(false);
        }
    };
    const handleUrlChange = (e) => {
        const value = e.target.value;
        setUrl(value);
        validateUrl(value);
    };
    const handleSubmit = async (e) => {
        if (e)
            e.preventDefault();
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
            }
            else {
                throw new Error('Invalid response format');
            }
        }
        catch (error) {
            console.error('Error generating character:', error);
            setError(error instanceof Error ? error.message : 'An unknown error occurred');
            setIsLoading(false);
            setIsGenerating(false);
            return;
        }
        finally {
            setIsLoading(false);
            setIsGenerating(false);
        }
    };
    return (_jsxs("div", { children: [_jsxs("h2", { className: "form-section-title", children: [_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" }) }), "Character Details"] }), _jsxs("form", { onSubmit: (e) => {
                    e.preventDefault();
                    handleSubmit(e);
                }, children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "description", children: "Character Description*" }), _jsx("textarea", { id: "description", rows: 5, placeholder: "Describe your character in detail. The more information you provide, the better the result will be.", value: description, onChange: (e) => setDescription(e.target.value), required: true, disabled: isLoading }), _jsx("p", { className: "help-text", children: "Example: \"A wise old wizard who specializes in fire magic. He is kind but stern, and has a soft spot for teaching young mages.\"" })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "relationship", children: "Your Relationship with the Character*" }), _jsx("input", { type: "text", id: "relationship", placeholder: "How do you know this character? (e.g., 'old friends from college', 'my mentor', 'regular customers at the same caf\u00E9')", value: relationship, onChange: (e) => setRelationship(e.target.value), required: true, disabled: isLoading }), _jsx("p", { className: "help-text", children: "This will help set the tone for your interactions with the character." })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "url", children: "Reference URL (Optional)" }), _jsx("input", { type: "url", id: "url", placeholder: "https://example.com/reference-content", value: url, onChange: handleUrlChange, disabled: isLoading }), _jsx("p", { className: "help-text", children: "You can provide a URL to a webpage that contains additional information about your character." })] }), _jsx("div", { className: "flex justify-center", children: _jsx("button", { type: "submit", disabled: isLoading || !description.trim() || !relationship.trim() || (url.trim() !== '' && !isUrlValid), className: "btn btn-primary btn-lg", children: isLoading ? (_jsx("span", { children: "Generating..." })) : (_jsxs(_Fragment, { children: [_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 10V3L4 14h7v7l9-11h-7z" }) }), "Generate Character"] })) }) })] })] }));
}
