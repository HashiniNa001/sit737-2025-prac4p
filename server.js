const express = require('express');
const path = require('path');
const winston = require('winston');
const app = express();
const PORT = 3000;

// Configure Winston logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'calculator-microservice' },
    transports: [
        new winston.transports.Console({
            format: winston.format.simple(),
        }),
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' })
    ],
});

// Middleware to parse JSON requests
app.use(express.json());
app.use(express.static('public'));

// Middleware to log incoming requests
app.use((req, res, next) => {
    logger.info(`Incoming request: ${req.method} ${req.url} from ${req.ip}`);
    next();
});

// Arithmetic operation endpoints
app.get('/add', (req, res) => {
    handleOperation(req, res, (a, b) => a + b, 'addition');
});

app.get('/subtract', (req, res) => {
    handleOperation(req, res, (a, b) => a - b, 'subtraction');
});

app.get('/multiply', (req, res) => {
    handleOperation(req, res, (a, b) => a * b, 'multiplication');
});

app.get('/divide', (req, res) => {
    handleOperation(req, res, (a, b) => {
        if (b === 0) {
            logger.error("Division by zero attempted.");
            return res.status(400).json({ error: "Cannot divide by zero" });
        }
        return a / b;
    }, 'division');
});

// Helper function to handle arithmetic operations with logging
function handleOperation(req, res, operation, operationName) {
    const num1 = parseFloat(req.query.num1);
    const num2 = parseFloat(req.query.num2);
    
    if (isNaN(num1) || isNaN(num2)) {
        logger.error("Invalid input: non-numeric values provided.");
        return res.status(400).json({ error: "Invalid input. Please provide valid numbers." });
    }
    
    const result = operation(num1, num2);
    logger.info(`New ${operationName} operation requested: ${num1} ${operationName} ${num2} = ${result}`);
    res.json({ result });
}

// Serve frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}`);
});
