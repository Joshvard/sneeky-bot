/**
 * Sneeky Bot - Beta 0.9.0!
 */

 // Load the disord bot node.js API
const discord = require('discord.js');

// Load our configurations
const config = require('./includes/config.json');

// Load and run the main program loop
const ProgramHandler = require('./main');
const programHandler = new ProgramHandler(discord, config);
programHandler.main();