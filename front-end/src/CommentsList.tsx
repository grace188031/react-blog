export default function CommentsList( {comments} ) {
    return (
        <>
        {comments.map(comment => (
            <div key={comment.txt}>
                <h4>{comment.postedBy}</h4>
                <p>{comment.text}</p>
            </div>
        ))}
        
        </>
    )
}