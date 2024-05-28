export default function ({ registry }) {
	registry.onEmplace['Notification'].connect(({ entity, component }) => {
		const { severity } = component;
		console.log(`Snackbar: ${severity}`);
	});
}