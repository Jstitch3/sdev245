import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto'
import { createInterface } from 'node:readline'

const algorithm = 'aes-256-cbc'
const key = randomBytes(32)
const iv = randomBytes(16)

/**
 * @param {string} text
 */
function decrypt(text){
    const decipher = createDecipheriv(algorithm, key, iv)
    let decrypted = decipher.update(text, 'hex', 'utf8')
    decrypted += decipher.final('utf8')

    return decrypted
}
/**
 * @param {string} text
 */
function encrypt(text){
    const cipher = createCipheriv(algorithm, key, iv)
    let encrypted = cipher.update(text, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    
    return encrypted
}
/**
 * @param {import('node:crypto').BinaryLike} data
 */
function sha256(data){
    return createHash('sha256').update(data).digest('hex')
}

const rl = createInterface({
    input: process.stdin,
    output: process.stdout
})

rl.question('Enter a message to secure: ', (input) => {
    console.log(`\nOriginal message: ${input}`)

    const originalHash = sha256(input)
    console.log(`SHA-256 hash: ${originalHash}`)

    const encrypted = encrypt(input)
    console.log(`Encrypted (AES-256): ${encrypted}`)

    const decrypted = decrypt(encrypted)
    console.log(`Decrypted: ${decrypted}`)

    const decryptedHash = sha256(decrypted)
    const isValid = originalHash === decryptedHash
    console.log(`Integrity check: ${isValid ? 'Passed' : 'Failed'}`)

    rl.close()
})