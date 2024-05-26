import { useEffect, useState } from "react";
import EntityView from "@/components/EntityView";
import AccordionSummary from '@mui/material/AccordionSummary';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { Stack } from "@mui/material";

export default function RegistryView({ registry }) {
	const [entityElements, setEntityElements] = useState([]);
	useEffect(function () {
		console.log(`useEffect`);
		const observer = ({ entity }) => {
			setEntityElements((entityElements) => {
				return [...entityElements, <EntityView key={entity} registry={registry} entity={entity} />];
			});
		};
		registry.onCreate.connect(observer);
		return () => {
			registry.onCreate.disconnect(observer);
		};
	}, []);
	const [width, setWidth] = useState(256);
	return <Box className='row grow' sx={{ p: 2 }}>
		<Stack className='col' spacing={2}>
			<Typography variant="overline" display="block" gutterBottom>
				entitites
			</Typography>
			<Button variant="contained"
				onClick={() => {
					registry.cmdCreate();
				}}>
				+
			</Button>
			<Stack className=' grow col scroll-y'>
				{
					entityElements
				}
			</Stack>
		</Stack>
	</Box>

}