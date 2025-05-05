import yargs from "yargs";
import { hideBin } from 'yargs/helpers';
import { userService } from "./services/userService";
// import { startServer } from "./server";
// import { startGraphQLServer } from './graphql/graphqlServer';
import { startServers } from "./app";
 

//CLI Command Definitions
function setupCLI() {
    return yargs(hideBin(process.argv))
        .scriptName("uba-ims")
        .version("1.0.0")
        .command(
            "user:create",
            "Create a new user",
            (yargs) => yargs
                .option("fname", {
                    type: "string",
                    demandOption: true,
                    describe: "First name"
                })
                .option("lname", {
                    type: "string",
                    demandOption: true,
                    describe: "Last name"
                }),
            async (argv) => {
                await userService.createUser({
                    fname: argv.fname as string,
                    lname: argv.lname as string
                })
                console.log("User created successfully!");
            }
        )
        .command(
            "user:list",
            "List Users",
            (yargs) => yargs
                .option("fname", {
                    type: "string",
                    describe: "First name"
                })
                .option("lname", {
                    type: "string",
                    describe: "Last name"
                }),
            async (argv) => {
                await userService.getUsers({
                    fname: argv.fname as string | undefined,
                    lname: argv.lname as string | undefined
                })

            }
        )
        .command(
            "user:update <id>",
            "Update a user by ID",
            (yargs) => yargs
                .positional("id", {
                    describe: "User ID to update",
                    type: "string"
                })
                .option("fname", { type: "string", describe: "New First name" })
                .option("lname", { type: "string", describe: "New Last name" }),
            async (argv) => {
                await userService.updateUser(argv.id as string, argv)
            }

        )
        .command(
            "user:delete <id>",
            "Delete a user by ID",
            (yargs) => yargs.positional("id", {
                describe: "User ID to delete",
                type: "string"
            }),
            async (argv) => {
                await userService.deleteUser(argv.id as string);
            }

        )
        .demandCommand()
        .strict()
        .help()
        .parse();
}

async function main() {
    if (process.argv.length > 2) {
        //CLI mode
        setupCLI();
    } else {
        // Server Mode
        try {
            await startServers();
            // await startServer(); // REST API
            // await startGraphQLServer(); // GraphQL
            console.log('Servers started successfully');
        } catch (error) {
            console.error('Failed to start servers:', error);
            process.exit(1);
        }
    }
}
