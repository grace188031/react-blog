import { JSX } from "react";

//  Define type for a single comment
type Comment = {
    postedBy: string;
    text: string;
  };
  
  //  Define props type for the component
  type CommentsListProps = {
    comments: Comment[];
  };
  
  //  Add return type for the component
  export default function CommentsList({ comments }: CommentsListProps): JSX.Element {
    return (
      <>
        {comments.map((comment, index) => (
          //  Use 'index' as fallback key if no unique id (avoid using text directly)
          <div key={index}>
            <h4>{comment.postedBy}</h4>
            <p>{comment.text}</p>
          </div>
        ))}
      </>
    );
  }
  