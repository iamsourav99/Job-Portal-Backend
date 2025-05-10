import bcrypt from "bcrypt";
export const hashPassword = async (password, saltValue) => {
    const encryptPass = await bcrypt.hash(password, saltValue);
    return encryptPass;
};
export const varifyPassword = async (password, dbPassword) => {
    const isPassValid = await bcrypt.compare(password, dbPassword);
    return isPassValid;
};
