import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import * as React from 'react';
import ComponentView from "./ComponentView";
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import { Stack } from "@mui/material";

import { Accordion, AccordionSummary, AccordionDetails } from '../Accordion';
import AddComponent from "./AddComponent";
import { nullEntity } from "@/scripts/Registry";

export default function ({ entity, registry, client }) {
	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);
	const openMenu = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const closeMenu = () => {
		setAnchorEl(null);
	};
	const types = registry.getTypes(entity);
	let details;
	if (entity === nullEntity) {
		details = <AccordionDetails>
			<Alert severity="info">
				Select an entity to view its components.
			</Alert>
		</AccordionDetails>
	} else if (!registry.valid({ entity })) {

		<AccordionDetails>
			<Alert severity="error">
				Entity {entity} does not exist.
			</Alert>
		</AccordionDetails>
	} else {
		details = <AccordionDetails>
			<Stack spacing={1}>
				<Typography variant="overline" display="block" gutterBottom>
					ID {entity}
				</Typography>
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
						return <AddComponent key={component} entity={entity} type={component} registry={registry} closeMenu={closeMenu} client={client} />
					})
				}
			</Menu>
		</AccordionDetails>
	}
	return (
		<Accordion defaultExpanded>
			<AccordionSummary
				expandIcon={<ExpandMoreIcon />}
				aria-controls="panel1-content"
				id="panel1-header"
			>
				Entity
			</AccordionSummary>

			{details}
		</Accordion>
	);
}