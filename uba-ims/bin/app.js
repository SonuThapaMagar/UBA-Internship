#!/usr/bin/env node
const { program } = require("commander");
const chalk = require("chalk");

program
  .name("uba-ims")
  .description(chalk.blue("UBA IMS - User Management System"))
  .version("1.0.0");

program.parse(process.argv);
