const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();

// middleware
app.use(cors());

const port = process.env.PORT || 5000;

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.wjvzlqr.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	serverApi: ServerApiVersion.v1,
});
client.connect((err) => {
	const collection = client.db("test").collection("devices");
	// perform actions on the collection object
	console.log("db connected");
	client.close();
});

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
