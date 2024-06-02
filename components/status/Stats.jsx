import React, { use, useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import { Alert, Icon, LinearProgress, Stack, TextField, Typography, linearProgressClasses, styled } from '@mui/material';
import Log from '@/scripts/Log';
import ShieldIcon from '@mui/icons-material/Shield';
export default function ({ app, ...props }) {
	const { registry, systems } = app;
	useEffect(() => {
	}, []);
	const sx = {
		...props.sx,
		width: 200,
		p: 1,
		backgroundColor: 'rgba(0,0,0,0.5)',
	};
	delete props.sx;
	return (
		<Box sx={sx} {...props} className="row">
			<Box className="row">
				<ShieldIcon />
				<Typography variant="h6">100</Typography>
			</Box>
			<Box className="row">
				<ShieldIcon />
				<Typography variant="h6">100</Typography>
			</Box>
			<Box className="row">
				<ShieldIcon />
				<Typography variant="h6">100</Typography>
			</Box>
			<Box className="row">
				<ShieldIcon />
				<Typography variant="h6">100</Typography>
			</Box>
			<Box className="row">
				<ShieldIcon />
				<Typography variant="h6">100</Typography>
			</Box>
			<Box className="row">
				<ShieldIcon />
				<Typography variant="h6">100</Typography>
			</Box>
			<Box className="row">
				<ShieldIcon />
				<Typography variant="h6">100</Typography>
			</Box>
			<Box className="row">
				<ShieldIcon />
				<Typography variant="h6">100</Typography>
			</Box>
		</Box>
	);
}