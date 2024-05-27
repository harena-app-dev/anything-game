'use client'
import React, { useEffect, useRef, useState } from 'react'
import WebSocketMessager from '@/scripts/client/WebSocketMessager';
import RegistryView from '@/components/ecs/RegistryView';
import { NetworkedRegistry } from '@/scripts/NetworkedRegistry';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Entity from '@/scripts/dnd/Entity';
import EntityView from '@/components/ecs/EntityView';
import Console from '@/components/Console';
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
