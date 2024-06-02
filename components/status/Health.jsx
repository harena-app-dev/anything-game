import React, { use, useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import { Alert, LinearProgress, Stack, TextField, Typography, linearProgressClasses, styled } from '@mui/material';
import Log from '@/scripts/Log';

export default function ({ app, ...props }) {
	const { registry, systems } = app;
	useEffect(() => {
	}, []);
	const progressHeight = 25;
	const sx = {
		...props.sx,
		width: 400,
	};
	delete props.sx;
	return (
		<Box sx={sx} {...props}>
			<Stack direction="column" spacing={0}>
				<LinearProgress variant="determinate" value={25} sx={{
					height: progressHeight,
					backgroundColor: 'white',
				}}
				/>
				<LinearProgress variant="determinate" value={25} sx={{
					height: progressHeight,
					backgroundColor: 'white',
				}}
					// color="secondary" 
					/>
			</Stack>
		</Box>
	);
}