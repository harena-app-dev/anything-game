import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import { Alert, Stack, TextField, Typography } from '@mui/material';
import Log from '@/scripts/Log';

export default function ({ registry, systems, ...props }) {
	function sendChatMessage(e) {
		const message = e.target.value;
		Log.debug(`sendChatMessage`, message);
		e.target.value = '';
	}
	return (
		<Box {...props}>
			<Stack spacing={2}>
				<Typography variant="h6">You have joined the game!</Typography>
				<TextField label="Send a message" variant="outlined" onKeyDown={(e) => {
					if (e.key === 'Enter') {
						sendChatMessage(e);
					}
				}} />
			</Stack>
		</Box>
	);
}