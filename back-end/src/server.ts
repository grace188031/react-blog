import express from 'express';
const app = express();
const port = 8000;

app.use(express.json());

app.get('/hello', (req, res) => {
  res.send('Hello from a GET Engdpoint!');
});

app.post('/hello', (req, res) => {
  res.send(`Hello, ${req.body.name} from a POST Endpoint!`);
});

app.post('/hello/:firstname', (req, res) => {
  res.send(`Hello, ${req.params.firstname} from a POST Endpoint!`);
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
