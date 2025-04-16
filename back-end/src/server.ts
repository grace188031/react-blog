import express from 'express';
import { MongoClient,ServerApiVersion } from 'mongodb';
const app = express();
const port = 8000;

// const articleInfo = [
//   { articleName: 'learn-node', upvotes: 0, comments: [] },
//   { articleName: 'learn-react', upvotes: 0, comments: [] },
//   { articleName: 'mongodb', upvotes: 0,  comments: [] },
// ]

app.use(express.json());

app.post('/api/articles/:articleName/upvote', (req, res) => {
  const article = articleInfo.find(a => a.articleName === req.params.articleName);
  article.upvotes += 1;
  res.json(article);
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

// We can also use this syntax for upvote
// app.post('/api/articles/:articleName/upvote', (req, res) => {
//   const { articleName } = req.params;
//   const article = articleInfo.find(a => a.articleName === articleName);
//   article.upvotes += 1;
//   res.send(`The article with the name: ${articleName} now has ${article.upvotes} upvotes!`);
// });

app.get('/api/articles/:articleName', async (req, res) => {
  const { articleName } = req.params;
  const uri = 'mongodb://127.0.0.1:27017';
  const client = new MongoClient(uri, {
    serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
  });

  await client.connect();
  const db = client.db('full-stack-react-db');
  const article = await db.collection('articles').findOne({ articleName } );
  res.json(article);
});


app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
