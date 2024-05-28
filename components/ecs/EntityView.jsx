import Expandable from "../old/Expandable";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionActions from '@mui/material/AccordionActions';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import * as React from 'react';
import ComponentView from "./ComponentView";
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { Skeleton, Stack } from "@mui/material";
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';

import { Accordion, AccordionSummary, AccordionDetails } from '../Accordion';
import AddComponent from "./AddComponent";

export default function ({ entity, registry }) {
	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);
	const openMenu = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const closeMenu = () => {
		setAnchorEl(null);
	};
	// const types = registry.getTypes({ entity });
	// const [types, setTypes] = React.useState(registry.getTypes({ entity }));
	const [types, setTypes] = React.useState(registry.getTypes({ entity }));
	// console.log(`types: ${JSON.stringify
	// console.log(`registry: ${JSON.stringify(registry, null, 2)}`);
	console.log(`types: ${JSON.stringify(types, null, 2)}`);
	console.log(`reg types: ${JSON.stringify(registry.getTypes({ entity }), null, 2)}`);
	React.useEffect(() => {
		const callback = ({ entity, type, component }) => {
			setTypes(registry.getTypes({ entity }));
		}
		registry.onEmplaceAny.connect(callback);
		return () => {
			registry.onEmplaceAny.disconnect(callback);
		}
	}, []);
	const details = (!registry.valid({ entity })) ? <AccordionDetails>
		<Alert severity="error">
			Entity {entity} does not exist.
		</Alert>
	</AccordionDetails> : <AccordionDetails>
			<Stack spacing={2}>
				<Button
					id="basic-button"
					aria-controls={open ? 'basic-menu' : undefined}
					aria-haspopup="true"
					aria-expanded={open ? 'true' : undefined}
					onClick={openMenu}
				>
					Add Component
				</Button>
				{
					types.length === 0 ? <Alert severity="info">
						This entity has no components.
					</Alert> :
						types.map(type => {
							return <ComponentView key={type} entity={entity} type={type} registry={registry} />
						})
				}
			</Stack>
			<Menu
				id="basic-menu"
				anchorEl={anchorEl}
				open={open}
				onClose={closeMenu}
				MenuListProps={{
					'aria-labelledby': 'basic-button',
				}}
			>
				{
					Object.keys(registry.typesToConstructors).map(component => {
						return <AddComponent key={component} entity={entity} type={component} registry={registry} closeMenu={closeMenu} />
					})
				}
			</Menu>
		</AccordionDetails>
	return (
		<Accordion defaultExpanded>
			<AccordionSummary
				expandIcon={<ExpandMoreIcon />}
				aria-controls="panel1-content"
				id="panel1-header"
			>
				Entity {entity}
			</AccordionSummary>
			{details}
		</Accordion>
	);
}