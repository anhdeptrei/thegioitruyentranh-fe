import React from 'react';
import { Box, Typography, TextField, Button, Grid, Paper, Switch, FormControlLabel } from '@mui/material';

const AdminSetting = () => {
    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4" gutterBottom>
                Admin Settings
            </Typography>
            <Paper sx={{ padding: 3, marginBottom: 4 }}>
                <Typography variant="h6" gutterBottom>
                    General Settings
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Site Title" variant="outlined" placeholder="Enter site title" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Admin Email" variant="outlined" placeholder="Enter admin email" />
                    </Grid>
                </Grid>
            </Paper>

            <Paper sx={{ padding: 3, marginBottom: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Notification Settings
                </Typography>
                <FormControlLabel control={<Switch defaultChecked />} label="Enable Email Notifications" />
                <FormControlLabel control={<Switch />} label="Enable Push Notifications" />
            </Paper>

            <Paper sx={{ padding: 3, marginBottom: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Security Settings
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Password Policy"
                            variant="outlined"
                            placeholder="Enter password policy"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Session Timeout (minutes)"
                            variant="outlined"
                            placeholder="Enter session timeout"
                        />
                    </Grid>
                </Grid>
            </Paper>

            <Box sx={{ textAlign: 'right' }}>
                <Button variant="contained" color="primary">
                    Save Changes
                </Button>
            </Box>
        </Box>
    );
};

export default AdminSetting;
