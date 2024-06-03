'use client'
import React, { } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from '@/components/App';

const darkTheme = createTheme({
	palette: {
		mode: 'dark',
	},
});

export default function GamePage() {
	// return <ThemeProvider theme={darkTheme}>
	// 	<CssBaseline />
	// 	<App />
	// </ThemeProvider>
	return <App />
}
