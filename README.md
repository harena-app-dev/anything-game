# Moddable Javascript Game
A very moddable, open-source game.
You can add anything you'd like to the game. E.g. add content/functionality for first-person shooting, MOBA, RPG, RTS, or any other genre
## License
Perhaps you can use this project as a game engine, and pay 1% of your revenue as royalties. 
## Collaboration
Am looking for collaborators of any background. Contact me if you're interested.
## Features
- ECS pattern
	- automatic registration of components and systems
	- easy multiplayer
		- server-client architecture
		- automatic synchronization of components with observers 
		- automatically-generated remote-procedure functions for your systems
- React + NextJS for UI
- ThreeJS for 3D graphics
- Potential future systems
	- Add WebRTC for better networking
	- Add WebGPU GPGPU for higher performance graphics and systems
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