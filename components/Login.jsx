import React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { GoogleLogin } from '@react-oauth/google';

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: '80%',
	bgcolor: 'background.paper',
	border: '2px solid #000',
	boxShadow: 24,
	pt: 2,
	px: 4,
	pb: 3,
};
export default function ({ }) {
	const [open, setOpen] = React.useState(true);
	const responseMessage = (response) => {
		console.log(response);
	};
	const errorMessage = (error) => {
		console.log(error);
	};
	return (
		<Modal
			open={open}
			aria-labelledby="child-modal-title"
			aria-describedby="child-modal-description"
		>
			<Box sx={{ ...style }}>
				{/* <GoogleLogin onSuccess={responseMessage} onError={errorMessage} /> */}
			</Box>
		</Modal>
	);
}