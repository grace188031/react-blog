import express, { Request, Response, NextFunction } from 'express';
import { MongoClient, Db, ServerApiVersion, Document } from 'mongodb';
import admin from 'firebase-admin';
import fs from 'fs';


// TypeScript declaration for Express Request to include user property
declare global {
  namespace Express {
    interface Request {
      user?: admin.auth.DecodedIdToken;
    }
  }
}

const serviceAccount = JSON.parse(
  fs.readFileSync('./credentials.json', 'utf-8')
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
const port = 8000;

app.use(express.json());

let db: Db;

async function connectToDB() {
  const uri = 'mongodb://127.0.0.1:27017';
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