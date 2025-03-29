"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCharacter = generateCharacter;
exports.getCharacterFromUrl = getCharacterFromUrl;
const zod_1 = require("zod");
const groqService_js_1 = require("../services/groqService.js");
const exaService_js_1 = require("../services/exaService.js");
const GenerateCharacterSchema = zod_1.z.object({
    description: zod_1.z.string().min(10).max(1000),
    relationship: zod_1.z.string().min(5).max(200),
    url: zod_1.z.string().url().optional(),
});
async function generateCharacter(req, res) {
    try {
        console.log('Received generateCharacter request:', req.body);
        const validationResult = GenerateCharacterSchema.safeParse(req.body);
        if (!validationResult.success) {
            console.error('Validation error:', validationResult.error.format());
            res.status(400).json({
                status: 'error',
                message: 'Invalid input',
                errors: validationResult.error.format()
            });
            return;
        }
        const { description, relationship, url } = validationResult.data;
        let enhancedDescription = description;
        if (url) {
            try {
                const extractedContent = await (0, exaService_js_1.extractContentFromUrl)(url);
                enhancedDescription = `${description}\n\nAdditional context from URL: ${extractedContent}`;
            }
            catch (error) {
                console.error('Error extracting content from URL:', error);
                // Continue with original description if URL extraction fails
            }
        }
        try {
            const characterData = await (0, groqService_js_1.generateCharacterDetails)(enhancedDescription, relationship);
            const finalCharacterData = {
                ...characterData,
                originalDescription: description
            };
            res.status(200).json({
                status: 'success',
                data: finalCharacterData
            });
        }
        catch (error) {
            console.error('Error generating character details:', error);
            throw error;
        }
    }
    catch (error) {
        console.error('Error in generateCharacter:', error);
        res.status(500).json({
            status: 'error',
            message: error instanceof Error ? error.message : 'Failed to generate character',
            error: error instanceof Error ? error.stack : undefined
        });
    }
}
async function getCharacterFromUrl(req, res) {
    try {
        const { url } = req.body;
        if (!url) {
            res.status(400).json({
                status: 'error',
                message: 'URL is required'
            });
            return;
        }
        try {
            const content = await (0, exaService_js_1.extractContentFromUrl)(url);
            const characterData = await (0, groqService_js_1.generateCharacterDetails)(`Create a character based on the following content: ${content}`, "new acquaintance who recently met");
            res.status(200).json({
                status: 'success',
                data: characterData
            });
        }
        catch (error) {
            console.error('Error extracting content:', error);
            throw error;
        }
    }
    catch (error) {
        console.error('Error in getCharacterFromUrl:', error);
        res.status(500).json({
            status: 'error',
            message: error instanceof Error ? error.message : 'Failed to extract content',
            error: error instanceof Error ? error.stack : undefined
        });
    }
}
//# sourceMappingURL=characterController.js.map