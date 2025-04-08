#!/usr/bin/env node
const { program } = require("commander");
const userCreate = require("../src/commands/userCreate");
const userList =require('../src/commands/userList')

program
  .name("uba-ims")
  .description("UBA IMS - User Management System")
  .version("1.0.0");

//User create command
program
  .command("user:create")
  .description("Create a new user")
  .requiredOption("--fname <firstname>", "User first name")
  .requiredOption("--lname <lastname>", "User last name")
  .action((options) => userCreate(options));

//User List / Read command
program
  .command("user:read")
  .description("List all users or search by name")
  .option("--fname <firstname>", "Search by first name")
  .option("--lname <lastname>", "Search by last name")
  .action((options) => userList(options));
program.parse(process.argv);
