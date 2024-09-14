import bcrypt from "bcryptjs"

export class PasswordService{
    async passwordHash(password:string):Promise<string>{
        const HashedPssword=await bcrypt.hash(password,10)
        return HashedPssword
    }
    async verifyPassword(password:string,userPassword:string):Promise<boolean>{
        const verifiedPassword=await bcrypt.compare(password,userPassword)
        return verifiedPassword
    }
}