"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = require("dotenv");
const api_js_1 = __importDefault(require("./routes/api.js"));
(0, dotenv_1.config)();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// CORS configuration
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
// Parse JSON bodies
app.use(express_1.default.json());
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'API is running' });
});
// Logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});
// Routes
app.use('/api', api_js_1.default);
// Root route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to SpicyChat AI Wizard Hosting API' });
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        error: err.message
    });
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
exports.default = app;
//# sourceMappingURL=index.js.map