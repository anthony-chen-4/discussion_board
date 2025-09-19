import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import dotenv from "dotenv"
dotenv.config()

import { db } from "./util/FirebaseInit.js";
import { collection, getDocs, addDoc, query, orderBy } from "firebase/firestore"

const app = express()
const port = 8080;

app.use(express.json())
app.use(
	cors({
		origin: "http://localhost:3000"
	})
)
app.use(bodyParser.urlencoded({ extended: false }))

app.get("/posts", async (req, res) => {
	try {
	  const q = query(collection(db, "posts"), orderBy("createdAt"));
	  const snapshot = await getDocs(q);
	  const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
	  res.json(posts);
	} catch (err) {
	  console.error("Error fetching posts:", err);
	  res.json([]); 
	}
  });
  
app.post("/posts", async (req, res) => {
	const { text } = req.body;
	if (!text) return res.status(400).json({ error: "Post text required" });

	try {
		const docRef = await addDoc(collection(db, "posts"), { text, createdAt: new Date() });
		res.json({ id: docRef.id, text });
	} catch (err) {
		console.error("Error adding post:", err);
		res.status(500).json({ error: "Failed to add post" });
	}
});

function start() {
	app.listen(port, () => {
		console.log(`Started listening on http://localhost:${port}`)
	})
}

start()
