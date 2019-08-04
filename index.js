const discord = require('discord.js');
const config = require('./includes/config.json');
const ProgramHandler = require('./main');
const programHandler = new ProgramHandler(discord, config);

programHandler.main();