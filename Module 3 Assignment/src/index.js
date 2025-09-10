import { createHash, createSign, createVerify, generateKeyPairSync, KeyObject } from 'node:crypto'
import { readFileSync } from 'node:fs'

/**
 * @param {string} text
 * @param {number} shift
 */
function caesarDecrypt(text, shift){
    return caesarEncrypt(text, 26 - (shift % 26))
}
/**
 * @param {string} text
 * @param {number} shift
 */
function caesarEncrypt(text, shift){
    return text.replace(/[a-zA-Z]/g, (char) => {
        const base = char <= 'Z' ? 65 : 97
        return String.fromCharCode(((char.charCodeAt(0) - base + shift) % 26) + base)
    })
}

/**
 * @param {string} file
 */
function hashFile(file){
    const fileBuffer = readFileSync(file)
    return createHash('sha256').update(fileBuffer).digest('hex')
}
/**
 * @param {string} input
 */
function hashString(input){
    return createHash('sha256').update(input).digest('hex')
}

/**
 * @param {string} message
 */
function signMessage(message){
    const { privateKey, publicKey } = generateKeyPairSync('rsa', {modulusLength: 2048})

    const signer = createSign('sha256')
    signer.update(message)
    signer.end()

    const signature = signer.sign(privateKey, 'hex')

    return { message, signature, publicKey}
}
/**
 * @param {string} message
 * @param {string} signature
 * @param {KeyObject} publicKey
 */
function verifySignature(message, signature, publicKey){
    const verifier = createVerify('sha256')
    verifier.update(message)
    verifier.end()

    return verifier.verify(publicKey, signature, 'hex')
}


console.log(`SHA-256 (string): ${hashString('hello world')}`)
console.log(`Caesar Encrypt: ${caesarEncrypt('Hello World', 3)}`)
console.log(`Caesar Decrypt: ${caesarDecrypt(caesarEncrypt('Hello World', 3), 3)}`)

const { message, signature, publicKey } = signMessage('Secret Message')
console.log(`Signature: ${signature}`)

const verified = verifySignature(message, signature, publicKey.export({format: 'pem', type: 'pkcs1'}).toString())
console.log(`Verified: ${verified}`)