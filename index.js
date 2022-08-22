const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
//middlware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.9yspxbn.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const usersProflieCollection = client
      .db("hypescout")
      .collection("usersProflie");

    // users profile get api
    app.get("/usersprofile", async (req, res) => {
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);
      const name = req.query.name;
      const query = {};
      let users;
      if (name || page || size) {
        const allUsers = await usersProflieCollection.find(query).toArray();
        users = allUsers.filter((user) =>
          user.userName.toLowerCase().includes(name.toLocaleLowerCase())
        );
      } else if (name || page || size) {
        users = await usersProflieCollection
          .find(query)
          .skip(page * size)
          .limit(size)
          .toArray();
      } else {
        users = await usersProflieCollection.find(query).toArray();
      }

      res.send(users);
    });
    // user profile count
    app.get("/usersprofilecount", async (req, res) => {
      const count = await usersProflieCollection.estimatedDocumentCount();
      res.send({ count });
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hypescout server");
});

app.listen(port, () => {
  console.log(`Hypescout server running ${port}`);
});
