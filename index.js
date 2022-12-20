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

const {
    v4: uuidv4,
    validate: uuidValidate
} = require('uuid');
require('dotenv').config()



const client = new MongoClient(process.env.FINAL_URL)


let users = [];
app.use(cors())
app.use(express.json())

///code from coding along session of Mike Derycke (https://www.youtube.com/@MikeDerycke)

app.get("/testMongo", async (req, res) => {
    try {
        //connect to the db
        await client.connect()

        //retrieve the usres collection data
        const colli = client.db('Nft_Universe').collection('users')
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
            uuid: uuidv4()
        }


        //retrieve the usres collection data
        const colli = client.db('Nft_Universe').collection('users')
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
        return;
    }



    try {
        //connect to the db
        await client.connect()

        const loginuser = {
            email: req.body.email,
            password: req.body.password,
        }

        //retrieve the users collection data
        const colli = client.db('Nft_Universe').collection('users')
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
                message: "Incorrect password for this email"
            })
            return;
        }
        res.status(200).send({
            status: "Verifed",
            message: "You are successfully logged in!",
            data: {
                username: user.username,
                email: user.email,
                uuid: user.uuid,
            }

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

app.post("/verifyID", async (req, res) => {

    //check for empty and faulty ID fields
    if (!req.body.uuid) {
        res.status(400).send({
            status: "bad request",
            message: "ID is missing"
        })
        return;
    } else {
        if (!uuidValidate(req.body.uuid)) {
            res.status(400).send({
                status: "bad request",
                message: "ID is not a valid UUID"
            })
            return;
        }

    }



    try {
        //connect to the db
        await client.connect()

        //retrieve the users collection data
        const colli = client.db('Nft_Universe').collection('users')
        const query = {
            uuid: req.body.uuid
        }
        const user = await colli.findOne(query)



        if (user) {
            res.status(200).send({
                status: "Verifed",
                message: "Your UUID is valid",
                data: {
                    username: user.username,
                    email: user.email,
                    uuid: user.uuid,
                }

            })

        } else {
            res.status(400).send({
                status: "Verify error",
                message: `No user exists with uuid ${req.body.uuid}`
            })
            return;
        }

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
/// 

///inspiration from coding along session(https://www.youtube.com/@MikeDerycke)

app.post("/like", async (req, res) => {
    try {
        //connect to the db
        await client.connect()

        //retrieve the users collection data
        const colli = client.db('Nft_Universe').collection('likes')

        const check = await colli.findOne({
            collectionId: req.body.collectionId,
            userId: req.body.userId

        })
        if (check) {
            res.status(400).send({

                message: "You already have liked this collection",


            })
            return
        }


        const user = await colli.insertOne({
            collectionId: req.body.collectionId,
            userId: req.body.userId,
            title: req.body.title,
            img: req.body.img,
            rank: req.body.rank,
            price: req.body.price
        })

        res.status(201).send({
            status: "Saved",
            message: "Your like has been successfully saved",
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

app.get("/like/:id", async (req, res) => {

    try {
        //connect to the database
        await client.connect()

        console.log(JSON.stringify(req.params.id))

        //retrieve the like collection

        const colli = client.db('Nft_Universe').collection('likes')

        const likedItem = await colli.find({

            userId: req.params.id

        }).toArray()

        res.status(201).send({

            data: likedItem,

            status: "Success",

        })

    } catch (error) {
        res.status(400).send({

            error: "An error has occured!",

            value: error

        })

    } finally {
        await client.close()
    }

})

app.delete("/deleteLike", async (req, res) => {
    try {

        //connect to the db

        await client.connect();

        //retrieve the users collection data

        const colli = client.db('Nft_Universe').collection('likes')

        const likes = await colli.findOneAndDelete({

            collectionId: req.query.collectionId,
            userId: req.query.userId
        })

        if (likes) {
            res.status(200).send({
                status: "Success",
                message: "Your like has been deleted !"

            })
            return

        } else {

            res.status(401).send({
                status: "Bad Request",
                message: "Can't delete your like"

            })

            return

        }

    } catch (error) {

        console.log(error)

        res.status(500).send({

            error: 'Something went wrong!',

            value: error

        });

    } finally {

        await client.close();

    }

})
app.put("/changename", async (req, res) => {
    if (!req.body.username) {

        res.status(401).send({
            status: "Bad Request",
            message: " New username is missing"

        })

        return

    }

    try {
        //connect to the db
        await client.connect();


        //retrieve the users collection data

        const colli = client.db('Nft_Universe').collection('users')

        const user = await colli.updateOne({
            uuid: req.query.id

        }, {
            $set: {
                username: req.body.username

            }
        })
        res.status(200).send({

            message: 'Your username is succesfully updated !'

        })

    } catch (error) {

        console.log(error)
        res.status(500).send({

            error: 'Something went wrong!',
            value: error

        });

    } finally {

        await client.close();

    }

})
///








app.listen(PORT, () => {
    console.log(`app running at http://localhost:${PORT}`);
})