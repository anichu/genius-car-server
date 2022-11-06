const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();
const morgan = require("morgan");

// middleware
app.use(cors());
app.use(express.json());

if (process.env.NODE_DEV === "development") {
	app.use(morgan("dev"));
}
const port = process.env.PORT || 5000;

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const { query } = require("express");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.wjvzlqr.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	serverApi: ServerApiVersion.v1,
});

async function run() {
	try {
		const servicesCollection = client.db("genius-car").collection("services");
		const orderCollection = client.db("genius-car").collection("orders");

		// const result = await servicesCollection.insertOne({});
		app.get("/services", async (req, res) => {
			const query = {};
			const cursor = servicesCollection.find(query);
			const services = await cursor.toArray();
			res.send(services);
		});
		app.get("/services/:id", async (req, res) => {
			const id = req.params.id;
			const query = { _id: ObjectId(id) };
			const service = await servicesCollection.findOne(query);

			res.send(service);
		});

		app.post("/orders", async (req, res) => {
			const order = req.body;
			const result = await orderCollection.insertOne(order);
			res.send(result);
		});
		app.delete(`/orders/:id`, async (req, res) => {
			const id = req.params.id;
			const query = {
				_id: ObjectId(id),
			};
			const result = await orderCollection.deleteOne(query);
			res.send(result);
		});
		app.patch("/orders/:id", async (req, res) => {
			const id = req.params.id;
			const data = req.body;
			console.log(data);
			const filter = {
				_id: ObjectId(id),
			};
			const updateDoc = {
				$set: {
					...data,
				},
			};
			const options = {
				upsert: true,
			};
			const result = await orderCollection.updateOne(
				filter,
				updateDoc,
				options
			);
			res.send(result);
		});
		app.get("/orders", async (req, res) => {
			let query = {};
			if (req.query.email) {
				query = {
					email: req.query.email,
				};
			}

			const cursor = orderCollection.find(query);
			const orders = await cursor.toArray();
			res.send(orders);
		});
	} catch (err) {
		console.log(err);
	}
}

run().catch((err) => console.log(err));

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
