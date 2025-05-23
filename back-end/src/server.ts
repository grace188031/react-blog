import express, { Request, Response, NextFunction } from 'express';
import { MongoClient, Db, ServerApiVersion, Document } from 'mongodb';
import admin from 'firebase-admin';
import fs from 'fs';
import  { fileURLToPath } from 'url';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';


// TypeScript declaration for Express Request to include user property
declare global {
  namespace Express {
    interface Request {
      user?: admin.auth.DecodedIdToken;
    }
  }
}
let credentials: any;

// Function to fetch secrets from AWS Secrets Manager
async function loadSecrets() {
  const secretsManager = new SecretsManagerClient({ region: process.env.AWS_REGION });
  const secret = await secretsManager.send(
    new GetSecretValueCommand({ SecretId: 'react-blog-secrets' })
  );
  credentials = JSON.parse(secret.SecretString || '{}');
}


const app = express();
const port = 8000;

app.use(express.json());

let db: Db;

async function connectToDB(): Promise<void> {
  const uri = credentials.MONGODB_USERNAME 
  ? `mongodb+srv://${credentials.MONGODB_USERNAME}:${credentials.MONGODB_PASSWORD}@${credentials.DATABASE_NAME}/?retryWrites=true&w=majority&appName=Cluster0`
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

app.post('/api/articles/:articleName/comments', async (req, res) => {
  const { articleName } = req.params;
  console.log(articleName)
  const { postedBy, text } = req.body;
  console.log(postedBy, text)
  const newComment = { postedBy, text };
  console.log(newComment)
  const updatedComment = await db.collection('articles').findOneAndUpdate({ articleName }, {
    $push: { comments: newComment as unknown as any} 
  }, {
    returnDocument: 'after',
  });
  res.json(updatedComment);
});

  // Use environment variable PORT if available, otherwise default to 8000
  const PORT = process.env.PORT || 8000;

  async function start(): Promise<void> {
    await loadSecrets();
    // environment variable for Firebase credentials
  const serviceAccountJson = credentials.FIREBASE_CREDENTIALS_JSON;
  if (!serviceAccountJson) {
    throw new Error('Missing FIREBASE_CREDENTIALS_JSON environment variable');
  }
  const serviceAccount = JSON.parse(serviceAccountJson);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  
    await connectToDB();
    app.listen(PORT, () => {
      console.log(`Express is listening at http://localhost:${PORT}`);
    });
  }
  
  start();