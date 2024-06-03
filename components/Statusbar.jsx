import { LinearProgress } from "@mui/material";

export default function ({ app, icon }) {
	return <div style={{
		display: 'flex',
		flexDirection: 'row',
		width: '100%',
		margin: 0,
		padding: 0,
	}}>
		<div style={{
		}}>
			{icon}
		</div>
		<div style={{
			width: '100%',
		}}>
			<LinearProgress variant="determinate"
				value={75}
				color="primary"
				sx={{
					height: 25,
				}}
			/>
		</div>
	</div>
}