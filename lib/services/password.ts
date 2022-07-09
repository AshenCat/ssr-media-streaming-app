import { randomBytes, scrypt } from "crypto";
import { promisify } from "util";


const scryptAsync = promisify(scrypt);

export class Password {
    /**
     * Takes in password string and generates an encrypted string.
     * @param password user password to be hashed
     * @returns encrypted string
     */
    static async toHash(password: string) {
        const salt = randomBytes(8).toString('hex');
        const buf = (await scryptAsync(password, salt, 64)) as Buffer;
        return `${buf.toString('hex')}.${salt}}`
    }

    /**
     * Compares encrypted password to a supplied password
     * @param storedPassword string
     * @param suppliedPassword string
     * @returns boolean comparing if the two passwords are equal
     */
    static async compare(storedPassword: string, suppliedPassword: string) {
        const [hashedPassword, salt] = storedPassword.split('.');
        const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;

        return buf.toString('hex') === hashedPassword;
    }
}