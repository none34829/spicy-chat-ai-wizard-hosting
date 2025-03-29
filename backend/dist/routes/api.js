"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = void 0;
const express_1 = __importDefault(require("express"));
const characterController_js_1 = require("../controllers/characterController.js");
const imageController_js_1 = require("../controllers/imageController.js");
const router = express_1.default.Router();
exports.default = router;
router.use((req, res, next) => {
    console.log(`API Request: ${req.method} ${req.originalUrl}`);
    console.log('Request headers:', req.headers);
    console.log('Request body:', req.body);
    next();
});
router.post('/character/generate', async (req, res) => {
    try {
        await (0, characterController_js_1.generateCharacter)(req, res);
    }
    catch (error) {
        console.error('Error in character/generate:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to generate character',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
router.post('/character/extract', async (req, res) => {
    try {
        await (0, characterController_js_1.getCharacterFromUrl)(req, res);
    }
    catch (error) {
        console.error('Error in character/extract:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to extract character',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
router.post('/image/generate', async (req, res) => {
    try {
        await (0, imageController_js_1.generateImage)(req, res);
    }
    catch (error) {
        console.error('Error in image/generate:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to generate image',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
router.get('/health', (req, res) => {
    console.log('Health check endpoint hit');
    res.status(200).json({ status: 'ok', message: 'API is running' });
});
router.get('/test', (req, res) => {
    console.log('Test endpoint hit');
    res.status(200).json({ message: 'API is working' });
});
//# sourceMappingURL=api.js.map