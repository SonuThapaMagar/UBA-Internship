#!/usr/bin/env node
const { program } = require('commander');
const userCreate =require('../src/commands/userCreate')

program
  .name("uba-ims")
  .description("UBA IMS - User Management System")
  .version("1.0.0");

//User create command
program
  .command("user:create")
  .description("Create a new user")
  .action((options) => userCreate(options))
  .requiredOption("--fname <firstname>", "User first name")
  .requiredOption("--lname <lastname>", "User last name");

program.parse(process.argv);
