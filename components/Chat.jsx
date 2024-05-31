import React, { use, useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import { Alert, Stack, TextField, Typography } from '@mui/material';
import Log from '@/scripts/Log';

export default function ({ registry, systems, ...props }) {
	function sendChatMessage(e) {
		const value = e.target.value;
		const client = systems.get("Client");
		// create a new message entity
		client.promiseCreate().then((entity) => {
			client.promiseEmplace("Message", entity, { value })
				.then((message) => {
					Log.info(`Chat.sendChatMessage`, message);
				});
		});
		e.target.value = '';
	}
	function getMessages() {
		return registry.view("Message").map((entity, message) => {
			Log.info(`Chat.onEmplace`, entity);
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
			<Stack spacing={2}>
				{messages.map((message, i) => (
					<Typography key={i} component="pre">
						{message}</Typography>
				))}
				<TextField label="Send a message" variant="outlined" onKeyDown={(e) => {
					if (e.key === 'Enter') {
						sendChatMessage(e);
					}
				}} />
			</Stack>
		</Box>
	);
}