// Backend: server.js
import express from 'express';
import cors from 'cors';

const PORT = 3000;
const app = express();

app.use(cors()); 
app.use(express.json());

const users = [
    { id: 1, name: 'Hamza', email: 'hamza@gmail.com' },
    { id: 2, name: 'Abbas', email: 'abbas@gmail.com' },
];

function errorHandler(err, req, res, next) {
    res.status(err.status || 500).json({
        message: err.message || 'Something went wrong',
        error: true,
    });
}

app.get('/api/users', (req, res) => {
    res.status(200).json({ message: 'Get all users!', data: users });
});

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is listening on: http://localhost:${PORT}`);
});
