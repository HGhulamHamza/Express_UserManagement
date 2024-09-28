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

// Add User POST Route
app.post('/api/users', (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({ message: 'Name and email are required!' });
    }

    const newUser = {
        id: users.length + 1,
        name,
        email,
    };

    users.push(newUser);
    res.status(201).json({ message: 'New user created!', data: newUser });
});

// Update User PUT Route
app.put('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;

    const userIndex = users.findIndex(user => user.id === parseInt(id));

    if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found!' });
    }

    users[userIndex] = { id: parseInt(id), name, email };
    res.status(200).json({ message: 'User updated successfully!', data: users[userIndex] });
});

// Delete User DELETE Route
app.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const userIndex = users.findIndex(user => user.id === parseInt(id));

    if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found!' });
    }

    users.splice(userIndex, 1);
    res.status(200).json({ message: 'User deleted successfully!' });
});

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is listening on: http://localhost:${PORT}`);
});
