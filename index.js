const express = require('express')
const app = express()
const cors = require('cors')
const PORT = 1200



let users = [];

app.use(cors())
app.use(express.json())



app.listen(PORT, () => {
    console.log(`app running at http://localhost:${PORT}`);
})

app.post("/register", (req, res) => {

    try {

        if (!req.body.username || !req.body.email || !req.body.password) {
            res.status(400).send({
                status: "bad request",
                message: "Missing username, mail, password"
            })
            return;
        }

        //looking for doubles 
        let user = users.find(el => el.email == req.body.email)
        if (user) {
            res.status(400).send({
                status: "bad request",
                message: "This email is already used"
            })
            return;
        }

        //creating user
        let newUser = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password

        }
        users.push(newUser)

        //success message
        res.status(201).send({
            status: "Authentification successfull",
            message: "Your account has been successfully created"
        })
        console.log(users)
        return;

    } catch (error) {
        console.log(error)
        res.status(400).send({
            error: 'An error has occured!',
            value: error
        })
    }

});


app.post("/login", (req, res) => {

    try {

        if (!req.body.email || !req.body.password) {
            res.status(400).send({
                status: "bad request",
                message: " Missing mail, password"
            })
            return;
        }

        let email = users.find(element => element.email == req.body.email)
        let password = users.find(element => element.password == req.body.password)
        //If not user is found, send back an appropiate error
        if (!email) {
            res.status(400).send({
                status: "bad request",
                message: "No account with this email! Make sure you register first."
            })
            return;
        }
        //If a user is found but the password is wrong, send back an appropiate error
        if (email && !password) {
            res.status(400).send({
                status: "bad request",
                message: "Enter the correct password for this email"
            })
            return;
        }
        //success message
        res.status(201).send({
            status: "Authentification successfull",
            message: "sucessfully logged in !"
        })
        return;

    } catch (error) {
        console.log(error)
        res.status(400).send({
            error: 'An error has occured!',
            value: error
        })
    }
})