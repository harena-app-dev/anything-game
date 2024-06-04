import React, { use, useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import { Alert, Stack, TextField, Typography } from '@mui/material';
import Log from '@/scripts/log';

export default function ({ app, ...props }) {
	// const { registry, systems } = app;
	const [registry, systems] = app.get();
	function sendChatMessage(e) {
		const value = e.target.value;
		const client = systems.get("Client");
		// create a new message entity
		client.promiseCreate().then((entity) => {
			client.promiseEmplace("Message", entity, { value })
				.then((message) => {
				});
		});
		e.target.value = '';
	}
	function getMessages() {
		return registry.view("Message").map((entity, message) => {
			return message.value;
		})
	}
	const [messages, setMessages] = useState(getMessages());
	useEffect(() => {
		Log.debug(`Chat.useEffect`);
		registry.onEmplace("Message").connect((entity) => {
			setMessages(getMessages());
		});
	}, []);
	return (
		<Box {...props}>
			<Stack spacing={0}>
				<Typography component="pre">
					{"Use mouse left/right click and scroll to move camera."} 
				</Typography>
				{messages.map((message, i) => (
					<Typography key={i} component="pre">
						{message}</Typography>
				))}
				<TextField placeholder="/help"
				variant="outlined" onKeyDown={(e) => {
					if (e.key === 'Enter') {
						sendChatMessage(e);
					}
				}} />
			</Stack>
		</Box>
	);
}