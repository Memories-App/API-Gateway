import chalk from 'chalk';

export const LoggingTool = {
    error: (message: string) => {
        console.log(chalk.red(message));
    }, 
    info: (message: string) => {
        console.log(chalk.blue(message));
    }, 
    success: (message: string) => {
        console.log(chalk.green(message));
    },
    warning: (message: string) => {
        console.log(chalk.yellow(message));
    }
}