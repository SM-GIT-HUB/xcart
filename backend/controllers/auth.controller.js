import userModel from "../lib/database/models/user.model.js"

async function signup(req, res)
{
    try {
        const { email, password, name } = req.body;
        console.log(email, password, name);

        if (!email || !password || !name) {
            return res.status(400).json({ message: "Please provide all the details" });
        }

        const user = await userModel.findOne({ email });

        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        const newUser = await userModel.create({ name, email, password });

        res.status(201).json({ message: "Signup successful" });
    }
    catch(err) {
        console.log("error in signup:", err.message);
        res.status(500).json({ message: "Something went wrong" });
    }
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