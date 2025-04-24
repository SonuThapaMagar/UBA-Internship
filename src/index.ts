import yargs from "yargs";
import { hideBin } from 'yargs/helpers';
import { userCreate } from "./handler/userCreate";
import { userList } from "./handler/userList";
import { userUpdate } from "./handler/userUpdate";
import { userDelete } from "./handler/userDelete";
import { startServer } from "./server";

//Starting yargs cli
yargs(hideBin(process.argv))
    .scriptName("uba-ims")
    .version("1.0.0")
    .command(
        "user:create",
        "Create a new user",
        (yargs) => {
            return yargs
                .option("fname", { type: "string", demandOption: true, describe: "First name" })
                .option("lname", { type: "string", demandOption: true, describe: "Last name" });
        },
        async (argv) => {
            await userCreate({
                fname: argv.fname as string, lname: argv.lname as string
            })
        }
    )
    .command(
        "user:list",
        "List Users",
        (yargs) => {
            return yargs
                .option("fname", { type: "string", describe: "First name" })
                .option("lname", { type: "string", describe: "Last name" });
        },
        async (argv) => {
            await userList({
                fname: argv.fname as string | undefined,
                lname: argv.lname as string | undefined
            })
        }
    )
    .command(
        "user:update <id>",
        "Update a user by ID",
        (yargs) => {
            return yargs
                .positional("id", {
                    describe: "User ID to update",
                    type: "string"
                })
                .option("fname", { type: "string", describe: "New First name" })
                .option("lname", { type: "string", describe: "New Last name" });
        },
        async (argv) => {
            await userUpdate(argv.id as string,argv)
        }

    )
    .command(
        "user:delete <id>",
        "Delete a user by ID",
        (yargs) => {
            return yargs.positional("id", {
                describe: "User ID to delete",
                type: "string"
            });
        },
        async (argv) => {
            await userDelete({ id: argv.id as string });
        }

    )
    .demandCommand()
    .strict()
    .help()
    .parse();
