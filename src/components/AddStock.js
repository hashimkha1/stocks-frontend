// src/components/AddStock.js
import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';


const AddStock = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    ticker: '',
    description: '',
    rs: 0,
    rv: 0,
    ci: 0,
    rt: 0,
    grt: 0,
    sales: 0,
    ey_percentage: 0
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('https://discipleshiptrails.com/backend/api/stocks/', formData)
      .then(response => {
        console.log(response.data);
        setOpen(false);
      })
      .catch(error => console.error(error));
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Fab color="primary" aria-label="add" onClick={handleClickOpen}>
        <AddIcon />
      </Fab>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Stock</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" name="ticker" label="Ticker" fullWidth onChange={handleChange} />
          <TextField margin="dense" name="description" label="Description" fullWidth onChange={handleChange} />
          <TextField margin="dense" name="rs" label="RS" type="number" fullWidth onChange={handleChange} />
          <TextField margin="dense" name="rv" label="RV" type="number" fullWidth onChange={handleChange} />
          <TextField margin="dense" name="ci" label="CI" type="number" fullWidth onChange={handleChange} />
          <TextField margin="dense" name="rt" label="RT" type="number" fullWidth onChange={handleChange} />
          <TextField margin="dense" name="grt" label="GRT" type="number" fullWidth onChange={handleChange} />
          <TextField margin="dense" name="sales" label="Sales" type="number" fullWidth onChange={handleChange} />
          <TextField margin="dense" name="ey_percentage" label="EY%" type="number" fullWidth onChange={handleChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddStock;
