const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware to parse JSON requests
app.use(express.json());
app.use(express.static('public'));

// Arithmetic operation endpoints
app.get('/add', (req, res) => {
    handleOperation(req, res, (a, b) => a + b);
});

app.get('/subtract', (req, res) => {
    handleOperation(req, res, (a, b) => a - b);
});

app.get('/multiply', (req, res) => {
    handleOperation(req, res, (a, b) => a * b);
});

app.get('/divide', (req, res) => {
    handleOperation(req, res, (a, b) => {
        if (b === 0) return res.status(400).json({ error: "Cannot divide by zero" });
        return a / b;
    });
});

// Helper function to handle arithmetic operations
function handleOperation(req, res, operation) {
    const num1 = parseFloat(req.query.num1);
    const num2 = parseFloat(req.query.num2);
    
    if (isNaN(num1) || isNaN(num2)) {
        return res.status(400).json({ error: "Invalid input. Please provide valid numbers." });
    }
    
    const result = operation(num1, num2);
    res.json({ result });
}

// Serve frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
