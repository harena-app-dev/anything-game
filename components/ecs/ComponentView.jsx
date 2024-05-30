import { useEffect, useState } from "react";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import * as React from 'react';
import ComponentView from "./ComponentView";
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

export default function ({ entity, registry, type }) {
	const [expanded, setExpanded] = useState(true); 
	return <Accordion expanded={expanded}>
		<AccordionSummary
			expandIcon={<ExpandMoreIcon />}
			aria-controls="panel1-content"
			id="panel1-header"
		>
			{type}
		</AccordionSummary>
		<AccordionDetails>
			<TextField
				label="JSON"
				multiline
				value={JSON.stringify(registry.get(type, entity), null, 2)}
				disabled
			/>
		</AccordionDetails>
	</Accordion>
}