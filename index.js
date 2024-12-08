/* eslint-disable no-undef */
const express = require("express");
const app = express();
const cors = require("cors");

require("dotenv").config();
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

//middleware
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@salman.uweo3xy.mongodb.net/?retryWrites=true&w=majority&appName=Salman`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const database = client.db("MovieDB");
    const movieCollection = database.collection("Movies");

    app.get("/movies", async (req, res) => {
      const result = await movieCollection.find().toArray();
      res.send(result);
    });

    app.post("/add-movie", async (req, res) => {
      const movie = req.body;
      const result = await movieCollection.insertOne(movie);
      res.send(result);
    });

    app.get("/movie/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await movieCollection.findOne(query);
      res.send(result);
    });

    app.put("/movie/:id", async (req, res) => {
      const id = req.params.id;
      const updatedMovie = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          title: updatedMovie.title,
          description: updatedMovie.description,
          genre: updatedMovie.genre,
          duration: updatedMovie.duration,
          releaseYear: updatedMovie.releaseYear,
          rating: updatedMovie.rating,
          poster: updatedMovie.poster,
        },
      };
      const result = await movieCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    app.delete("/movie/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await movieCollection.deleteOne(query);
      res.send(result);
    });

    //user collection
    const userCollection = database.collection("Users");

    app.post("/users", (req, res) => {
      const user = req.body;

      const result = userCollection.insertOne(user);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
