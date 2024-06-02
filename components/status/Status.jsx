import React, { use, useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import { Alert, LinearProgress, Stack, TextField, Typography, linearProgressClasses, styled } from '@mui/material';
import Log from '@/scripts/Log';
const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
	height: 15,
	borderRadius: 0,
	[`&.${linearProgressClasses.colorPrimary}`]: {
		backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
	},
	[`& .${linearProgressClasses.bar}`]: {
		borderRadius: 5,
		backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
	},
}));
export default function ({ app, ...props }) {
	const { registry, systems } = app;
	useEffect(() => {
	}, []);
	const progressHeight = 25;
	const sx = {
		...props.sx,
		width: 300,
	};
	delete props.sx;
	return (
		<Box sx={sx} {...props}>
			<Stack direction="column" spacing={0}>
				<LinearProgress variant="determinate" value={25} sx={{
					height: progressHeight,
				}}
					color="success" />
				<LinearProgress variant="determinate" value={25} sx={{
					height: progressHeight,
				}}
					color="secondary" />
			</Stack>
		</Box>
	);
}