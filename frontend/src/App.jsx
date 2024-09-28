import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';

const API_URL = 'http://localhost:3000/api/users';

function App() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '' });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

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

  const handleAddUser = async () => {
    await axios.post(API_URL, newUser);
    fetchUsers();
    handleDialogClose();
  };

  const handleUpdateUser = async () => {
    await axios.put(`${API_URL}/${currentUserId}`, newUser);
    fetchUsers();
    handleDialogClose();
  };

  const handleDeleteUser = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchUsers();
  };

  return (
    <div className="app-container">
      <h1>User Management</h1>
      <Button variant="contained" color="primary" onClick={() => handleDialogOpen()}>
        Add New User
      </Button>

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
                  <Button color="primary" onClick={() => handleDialogOpen(user)}>
                    Edit
                  </Button>
                  <Button color="secondary" onClick={() => handleDeleteUser(user.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
