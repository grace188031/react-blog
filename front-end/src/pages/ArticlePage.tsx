import { useParams, useLoaderData } from 'react-router-dom';
import articles from '../article-content';
import axios from 'axios';

export default function ArticlePage() {
  const { name } = useParams();
  const { upvotes, comments } = useLoaderData();
  
  const article = articles.find(
    a => a.name === name
  );

  return (
    <>
    <div>
      <h1>{article.title}</h1>
      <p>This article has Upvotes: {upvotes}</p>
      {article.content.map(p => <p key={p}>{p}</p>)}
    </div>
    </> 
  );
}

// Create and export loader function and call the params.name
export async function loader({ params }) { 
  const response = await axios.get('/api/articles/' + params.name);
  const { upvotes, comments } = response.data;
  return { upvotes, comments };
}
