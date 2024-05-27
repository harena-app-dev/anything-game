import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';

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

export default function ({ registry, entity, type }) {
	const [open, setOpen] = React.useState(false);
	const handleOpen = () => {
		setOpen(true);
	};
	const handleClose = () => {
		setOpen(false);
	};
	return (
		<React.Fragment>
			<Button onClick={handleOpen}>{type}</Button>
			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="child-modal-title"
				aria-describedby="child-modal-description"
			>
				<Box sx={{ ...style }}>
					<h2 id="child-modal-title">{`Add component "${type}" to entity ${entity}`}</h2>
		
					<Button onClick={handleClose}>Close Child Modal</Button>
				</Box>
			</Modal>
		</React.Fragment>
	);
}