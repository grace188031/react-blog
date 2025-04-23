import { useState } from 'react';
import { useParams, useLoaderData } from 'react-router-dom';
import articles from '../article-content';
import CommentsList from '../CommentsList';
import AddCommentForm from '../AddCommentForm';
import axios from 'axios';
import useUser from '../useUser';
import { JSX } from 'react';

// Define type for route parameters
type Params = {
  name: string;
};

// Define type for loader data
type ArticleData = {
  upvotes: number;
  comments: {
    postedBy: string;
    text: string;
  }[];
};

// Define type for comment input
type CommentInput = {
  nameText: string;
  commentText: string;
};

export default function ArticlePage(): JSX.Element {
  // Use typed route params
  const { name } = useParams<Params>();
  const { upvotes: initialUpvotes, comments: initialComments } = useLoaderData() as ArticleData;

  const [upvotes, setUpvotes] = useState<number>(initialUpvotes);
  const [comments, setComments] = useState<ArticleData['comments']>(initialComments);

  // isLoading and user are now stored from useUser
  const { isLoading, user } = useUser();
// 
if (isLoading) {
  return <p>Loading user data...</p>;
}

  // Ensure article is not undefined before accessing .title
  const article = articles.find(a => a.name === name);

  async function onUpvoteClicked(): Promise<void> {
    const token = user && await user.getIdToken();
    const headers = token ? { authtoken: token } : {};
    const response = await axios.post(`/api/articles/${name}/upvote`, null, { headers });
    const updatedArticleData = response.data;
    setUpvotes(updatedArticleData.upvotes);
  }

  async function onAddComment({ nameText, commentText }: CommentInput): Promise<void> {
    const token = user && await user.getIdToken();
    const headers = token ? { authtoken: token } : {};
    const response = await axios.post(`/api/articles/${name}/comments`, {
      postedBy: nameText,
      text: commentText,
    }, { headers });
    const updatedArticleData = response.data;
    setComments(updatedArticleData.comments);
  }

  return (
    <>
      <div>
        {/* Optional chaining added for safety in case article is undefined */}
        <h1>{article?.title}</h1>
        {user && <button onClick={onUpvoteClicked}>Upvote</button>}
        <p>This article has Upvotes: {upvotes}</p>
        {article?.content.map(p => <p key={p}>{p}</p>)}
        {user
          ? <AddCommentForm onAddComment={onAddComment} />
          : <p>Log In to Add a Comment</p>}
        <h3>Comments</h3>
        <CommentsList comments={comments} />
      </div>
    </>
  );
}

// Add types for the loader function props and return
import { LoaderFunctionArgs } from 'react-router-dom';

export async function loader({ params }: LoaderFunctionArgs): Promise<ArticleData> {
  const response = await axios.get(`/api/articles/${params.name}`);
  const { upvotes, comments } = response.data;
  return { upvotes, comments };
}
