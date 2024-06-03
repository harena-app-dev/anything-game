import React, { use, useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import { Alert, LinearProgress, Stack, TextField, Typography, linearProgressClasses, styled } from '@mui/material';
import Log from '@/scripts/Log';
import Health from './Health';
import Stats from './Stats';
import Inventory from './Inventory';

export default function ({ app, ...props }) {
	const { registry, systems } = app;
	useEffect(() => {
	}, []);
	const sx = {
		...props.sx,
		width: 1500,
	};
	delete props.sx;
	return (
		// <Box sx={sx} {...props}>
		// 	<Stack direction="row" spacing={0}>
		// 		<Stats app={app} />
		// 		<Points app={app} />
		// 	</Stack>
		// </Box>
		<Health app={app} />
		// <Inventory app={app} />
	);
}