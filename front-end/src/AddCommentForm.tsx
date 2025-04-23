import { useState } from "react";
import { JSX } from "react";
//  Define prop types for the component
type AddCommentFormProps = {
  onAddComment: (input: { nameText: string; commentText: string }) => void;
};

//  Add explicit return type for the component
export default function AddCommentForm({ onAddComment }: AddCommentFormProps): JSX.Element {
  //  Add type to useState to avoid implicit 'any'
  const [nameText, setNameText] = useState<string>("");
  const [commentText, setCommentText] = useState<string>("");

  return (
    <div>
      <h3>Add a comment</h3>

      <label htmlFor="nameText">Name:</label>
      {/*  Optionally typed event for strict type safety */}
      <input
        id="nameText"
        type="text"
        name="name"
        value={nameText}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNameText(e.target.value)}
      />

      <label htmlFor="commentText">Comment:</label>
      <textarea
        id="commentText"
        name="text"
        value={commentText}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCommentText(e.target.value)}
      />

      <button
        onClick={() => {
          onAddComment({ nameText, commentText }); //  Types are enforced via props
          setNameText("");
          setCommentText("");
        }}
      >
        Add Comment
      </button>
    </div>
  );
}
