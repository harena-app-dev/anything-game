import {Accordion, AccordionDetails, AccordionSummary} from './Accordion';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import * as React from 'react';
import TextField from '@mui/material/TextField';
import { Stack } from "@mui/material";

export default function Console({ registry }) {
	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};
	return (
		<Accordion defaultExpanded>
			<AccordionSummary
				expandIcon={<ExpandMoreIcon />}
				aria-controls="panel1-content"
				id="panel1-header"
			>
				Console
			</AccordionSummary>
			<AccordionDetails>
				<Stack spacing={2}>
				</Stack>
				<TextField
					id="outlined-textarea"
					label="Enter a command"
					placeholder="Command"
					multiline
				/>
			</AccordionDetails>
		</Accordion>
	);
}