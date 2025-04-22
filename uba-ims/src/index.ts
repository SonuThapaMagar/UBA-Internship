import yargs from "yargs";
import { hideBin } from 'yargs/helpers';
import { userCreate } from "./handler/userCreate";
import { userList } from "./handler/userList";
import { userUpdate } from "./handler/userUpdate";

//Starting yargs cli
yargs(hideBin(process.argv))
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
        "user:update",
        "Update User",
        (yargs) => {
            return yargs
                .option("id", { type: "string", demandOption: true, describe: "User ID to update" })
                .option("fname", { type: "string", describe: "First name" })
                .option("lname", { type: "string", describe: "Last name" });
        },
        async (argv) => {
            await userUpdate(argv.id as string, {
                fname: argv.fname as string | undefined,
                lname: argv.lname as string | undefined
            })
        }

    )
    .demandCommand()
    .strict()
    .help()
    .parse();
