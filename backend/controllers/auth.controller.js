
async function signup(req, res)
{
    res.send("Signup route");
}

async function login(req, res)
{
    res.send("Login route");
}

async function logout(req, res)
{
    res.send("Logout route");
}


export { signup, login, logout }