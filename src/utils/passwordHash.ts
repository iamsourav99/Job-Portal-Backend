import bcrypt from "bcrypt";

export const  hashPassword =async(password:string,saltValue:number)=>{
    const encryptPass: string = await bcrypt.hash(password, saltValue);
    return encryptPass
}

export const varifyPassword = async(password:string,dbPassword:string)=>{
    const isPassValid = await bcrypt.compare(password, dbPassword);
    return isPassValid;
}