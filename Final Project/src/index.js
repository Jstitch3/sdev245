import chalk from 'chalk'
import { Command } from 'commander'
import fs from 'node:fs'
import logger from './logger.js'
import path from 'node:path'
import { scan } from './scanner.js'

const program = new Command()

program
    .name('secret-scan')
    .description('Scan files or directories for hardcoded secrets')
    .version('1.0.0')
    .argument('<target>', 'file or directory to scan')
    .option('-o, --output <file>', 'write JSON report to file')
    .option('-e, --exclude <patterns>', 'comma-separated glob(s) to exclude')
    .option('-r --report-format <fmt>', 'report format: json | text', 'text')
    .option('-v, --verbose', 'show debug logs')
    .action(async(target, options) => {
        try {
            logger.init(options.verbose)

            const absTarget = path.resolve(process.cwd(), target)
            logger.info(`Starting scan for ${absTarget}`)

            const excludes = options.exclude?.split(',')?.map(s => s.trim())?.filter(Boolean)

            const results = await scan(absTarget, {excludes})

            if(!results || results.length === 0) console.log(chalk.green('No potential secrets found'))
            else {
                if(options.reportFormat === 'json'){
                    const out = JSON.stringify(results, null, 2)

                    if(options.output){
                        fs.writeFileSync(path.resolve(options.output), out, 'utf8')
                        console.log(chalk.green(`Saved JSON report to ${options.output}`))
                    } else console.log(out)
                } else {
                    console.log(chalk.yellow(`Found ${results.length} potential secret(s):`))

                    for(const result of results){
                        console.log(chalk.cyan(`\nFile: ${result.file}`))
                        console.log(`   Line ${result.line}: ${result.match}`)
                        console.log(`   Pattern: ${result.patternName}`)
                    }

                    if(options.output){
                        fs.writeFileSync(path.resolve(options.output), JSON.stringify(results, null, 2), 'utf8')
                        console.log(chalk.green(`Saved JSON report to ${options.output}`))
                    }
                }
            }

            logger.info('Scan complete')
        } catch(err){
            logger.error(err.message || String(err))
            console.error(chalk.red('Error:'), err)

            process.exit(1)
        }
    })

program.parse(process.argv)