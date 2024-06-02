'use client'
import React, { } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import App from '@/components/App';

const Item = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
	...theme.typography.body2,
	padding: theme.spacing(1),
	textAlign: 'center',
	color: theme.palette.text.secondary,
}));



const darkTheme = createTheme({
	palette: {
		mode: 'dark',
	},
});

export default function GamePage() {
	return <ThemeProvider theme={darkTheme}>
		<CssBaseline />
		<App />
	</ThemeProvider>
}
