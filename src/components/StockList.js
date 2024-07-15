import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import {
  Box,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Paper,
  Grid,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  IconButton,
  Snackbar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MuiAlert from '@mui/material/Alert';

const sortingFormulas = {
  'RS+RS+RV/3': (stock) => ((stock.rs + stock.rs + stock.rv / 3)).toFixed(2),
  'RS+RS+CI/3': (stock) => ((stock.rs + stock.rs + stock.ci / 3)).toFixed(2),
  'RS+RS+RT/3': (stock) => ((stock.rs + stock.rs + stock.rt / 3)).toFixed(2),
  'RS+RV/2': (stock) => ((stock.rs + stock.rv / 2)).toFixed(2),
  'RS+CI/2': (stock) => ((stock.rs + stock.ci / 2)).toFixed(2),
  'RS+RT/2': (stock) => ((stock.rs + stock.rt / 2)).toFixed(2)
};

const defaultCriteria = {
  minRS: 1.3,
  minRV: 1.3,
  minCI: 1.3,
  minRT: 1,
  minGRT: 10,
  minSales: 10,
  minEYPercentage: 4,
};

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const StockList = () => {
  const [stocks, setStocks] = useState([]);
  const [displayResults, setDisplayResults] = useState(10);
  const [criteria, setCriteria] = useState(defaultCriteria);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [selectedFormula, setSelectedFormula] = useState('RS+RS+RV/3');
  const [grtSalesFilter, setGrtSalesFilter] = useState(false);
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
  const [selectedStock, setSelectedStock] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFiltersAndSorting();
  }, [criteria, displayResults, selectedFormula, grtSalesFilter]);

  const fetchData = () => {
    axios.get('http://localhost:8000/api/stocks/')
      .then(response => {
        setStocks(response.data);
        setFilteredStocks(response.data);
      })
      .catch(error => console.error(error));
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:8000/api/stocks/${id}/`)
      .then(() => {
        fetchData();
        if (selectedStock && selectedStock.id === id) {
          setSelectedStock(null);
          setOpen(false);
        }
        setSnackbarMessage('Stock deleted successfully');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      })
      .catch(error => {
        console.error(error);
        setSnackbarMessage('Failed to delete stock');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      });
  };

  const applyFiltersAndSorting = () => {
    let filtered = [...stocks];
    if (criteria.minRS !== '') {
      filtered = filtered.filter(stock => stock.rs > parseFloat(criteria.minRS));
    }
    if (criteria.minRV !== '') {
      filtered = filtered.filter(stock => stock.rv > parseFloat(criteria.minRV));
    }
    if (criteria.minCI !== '') {
      filtered = filtered.filter(stock => stock.ci > parseFloat(criteria.minCI));
    }
    if (criteria.minRT !== '') {
      filtered = filtered.filter(stock => stock.rt > parseFloat(criteria.minRT));
    }
    if (criteria.minGRT !== '') {
      filtered = filtered.filter(stock => stock.grt > parseFloat(criteria.minGRT));
    }
    if (criteria.minSales !== '') {
      filtered = filtered.filter(stock => stock.sales > parseFloat(criteria.minSales));
    }
    if (criteria.minEYPercentage !== '') {
      filtered = filtered.filter(stock => stock.ey_percentage > parseFloat(criteria.minEYPercentage));
    }
    if (grtSalesFilter) {
      filtered = filtered.filter(stock => stock.grt > stock.sales);
    }

    filtered = filtered.map(stock => ({
      ...stock,
      formulaValue: sortingFormulas[selectedFormula](stock)
    }));

    filtered.sort((a, b) => b.formulaValue - a.formulaValue);

    setFilteredStocks(filtered.slice(0, displayResults));
  };

  const handleClickOpen = () => {
    setOpen(true);
    setSelectedStock(null);
    setFormData({
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
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCriteriaChange = (e) => {
    const { name, value } = e.target;
    setCriteria({ ...criteria, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedStock) {
      axios.put(`http://localhost:8000/api/stocks/${selectedStock.id}/`, formData)
        .then(response => {
          fetchData();
          setOpen(false);
          setSnackbarMessage('Stock updated successfully');
          setSnackbarSeverity('success');
          setSnackbarOpen(true);
        })
        .catch(error => {
          console.error(error);
          setSnackbarMessage('Failed to update stock');
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
        });
    } else {
      axios.post('http://localhost:8000/api/stocks/', formData)
        .then(response => {
          fetchData();
          setOpen(false);
          setSnackbarMessage('Stock added successfully');
          setSnackbarSeverity('success');
          setSnackbarOpen(true);
        })
        .catch(error => {
          console.error(error);
          setSnackbarMessage('Failed to add stock');
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
        });
    }
  };

  const handleRowClick = (params) => {
    setSelectedStock(params.row);
    setFormData(params.row);
    setOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const columns = [
    { field: 'ticker', headerName: 'Ticker', flex: 1 },
    { field: 'description', headerName: 'Description', flex: 2 },
    { field: 'formulaValue', headerName: selectedFormula, flex: 1 },
    { field: 'rs', headerName: 'RS', flex: 1 },
    { field: 'rv', headerName: 'RV', flex: 1 },
    { field: 'ci', headerName: 'CI', flex: 1 },
    { field: 'rt', headerName: 'RT', flex: 1 },
    { field: 'grt', headerName: 'GRT', flex: 1 },
    { field: 'sales', headerName: 'Sales', flex: 1 },
    { field: 'ey_percentage', headerName: 'EY%', flex: 1 },
    { 
      field: 'actions', 
      headerName: 'Actions', 
      flex: 1, 
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <IconButton 
            color="error"
            onClick={() => handleDelete(params.row.id)}
          >
            <DeleteIcon />
          </IconButton>
          <IconButton 
            color="primary"
            onClick={() => handleRowClick(params)}
          >
            <EditIcon />
          </IconButton>
        </Box>
      ) 
    },
  ];

  return (
    <Box sx={{ padding: 3 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={4}>
          <Paper sx={{ padding: 2, textAlign: 'center', backgroundColor: '#f0f4c3' }}>
            <Typography variant="h6">
              Total Stocks: {stocks.length}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ padding: 2, textAlign: 'center', backgroundColor: '#e1bee7' }}>
            <Typography variant="h6">
              Results Meeting Criteria: {filteredStocks.length}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel id="display-results-label">Display Results</InputLabel>
            <Select
              labelId="display-results-label"
              value={displayResults}
              label="Display Results"
              onChange={(e) => setDisplayResults(e.target.value)}
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={50}>50</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Box sx={{ marginTop: 3 }}>
        <Typography variant="h6" gutterBottom>
          Filters
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <TextField
            label="RS >"
            type="number"
            size="small"
            value={criteria.minRS}
            onChange={handleCriteriaChange}
            name="minRS"
            sx={{ width: 120 }}
          />
          <TextField
            label="RV >"
            type="number"
            size="small"
            value={criteria.minRV}
            onChange={handleCriteriaChange}
            name="minRV"
            sx={{ width: 120 }}
          />
          <TextField
            label="CI >"
            type="number"
            size="small"
            value={criteria.minCI}
            onChange={handleCriteriaChange}
            name="minCI"
            sx={{ width: 120 }}
          />
          <TextField
            label="RT >"
            type="number"
            size="small"
            value={criteria.minRT}
            onChange={handleCriteriaChange}
            name="minRT"
            sx={{ width: 120 }}
          />
          <TextField
            label="GRT >"
            type="number"
            size="small"
            value={criteria.minGRT}
            onChange={handleCriteriaChange}
            name="minGRT"
            sx={{ width: 120 }}
          />
          <TextField
            label="SALES >"
            type="number"
            size="small"
            value={criteria.minSales}
            onChange={handleCriteriaChange}
            name="minSales"
            sx={{ width: 120 }}
          />
          <TextField
            label="EY% >"
            type="number"
            size="small"
            value={criteria.minEYPercentage}
            onChange={handleCriteriaChange}
            name="minEYPercentage"
            sx={{ width: 120 }}
          />
          <FormControlLabel
            control={<Checkbox checked={grtSalesFilter} onChange={(e) => setGrtSalesFilter(e.target.checked)} />}
            label="GRT > Sales"
          />
        </Box>
      </Box>
      <Box sx={{ marginTop: 3 }}>
        <Typography variant="h6" gutterBottom>
          Sort Selection
        </Typography>
        <Grid container spacing={2} alignItems="center">
          {Object.keys(sortingFormulas).map((formula) => (
            <Grid item key={formula}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedFormula === formula}
                    onChange={() => setSelectedFormula(formula)}
                  />
                }
                label={formula}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box sx={{ height: 600, marginTop: 3 }}>
        <DataGrid 
          rows={filteredStocks} 
          columns={columns} 
          pageSize={10} 
          onRowClick={handleRowClick} 
          sx={{
            '& .MuiDataGrid-root': {
              backgroundColor: '#e3f2fd',
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: '#bbdefb',
            },
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid #90caf9',
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#fdd835',
              color: '#000',
              fontSize: '16px',
            },
            '& .MuiDataGrid-footerContainer': {
              backgroundColor: '#0d47a1',
              color: '#fff',
            }
          }}
        />
      </Box>
      <Fab color="primary" aria-label="add" onClick={handleClickOpen} sx={{ position: 'fixed', bottom: 16, right: 16 }}>
        <AddIcon />
      </Fab>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{selectedStock ? "Edit Stock" : "Add Stock"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField autoFocus margin="dense" name="ticker" label="Ticker" fullWidth value={formData.ticker} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField margin="dense" name="description" label="Description" fullWidth value={formData.description} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField margin="dense" name="rs" label="RS" type="number" fullWidth value={formData.rs} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField margin="dense" name="rv" label="RV" type="number" fullWidth value={formData.rv} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField margin="dense" name="ci" label="CI" type="number" fullWidth value={formData.ci} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField margin="dense" name="rt" label="RT" type="number" fullWidth value={formData.rt} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField margin="dense" name="grt" label="GRT" type="number" fullWidth value={formData.grt} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField margin="dense" name="sales" label="Sales" type="number" fullWidth value={formData.sales} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField margin="dense" name="ey_percentage" label="EY%" type="number" fullWidth value={formData.ey_percentage} onChange={handleChange} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          {selectedStock && (
            <Button onClick={() => handleDelete(selectedStock.id)} color="secondary">
              Delete
            </Button>
          )}
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            {selectedStock ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StockList;
