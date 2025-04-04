"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractContentFromUrl = extractContentFromUrl;
exports.extractContentFromUrls = extractContentFromUrls;
const axios_1 = __importDefault(require("axios"));
const EXA_API_URL = 'https://api.exa.ai/contents';
async function extractContentFromUrl(url) {
    try {
        const params = {
            urls: [url],
            text: true,
            livecrawl: 'fallback',
            summary: {
                enabled: true,
                maxLength: 1000
            },
            highlights: {
                enabled: true,
                count: 5
            }
        };
        const response = await axios_1.default.post(EXA_API_URL, params, {
            headers: {
                'Authorization': `Bearer ${process.env.EXA_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });
        if (!response.data || !response.data.results || response.data.results.length === 0) {
            throw new Error('No content found at the provided URL');
        }
        const result = response.data.results[0];
        const content = result.text || '';
        const summary = result.summary ? `\n\nSummary: ${result.summary}` : '';
        const highlights = result.highlights?.length
            ? `\n\nKey points: ${result.highlights.join('\n- ')}`
            : '';
        const fullContent = content + summary + highlights;
        return fullContent.length > 5000 ? fullContent.substring(0, 5000) + '...' : fullContent;
    }
    catch (error) {
        console.error('Error in Exa service:', error);
        throw new Error('Failed to extract content from URL');
    }
}
/**
 * extract content from multiple URLs using Exa's API
 */
async function extractContentFromUrls(urls) {
    try {
        const params = {
            urls: urls,
            text: true,
            livecrawl: 'fallback',
            summary: {
                enabled: true
            },
            highlights: {
                enabled: true
            }
        };
        const response = await axios_1.default.post(EXA_API_URL, params, {
            headers: {
                'Authorization': `Bearer ${process.env.EXA_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });
        if (!response.data || !response.data.results || response.data.results.length === 0) {
            throw new Error('No content found at the provided URLs');
        }
        return response.data.results;
    }
    catch (error) {
        console.error('Error in Exa service:', error);
        throw new Error('Failed to extract content from URLs');
    }
}
//# sourceMappingURL=exaService.js.map