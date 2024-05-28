import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import { MenuItem, Stack, TextField } from '@mui/material';

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
	const handleClose = (e) => {
		setOpen(false);
		e.stopPropagation();
	};
	const [json, setJson] = React.useState(JSON.stringify(registry.typesToConstructors[type](), null, 2));
	const handleEmplace = (e) => {
		e.stopPropagation();
		registry.fetchEmplace({ entity, type, component: JSON.parse(json) })
			.then((comp) => {
				setOpen(false);
				console.log(`Emplaced component ${JSON.stringify(comp)}`);
			});
	};
	return (
		<MenuItem onClick={handleOpen}>
			{type}
			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="child-modal-title"
				aria-describedby="child-modal-description"
			>
				<Box sx={{ ...style }}>
					<Stack spacing={2}>
						<h2 id="child-modal-title">{`Add component "${type}" to entity ${entity}`}</h2>
						<TextField
							label="JSON"
							multiline
							value={json}
							onChange={(e) => setJson(e.target.value)}
						/>
						<Stack spacing={2} direction="row">
							<Button onClick={handleClose}>Cancel</Button>
							<Button onClick={handleEmplace}>Emplace</Button>
						</Stack>
					</Stack>
				</Box>
			</Modal>
		</MenuItem>
	);
}