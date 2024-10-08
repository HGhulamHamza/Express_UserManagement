import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Snackbar,
  Alert,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const API_URL = 'http://localhost:3000/api/users';

function App() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '' });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    const response = await axios.get(API_URL);
    setUsers(response.data.data);
  }

  const handleDialogOpen = (user) => {
    setDialogOpen(true);
    if (user) {
      setEditMode(true);
      setCurrentUserId(user.id);
      setNewUser({ name: user.name, email: user.email });
    } else {
      setEditMode(false);
      setNewUser({ name: '', email: '' });
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setNewUser({ name: '', email: '' });
    setEditMode(false);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleAddUser = async () => {
    try {
      await axios.post(API_URL, newUser);
      fetchUsers();
      handleDialogClose();
      showSnackbar('User added successfully!', 'success');
    } catch (error) {
      showSnackbar(error.response.data.message, 'error');
    }
  };

  const handleUpdateUser = async () => {
    try {
      await axios.put(`${API_URL}/${currentUserId}`, newUser);
      fetchUsers();
      handleDialogClose();
      showSnackbar('User updated successfully!', 'success');
    } catch (error) {
      showSnackbar(error.response.data.message, 'error');
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchUsers();
      showSnackbar('User deleted successfully!', 'success');
    } catch (error) {
      showSnackbar(error.response.data.message, 'error');
    }
  };

  return (
    <div className="app-container">
      <h1>User Management</h1>
     

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>{editMode ? 'Edit User' : 'Add New User'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={editMode ? handleUpdateUser : handleAddUser}>
            {editMode ? 'Update User' : 'Add User'}
          </Button>
        </DialogActions>
      </Dialog>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <IconButton color="primary" onClick={() => handleDialogOpen(user)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleDeleteUser(user.id)}>
                    <DeleteIcon />
                  </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleDialogOpen()}
        startIcon={<AddIcon />}
        style={{ marginTop: '40px' }}
      >
        Add New User
      </Button>
    </div>
  );
}

export default App;
