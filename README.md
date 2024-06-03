# Moddable Javascript Game
A very moddable game.
You can add anything you'd like to the game. E.g. add content/functionality for first-person shooting, MOBA, RPG, RTS, or any other genre

- ECS pattern
	- automatic registration of components and systems
	- easy multiplayer
		- server-client architecture
		- automatic synchronization of components with observers 
		- automatically-generated remote-procedure functions for your systems
- React for UI
- ThreeJS for rendering
- NextJS for frontend
- Potential future systems
	- Replace Websockets with WebRTC for lower latency
	- Add WebGPU GPGPU for high performance
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

There are 2 servers running simultaneously:
1. NextJS server
2. Game server