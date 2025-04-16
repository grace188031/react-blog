import express from 'express';
const app = express();
const port = 8000;

const articleInfo = [
  { articleName: 'learn-node', upvotes: 0,},
  { articleName: 'learn-react', upvotes: 0},
  { articleName: 'mongodb', upvotes: 0},
]

app.use(express.json());

app.post('/api/articles/:articleName/upvote', (req, res) => {
  const article = articleInfo.find(a => a.articleName === req.params.articleName);
  article.upvotes += 1;
  res.send(`The article with the name: ${req.params.articleName} now has ${article.upvotes} upvotes!`);
});

// We can also use this syntax for upvote
// app.post('/api/articles/:articleName/upvote', (req, res) => {
//   const { articleName } = req.params;
//   const article = articleInfo.find(a => a.articleName === articleName);
//   article.upvotes += 1;
//   res.send(`The article with the name: ${articleName} now has ${article.upvotes} upvotes!`);
// });


app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
