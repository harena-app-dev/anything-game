import Expandable from "./Expandable";
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
import Alert from '@mui/material/Alert';

export default function ({ entity, registry }) {
	// const [entityState, setEntityState] = useState(registry.get(entity));
	// useEffect(function () {
	// 	const updateObserver = (registry: Registry, id: number) => {
	// 		setEntityState(registry.get(entity));
	// 	};
	// 	registry.addOnUpdate(entity, updateObserver);
	// 	return () => {
	// 		registry.removeOnUpdate(entity, updateObserver);
	// 	};
	// }, []);
	// function createExpandableNode() {
	// 	const str = JSON.stringify(entityState, null, 2);
	// 	if (entityState.skillAttributes === undefined) {
	// 		return <div className="row">
	// 			<div className="col grow text-wrap">
	// 				{str}
	// 			</div>
	// 			<div className="col title button grow" onClick={() => {
	// 			}}>
	// 				create attributes
	// 			</div>
	// 		</div >
	// 	}
	// 	return <div className="col">
	// 		<pre className="row">
	// 			{str}
	// 		</pre>
	// 		<SkillAttributes entity={entity} registry={registry} />
	// 	</div>
	// };
	// return <Expandable expandableNode={createExpandableNode}>
	// return <Expandable expandableNode={() => {
	// 	return <div className="col">
	// 		<Menu>
	// 			<MenuItem >Skills</MenuItem>
	// 			<MenuItem >Integrity</MenuItem>
	// 		</Menu>
	// 	</div>
	// }}>
	// 	{entity}
	// </Expandable>
	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};
	const types = registry.getTypes({ entity });
	return (
		<Accordion>
			<AccordionSummary
				expandIcon={<ExpandMoreIcon />}
				aria-controls="panel1-content"
				id="panel1-header"
			>
				Entity {entity}
			</AccordionSummary>
			<AccordionDetails>
				<Button
					id="basic-button"
					aria-controls={open ? 'basic-menu' : undefined}
					aria-haspopup="true"
					aria-expanded={open ? 'true' : undefined}
					onClick={handleClick}
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
				<Menu
					id="basic-menu"
					anchorEl={anchorEl}
					open={open}
					onClose={handleClose}
					MenuListProps={{
						'aria-labelledby': 'basic-button',
					}}
				>
					{registry.getSingleton({ type: 'RegisteredComponents' }).components.map(component => {
						return <MenuItem key={component}
							onClick={handleClose}>{component}</MenuItem>
					})}
				</Menu>
			</AccordionDetails>
		</Accordion>
	);
}