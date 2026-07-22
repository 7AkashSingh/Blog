import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    fetchComments,
    createNewComment,
} from "../features/comments/commentsSlice.js";

import CommentCard from "./CommentsCard.jsx";

function CommentSection({ blogId }) {
    const dispatch = useDispatch();

    const [content, setContent] = useState("");
    const { user } = useSelector(
        (state)=>state.auth
    );

    const { comments, loading } = useSelector(
        (state) => state.comments
    );

    const { isAuthenticated } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {
        if (blogId) {
            dispatch(fetchComments(blogId));
        }
    }, [dispatch, blogId]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!content.trim()) return;

        dispatch(
            createNewComment({
                blogId,
                content,
            })
        );

        setContent("");
    };

    return (
        <div className="mt-12">

            <h2 className="text-2xl font-bold mb-6">
                Comments ({comments.length})
            </h2>

            {isAuthenticated ? (
                <form
                    onSubmit={handleSubmit}
                    className="mb-8"
                >
                    <textarea
                        rows={4}
                        placeholder="Write your comment..."
                        value={content}
                        onChange={(e) =>
                            setContent(e.target.value)
                        }
                        className="w-full border rounded-lg p-4"
                    />

                    <button
                        type="submit"
                        className="mt-3 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Post Comment
                    </button>
                </form>
            ) : (
                <p className="text-gray-500 mb-8">
                    Login to write a comment.
                </p>
            )}

            {loading ? (
                <p>Loading comments...</p>
            ) : comments.length === 0 ? (
                <p className="text-gray-500">
                    No comments yet.
                </p>
            ) : (
                <div className="space-y-6">
                    {comments.map((comment) => (
                        <CommentCard
                            key={comment._id}
                            comment={comment}
                            currentUser={user}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default CommentSection;