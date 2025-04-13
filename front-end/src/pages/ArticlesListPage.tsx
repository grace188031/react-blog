import articles from "../article-content";
//import { Link } from "react-router-dom"; we will use the ArticlesList component instead
import ArticlesList from "../ArticlesList";

export default function ArticlesListPage() {
    return (
      <>
      <h1>Articles</h1>
      <ArticlesList articles={articles} />
      </>
    );
  }

//Removing the code below because we are using the ArticlesList component instead
//  {articles.map(a => (
//    <Link key={a.name} to={'/articles/' + a.name}>
//      <h3>{a.title}</h3>
//      <p>{a.content[0].substring(0,150)}</p>
//    </Link>
//  ))}
