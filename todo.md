[ ] System Registry
	[ ] pre-index system source directories
	[ ] iterate over systems and store them in a dictionary
	[ ] call them at specific times: init, update, render, shutdown
[ ] View
	[ ] store the current .each's intersection set in the view object
	[ ] move the current .each to the view object
[ ] View Excludes
	[ ] View
	[ ] add a "excludes" field to the .view function
	[ ] for each entity in the intersection set, check if it has any of the excluded components
	[ ] if it does, remove it from the intersection set
[ ] Movement 
	[ ] Movement component: speed, direction
	[ ] each Movement; integrate speed and direction onto Position
[ ] Mass
	[ ] Mass component: mass
[ ] Inventory
	[ ] Mass
	[ ] Inventory component: items, spaceCapacity
	[ ] Item component: inventory
	[ ] onReplace Mass: update spaceCapacity
	[ ] onReplace Inventory: update spaceCapacity
[ ] Text-command-based control
	[ ] /observe
		get a summary of the current state of the game
	[ ] /moveTo target
		move the player to the target's position
	[ ] /transfer source destination
		transfer an item from the source to the destination
	[ ] /say message
		say a message
	[ ] /use item target
		use an item on a target

[ ] combat system
[ ] animation system
[ ] entity save/load 
	[ ] copy the entity
		[ ] create a new entity
		[ ] copy the components
	[ ] add a Disabled component the 
[ ] UI: filter entities by component
	[ ] filter entities button
	[ ] on click, open modal
	[ ] in modal, show a button for each component
	[ ] on click, fetchView of entities with that component
	[ ] replace the entities list with fetched entities
[ ] add a button to erase components in ComponentView
	[ ] on click, fetchErase
	effect: can now erase components from entities
[ ] replace-components ui
	[ ] add a button to edit a existing component's JSON
	[ ] on click, make the text area editable
	[ ] add a button to save the changes
	[ ] add a button to cancel the changes
	effect: can now replace components from entities


[ ] quest system
	effect: can do quests
[ ] save/load system
	effect: can save and load the game
[ ] sound system
	effect: can hear sounds
[ ] music system
	effect: can hear music
[ ] particle system
	effect: can see particles
[ ] lighting system
	effect: can see light
[ ] camera system
	effect: can see the game
[ ] UI system
	effect: can see the UI
[ ] input system
	effect: can use input
[ ] physics system
	effect: can see physics
[ ] AI system
	effect: can see AI
[ ] networking system
	effect: can play with others
[ ] localization system
	effect: can play in different languages
[ ] modding system
	effect: can mod the game
[ ] testing system
	effect: can test the game
[ ] documentation system
	effect: can read the docs
[ ] build system
	effect: can build the game
[ ] deployment system
	effect: can deploy the game
[ ] analytics system
	effect: can see analytics
[ ] monetization system
	effect: can make money
[ ] social system
	effect: can share the game
[ ] support system
	effect: can get help
[ ] update system
	effect: can update the game
[ ] security system
	effect: can protect the game
[ ] performance system
	effect: can optimize the game
[ ] version control system
	effect: can version the game
[ ] bug tracking system
	effect: can track bugs
[ ] task tracking system
	effect: can track tasks
[ ] team management system
	effect: can manage the team
[ ] project management system
	effect: can manage the project
[ ] time management system
	effect: can manage the time
[ ] resource management system
	effect: can manage the resources
[ ] risk management system
	effect: can manage the risks
[ ] quality management system
	effect: can manage the quality
[ ] knowledge management system
	effect: can manage the knowledge
[ ] change management system
	effect: can manage the changes
[ ] communication system
	effect: can communicate
[ ] collaboration system
	effect: can collaborate
[ ] learning system
	effect: can learn
[ ] teaching system	