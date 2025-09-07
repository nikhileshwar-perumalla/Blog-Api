export const genUsername = () => { 
    const usernamePrefix = 'User-';
    const randomstring = Math.random().toString(36).slice(2);
    const username = usernamePrefix + randomstring;
    return username;
}