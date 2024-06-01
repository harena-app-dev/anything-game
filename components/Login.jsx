import React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { Button, Stack, TextField, Typography } from '@mui/material';

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	bgcolor: 'background.paper',
	border: '2px solid #000',
	boxShadow: 24,
	pt: 2,
	px: 4,
	pb: 3,
};
export default function ({ registry, systems }) {
	const [open, setOpen] = React.useState(true);
	function login() {
		const username = document.getElementById('username').value;
		const password = document.getElementById('password').value;
	};

	return (
		<Modal
			open={open}
			aria-labelledby="child-modal-title"
			aria-describedby="child-modal-description"
		>
			<Box sx={{ ...style }}>
				<Stack spacing={2}>
					<Typography id="child-modal-title" variant="h6" component="h2">
							Login
					</Typography>
					<TextField label="Username" variant="filled" id="username" />
					<TextField label="Password" variant="filled" id="password" />
					<Button variant="contained">Login</Button>
					<Button variant="contained">Create Account</Button>
				</Stack>
			</Box>
		</Modal>
	);
}