import fg from 'fast-glob'
import fs from 'node:fs'
import logger from './logger.js'
import { patterns } from './patterns.js'

function isBinaryBuffer(buf){
    for(let i = 0; i < 24 && i < buf.length; i++){
        if(buf[i] === 0) return true
    }

    return false
}

async function scan(targetPath, options = {}){
    const results = []
    const stat = fs.statSync(targetPath)

    const excludes = options.excludes || []

    let files = []
    if(stat.isDirectory()){
        const ignore = excludes.map(e => `**/${e}/**`)

        files = await fg(['**/*.*', '**/*'], {
            absolute: true,
            cwd: targetPath,
            dot: true,
            followSymbolicLinks: false,
            ignore,
            onlyFiles: true,
            suppressErrors: true
        })
    } else if(stat.isFile()) files = [targetPath]
    else throw new Error('Target is neither file nor directory')

    logger.info(`Scanning ${files.length} file(s)`)

    for(const file of files){
        try {
            const buf = fs.readFileSync(file)
            if(isBinaryBuffer(buf)){
                logger.debug(`Skipping binary file ${file}`)
                continue
            }

            const text = buf.toString('utf8')
            const lines = text.split(/\r?\n/)
            for(let i = 0; i < lines.length; i++){
                const line = lines[i]

                for(const pattern of patterns){
                    try {
                        let m

                        if(pattern.regex.global) pattern.regex.lastIndex = 0

                        while((m = pattern.regex.exec(line)) !== null){
                            const match = m[0]

                            results.push({
                                file,
                                line: i + 1,
                                match,
                                note: pattern.note ?? '',
                                patternName: pattern.name,
                            })

                            logger.debug(`Match: ${pattern.name} in ${file}:${i+1} => ${match}`)

                            if(!pattern.regex.global) break
                        }
                    } catch(err){
                        logger.error(`Pattern error for ${pattern.name}: ${err.message}`)
                    }
                }
            }
        } catch(err){
            logger.error(`Failed to read ${file}: ${err.message}`)
        }
    }

    return results
}

export { scan }