import express from 'express';
import { MongoClient,ServerApiVersion } from 'mongodb';
import admin, { auth } from 'firebase-admin';
import fs from 'fs';

const serviceAccount = JSON.parse(
  fs.readFileSync('./credentials.json')
);


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});


const app = express();
const port = 8000;


app.use(express.json());

let db;

async function connectToDB() {

  const uri = 'mongodb://127.0.0.1:27017';
  const client = new MongoClient(uri, {
    serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

  await client.connect();
  db = client.db('full-stack-react-db');
}

app.get('/api/articles/:articleName', async (req, res) => {
  const { articleName } = req.params;
  const article = await db.collection('articles').findOne({ articleName } );
  res.json(article);
});

// Middleware to check every request if the user is authenticated. The next is a callback function that is called when the middleware is done. It is used to pass control to the next middleware function in the stack.
app.use(async function(req, res, next) {
  // authtoken is the name of the header that we are sending from the front-end to the back-end. It is used to identify the user.
  // assigning the authtoken to the constant variable authtoken
  const { authtoken } = req.headers;

  // use firebase-admin to verify the token. If the token is valid, it will return the user object. If the token is invalid, it will throw an error.
  if (authtoken) {
    // verifyIdToken is a method that verifies the token and returns the user object. The user object contains the uid, email, and other information about the user.
    // The authtoken is passed to the verifyIdToken method to verify the token.
    const user  = await admin.auth().verifyIdToken(authtoken);
    // The user object is assigned to the req.user variable. This variable can be used in the next middleware function to identify the user. Sample are the post endpoints below.
    req.user = user;
  } else {
    res.sendStatus(400);
  }
  // Done with the middleware function. The next() function is called to pass control to the next middleware function in the stack.
  next();
  });

app.post('/api/articles/:articleName/upvote', async (req, res) => {
  const { articleName } = req.params;

  const updatedArticle = await db.collection('articles').findOneAndUpdate({articleName }, {
      $inc: { upvotes: 1 }
    }, {
      returnDocument: 'after',
  });
  res.json(updatedArticle);
});

app.post('/api/articles/:articleName/comments', async (req, res) => {
  const { articleName } = req.params;
  console.log(articleName)
  const { postedBy, text } = req.body;
  console.log(postedBy, text)
  const newComment = { postedBy, text };
  console.log(newComment)
  const updatedComment = await db.collection('articles').findOneAndUpdate({ articleName }, {
    $push: { comments: newComment } 
  }, {
    returnDocument: 'after',
  });
  res.json(updatedComment);
});



async function start() {
  await connectToDB();

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
}

start();