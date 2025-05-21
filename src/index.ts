import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { UserService } from './services/userService';
import { startServers } from './app';

function setupCLI() {
    const userService = new UserService();
    return yargs(hideBin(process.argv))
        .scriptName('uba-ims')
        .version('1.0.0')
        .command(
            'user:create',
            'Create a new user',
            (yargs) => yargs
                .option('fname', {
                    type: 'string',
                    demandOption: true,
                    describe: 'First name',
                })
                .option('lname', {
                    type: 'string',
                    demandOption: true,
                    describe: 'Last name',
                }),
            async (argv) => {
                const newUser = await userService.createUser({
                    fname: argv.fname as string,
                    lname: argv.lname as string,
                    email:argv.email as string,
                    password:argv.password as string
                });
                console.log('User created successfully!', newUser);
            }
        )
        .command(
            'user:list',
            'List Users',
            (yargs) => yargs
                .option('fname', {
                    type: 'string',
                    describe: 'First name',
                })
                .option('lname', {
                    type: 'string',
                    describe: 'Last name',
                }),
            async (argv) => {
                const users = await userService.getUsers({
                    fname: argv.fname as string | undefined,
                    lname: argv.lname as string | undefined,
                    email:argv.email as string| undefined,
                });
                console.table(users);
            }
        )
        .command(
            'user:update <id>',
            'Update a user by ID',
            (yargs) => yargs
                .positional('id', {
                    describe: 'User ID to update',
                    type: 'string',
                })
                .option('fname', { type: 'string', describe: 'New First name' })
                .option('lname', { type: 'string', describe: 'New Last name' }),
            async (argv) => {
                const updatedUser = await userService.updateUser(argv.id as string, argv);
                console.log('User updated successfully:', updatedUser);
            }
        )
        .command(
            'user:delete <id>',
            'Delete a user by ID',
            (yargs) => yargs.positional('id', {
                describe: 'User ID to delete',
                type: 'string',
            }),
            async (argv) => {
                const deletedUser = await userService.deleteUser(argv.id as string);
                console.log('User deleted successfully:', deletedUser);
            }
        )
        .demandCommand()
        .strict()
        .help()
        .parse();
}

async function main() {
    if (process.argv.length > 2) {
        setupCLI();
    } else {
        try {
            await startServers();
            console.log('Servers started successfully');
        } catch (error) {
            console.error('Failed to start servers:', error);
            process.exit(1);
        }
    }
}