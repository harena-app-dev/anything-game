import React, { use, useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import { Alert, LinearProgress, Stack, TextField, Typography, linearProgressClasses, styled } from '@mui/material';
import Log from '@/scripts/Log';
import Points from './Points';

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
			<Points app={app} />\
		</Box>
	);
}