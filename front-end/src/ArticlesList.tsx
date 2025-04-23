import { Link } from "react-router-dom";
import { JSX } from "react";

//  Define the type for each article
type Article = {
  name: string;
  title: string;
  content: string[];
};

//  Define the props type for the component
type ArticlesListProps = {
  articles: Article[];
};

//  Add explicit return type for the component
export default function ArticlesList({ articles }: ArticlesListProps): JSX.Element {
  return (
    <>
      {articles.map((a) => (
        <Link key={a.name} to={`/articles/${a.name}`}>
          <h3>{a.title}</h3>
          {/*  Type-safe access to string array and string methods */}
          <p>{a.content[0].substring(0, 150)}</p>
        </Link>
      ))}
    </>
  );
}
//  Added type annotations for the props and return type of the component