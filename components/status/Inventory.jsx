import React, { use, useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import { Alert, Icon, LinearProgress, Stack, TextField, Typography, linearProgressClasses, styled } from '@mui/material';
import Log from '@/scripts/log';
import ShieldIcon from '@mui/icons-material/Shield';
export default function ({ app, ...props }) {
	const { registry, systems } = app;
	useEffect(() => {
	}, []);
	const sx = {
		...props.sx,
		width: 100,
		p: 0,
		backgroundColor: 'rgba(0,0,0,0.5)',
	};
	delete props.sx;
	const itemWidth = 25;
	const itemJsx = <div className='itemIcon' style={{ width: itemWidth, height: itemWidth }}>
		<ShieldIcon />
	</div>
	return (
		<div className='row' style={{ width: 100, height: 100,  backgroundColor: 'rgba(0,0,0,0.5)' }}>
			{
				[...Array(8)].map((_, i) => (
					itemJsx
				))
			}
		</div>
	);
}