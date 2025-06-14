const express = require('express');
const {MongoClient, ObjectId} = require('mongodb')
const app = express ();
const port = 8001;
app.use(express.json())
app.use(express.static('public'))

async function getDbCollection(dbAdress, dbName, dbCollectionName){
	const client = new MongoClient(dbAdress);
	await client.connect();
	const db = client.db(dbName);
	return db.collection(dbCollectionName);
}
app.get('/task', async function (req, res){
	const collection = await getDbCollection('mongodb://localhost','todoapp','task');
	const data = await collection.find({}).toArray();
	res.send(data)
});
app.get('/task/:id', async function (req, res){
	const collection = await getDbCollection('mongodb://localhost','todoapp','task');
	const data = await collection.findOne({_id: new ObjectId(req.params.id)});
	res.send(data)
});
app.post('/task', async function (req, res){
	const task = {...req.body, done: false};
	const collection = await getDbCollection('mongodb://localhost','todoapp','task');
	await collection.insertOne(task);
	res.send(task)
});
app.patch('/task/:id', async function (req, res){
	const collection = await getDbCollection('mongodb://localhost','todoapp','task');
	const data = await collection.updateOne({_id: new ObjectId(req.params.id)},{'$set': req.body});
	res.send('uzmeneniy vneseni')
});
app.delete('/task/:id', async function (req, res){
	const collection = await getDbCollection('mongodb://localhost','todoapp','task');
	await collection.deleteOne({_id: new ObjectId(req.params.id)});
	res.send('delete complite')
});
app.listen(port, function (){
	console.log('server is started');
});