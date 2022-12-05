const express = require('express')
const app = express()
const cors = require('cors')
const PORT = 1200
const {
    MongoClient
} = require("mongodb")
const {
    ppid
} = require('process')
require('dotenv').config()

const client = new MongoClient(process.env.FINAL_URL)


let users = [];
app.use(cors())
app.use(express.json())

app.get("/testMongo", async (req, res) => {
    try {
        //connect to the db
        await client.connect()

        //retrieve the usres collection data
        const colli = client.db('loginsystem').collection('users')
        const users = await colli.find({}).toArray()


        //send back the file
        res.status(200).send(users)
    } catch (error) {
        res.status(500).send({
            error: 'something went wrong',
            value: error
        })


    } finally {
        await client.close()
    }
})



app.post("/register", async (req, res) => {



    if (!req.body.username || !req.body.email || !req.body.password) {
        res.status(400).send({
            status: "bad request",
            message: "Missing username, mail, password"
        })
        return;
    }

    try {
        //connect to the db
        await client.connect()

        const user = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
        }


        //retrieve the usres collection data
        const colli = client.db('loginsystem').collection('users')
        const insertedUser = await colli.insertOne(user)


        //send back response when user is saved
        res.status(201).send({
            status: "Saved",
            message: "Your account has been successfully created",
            data: insertedUser
        })
        return;

    } catch (error) {
        res.status(500).send({
            error: 'something went wrong',
            value: error
        })


    } finally {
        await client.close()
    }
});


app.post("/login", async (req, res) => {
    if (!req.body.email || !req.body.password) {
        res.status(400).send({
            status: "bad request",
            message: " Missing mail, password"
        })
    }



    try {
        //connect to the db
        await client.connect()

        const loginuser = {
            email: req.body.email,
            password: req.body.password,
        }

        //retrieve the users collection data
        const colli = client.db('loginsystem').collection('users')
        const query = {
            email: loginuser.email
        }
        const user = await colli.findOne(query)



        if (!user) {
            res.status(400).send({
                status: "bad request",
                message: "No account with this email! Make sure you register first."
            })
            return;
        }
        //If a user is found but the password is wrong, send back an appropiate error
        if (user.password !== loginuser.password) {
            res.status(400).send({
                status: "bad request",
                message: "Enter the correct password for this email"
            })
            return;
        }
        res.status(200).send({
            data: user,
            message: "sucessfully logged in !"

        })



    } catch (error) {
        console.log(error)
        res.status(400).send({
            error: 'An error has occured!',
            value: error
        })
    } finally {
        await client.close()
    }

})

app.listen(PORT, () => {
    console.log(`app running at http://localhost:${PORT}`);
})