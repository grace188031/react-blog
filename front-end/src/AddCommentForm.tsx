import { useState } from "react"

export default function AddCommentForm( { onAddComment }) {
    const [nameText, setNameText] = useState("");
    const [commentText, setCommentText] = useState("");

    return (
        <div>
            <h3>Add a comment</h3>
            <label htmlFor="nameText"> Name:</label>
                <input id="nameText" value={nameText} type="text" name="name"  onChange={ e => setNameText(e.target.value)}/>
                <label htmlFor="commentText"> Comment:</label>
                <textarea id="commentText" value={commentText} name="text" onChange={ e => setCommentText(e.target.value)} />
                <button onClick={() => {
                    onAddComment( {nameText, commentText} ) ;
                    setNameText("");
                    setCommentText("");
                }}> Add Comment </button>
        </div>
    )
}