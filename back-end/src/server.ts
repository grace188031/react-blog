import express, { Request, Response, NextFunction } from 'express';
import { MongoClient, Db, ServerApiVersion, Document } from 'mongodb';
import admin from 'firebase-admin';
import fs from 'fs';
import  { fileURLToPath } from 'url';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// TypeScript declaration for Express Request to include user property
declare global {
  namespace Express {
    interface Request {
      user?: admin.auth.DecodedIdToken;
    }
  }
}

// const serviceAccount = JSON.parse(
//   fs.readFileSync('./credentials.json', 'utf-8')
// );

// environment variable for Firebase credentials
const serviceAccountJson = process.env.FIREBASE_CREDENTIALS_JSON;
if (!serviceAccountJson) {
  throw new Error('Missing FIREBASE_CREDENTIALS_JSON environment variable');
}

const serviceAccount = JSON.parse(serviceAccountJson);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
const port = 8000;

app.use(express.json());

let db: Db;

async function connectToDB(): Promise<void> {
  const uri = process.env.MONGODB_USERNAME 
  ? `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.DATABASE_NAME}/?retryWrites=true&w=majority&appName=Cluster0`
  : 'mongodb://127.0.0.1:27017';
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });


  await client.connect();
  db = client.db('full-stack-react-db');
}

app.use(express.static(path.join(__dirname, '../public/dist')));

app.get(/^(?!\/api).+/), (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../public/dist', 'index.html'));
};


app.get('/api/articles/:articleName', async (req: Request, res: Response) => {
  const { articleName } = req.params;
  const article = await db.collection('articles').findOne({ articleName });
  res.json(article);
});

app.use(async (req: Request, res: Response, next: NextFunction) => {
  const authtoken = req.headers.authtoken as string | string[] | undefined;

  if (authtoken) {
    try {
      const token = Array.isArray(authtoken) ? authtoken[0] : authtoken;
      const user = await admin.auth().verifyIdToken(token);
      req.user = user;
      next();
    } catch {
      res.sendStatus(400);
    }
  } else {
    res.sendStatus(400);
  }
});

// ✅ Fixed: wrapped route callback in non-async function to match Express overload expectations
app.post('/api/articles/:articleName/upvote', (req: Request, res: Response) => {
  (async () => {
    const { articleName } = req.params;
    const { uid } = req.user!;

    const article = await db.collection('articles').findOne({ articleName });
    if (!article) return res.sendStatus(404);

    const upvoteIds: string[] = article.upvoteIds || [];
    const canUpvote = uid && !upvoteIds.includes(uid);

    if (canUpvote) {
      const updatedArticle = await db.collection('articles').findOneAndUpdate(
        { articleName },
        {
          $inc: { upvotes: 1 },
          $push: { upvoteIds: uid as unknown as any }, // ✅ Force-cast to fix TS typing error
        },
        { returnDocument: 'after' }
      );
      res.json(updatedArticle);
    } else {
      res.sendStatus(403);
    }
  })();
});

app.post('/api/articles/:articleName/comments', (req: Request, res: Response) => {
  (async () => {
    const { articleName } = req.params;
    const { postedBy, text }: { postedBy: string; text: string } = req.body;

    const newComment = { postedBy, text };

    const updatedArticle = await db.collection('articles').findOneAndUpdate(
      { articleName },
      {
        $push: { comments: newComment as unknown as any },
      },
      { returnDocument: 'after' }
    );
  })});
  // Use environment variable PORT if available, otherwise default to 8000
  const PORT = process.env.PORT || 8000;

  async function start(): Promise<void> {
    await connectToDB();
    app.listen(PORT, () => {
      console.log(`Express is listening at http://localhost:${PORT}`);
    });
  }
  
  start();