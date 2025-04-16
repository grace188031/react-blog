import express from 'express';
import { MongoClient,ServerApiVersion } from 'mongodb';
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


app.post('/api/articles/:articleName/upvote', async (req, res) => {
  const { articleName } = req.params;

  const updatedArticle = await db.collection('articles').findOneAndUpdate({articleName }, {
      $inc: { upvotes: 1 }
    }, {
      returnDocument: 'after',
  });
  res.json(updatedArticle);
});

app.post('/api/articles/:articleName/comments', (req, res) => {
  const { articleName } = req.params;
  const { postedBy, text } = req.body;
  const article = articleInfo.find(a => a.articleName === articleName);
  article.comments.push({ 
    postedBy, 
    text });
  res.json(article);
});


app.get('/api/articles/:articleName', async (req, res) => {
  const { articleName } = req.params;
  const article = await db.collection('articles').findOne({ articleName } );
  res.json(article);
});

async function start() {
  await connectToDB();

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
}

start();