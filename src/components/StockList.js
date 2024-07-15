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
  IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const sortingFormulas = {
  'RS+RS+RV/3': (stock) => ((stock.rs + stock.rs + stock.rv/ 3) ).toFixed(2),
  'RS+RS+CI/3': (stock) => ((stock.rs + stock.rs + stock.ci/ 3) ).toFixed(2),
  'RS+RS+RT/3': (stock) => ((stock.rs + stock.rs + stock.rt/ 3) ).toFixed(2),
  'RS+RV/2': (stock) => ((stock.rs + stock.rv/ 2) ).toFixed(2),
  'RS+CI/2': (stock) => ((stock.rs + stock.ci/ 2) ).toFixed(2),
  'RS+RT/2': (stock) => ((stock.rs + stock.rt/ 2) ).toFixed(2)
};

const StockList = () => {
  const [stocks, setStocks] = useState([]);
  const [displayResults, setDisplayResults] = useState(10);
  const [criteria, setCriteria] = useState({});
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

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFiltersAndSorting();
  }, [criteria, displayResults, selectedFormula, grtSalesFilter]);
  // https://discipleshiptrails.com/backend/api/stocks/


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
      })
      .catch(error => console.error(error));
  };

  const applyFiltersAndSorting = () => {
    let filtered = [...stocks];
    if (criteria.minRS) {
      filtered = filtered.filter(stock => stock.rs > criteria.minRS);
    }
    if (criteria.minRV) {
      filtered = filtered.filter(stock => stock.rv > criteria.minRV);
    }
    if (criteria.minCI) {
      filtered = filtered.filter(stock => stock.ci > criteria.minCI);
    }
    if (criteria.minRT) {
      filtered = filtered.filter(stock => stock.rt > criteria.minRT);
    }
    if (criteria.minGRT) {
      filtered = filtered.filter(stock => stock.grt > criteria.minGRT);
    }
    if (criteria.minSales) {
      filtered = filtered.filter(stock => stock.sales > criteria.minSales);
    }
    if (criteria.minEYPercentage) {
      filtered = filtered.filter(stock => stock.ey_percentage > criteria.minEYPercentage);
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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedStock) {
      axios.put(`http://localhost:8000/api/stocks/${selectedStock.id}/`, formData)
        .then(response => {
          fetchData();
          setOpen(false);
        })
        .catch(error => console.error(error));
    } else {
      axios.post('http://localhost:8000/api/stocks/', formData)
        .then(response => {
          fetchData();
          setOpen(false);
        })
        .catch(error => console.error(error));
    }
  };

  const handleRowClick = (params) => {
    setSelectedStock(params.row);
    setFormData(params.row);
    setOpen(true);
  };

  const columns = [
    { field: 'ticker', headerName: 'Ticker', width: 150 },
    { field: 'description', headerName: 'Description', width: 300 },
    { field: 'formulaValue', headerName: selectedFormula, width: 150 },
    { field: 'rs', headerName: 'RS', width: 100 },
    { field: 'rv', headerName: 'RV', width: 100 },
    { field: 'ci', headerName: 'CI', width: 100 },
    { field: 'rt', headerName: 'RT', width: 100 },
    { field: 'grt', headerName: 'GRT', width: 100 },
    { field: 'sales', headerName: 'Sales', width: 100 },
    { field: 'ey_percentage', headerName: 'EY%', width: 100 },
    { 
      field: 'actions', 
      headerName: 'Actions', 
      width: 150, 
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
              Total Stocks:{stocks.length}
              
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ padding: 2, textAlign: 'center', backgroundColor: '#e1bee7' }}>
            <Typography variant="h6">
              Results Meeting Criteria :  {filteredStocks.length}
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
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Min RS"
              type="number"
              value={criteria.minRS || ''}
              onChange={(e) => setCriteria({ ...criteria, minRS: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Min RV"
              type="number"
              value={criteria.minRV || ''}
              onChange={(e) => setCriteria({ ...criteria, minRV: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Min CI"
              type="number"
              value={criteria.minCI || ''}
              onChange={(e) => setCriteria({ ...criteria, minCI: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Min RT"
              type="number"
              value={criteria.minRT || ''}
              onChange={(e) => setCriteria({ ...criteria, minRT: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Min GRT"
              type="number"
              value={criteria.minGRT || ''}
              onChange={(e) => setCriteria({ ...criteria, minGRT: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Min Sales"
              type="number"
              value={criteria.minSales || ''}
              onChange={(e) => setCriteria({ ...criteria, minSales: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Min EY%"
              type="number"
              value={criteria.minEYPercentage || ''}
              onChange={(e) => setCriteria({ ...criteria, minEYPercentage: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControlLabel
              control={<Checkbox checked={grtSalesFilter} onChange={(e) => setGrtSalesFilter(e.target.checked)} />}
              label="GRT > Sales"
            />
          </Grid>
        </Grid>
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
    </Box>
  );
};

export default StockList;
