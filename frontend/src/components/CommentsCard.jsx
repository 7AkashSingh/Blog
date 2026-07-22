import { useState } from "react";
import { useDispatch } from "react-redux";
import {
    FaUserCircle,
    FaEdit,
    FaTrash,
    FaSave,
    FaTimes,
} from "react-icons/fa";

import {
    updateExistingComment,
    deleteExistingComment,
} from "../features/comments/commentsSlice";

function CommentCard({ comment, currentUser }) {
    const dispatch = useDispatch();

    // Prevent crash while data is loading
    if (!comment) return null;

    const [editing, setEditing] = useState(false);
    const [content, setContent] = useState(comment.content || "");

    const isOwner =
        currentUser?._id === comment.author?._id;

    const handleUpdate = async () => {
        if (!content.trim()) return;

        await dispatch(
            updateExistingComment({
                commentId: comment._id,
                content: content.trim(),
            })
        );

        setEditing(false);
    };

    const handleDelete = () => {
        if (!window.confirm("Delete this comment?")) return;

        dispatch(deleteExistingComment(comment._id));
    };

    console.log("COMMENT OBJECT:", comment);
    return (
        <div className="bg-white rounded-xl shadow p-5">

            {/* Header */}
            <div className="flex justify-between items-start">

                <div className="flex items-center gap-3">

                    {comment.author?.avatar ? (
                        <img
                            src={comment.author.avatar}
                            alt={comment.author.username}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                    ) : (
                        <FaUserCircle className="text-4xl text-gray-400" />
                    )}

                    <div>
                        <h4 className="font-semibold">
                            {comment.author?.username}
                        </h4>

                        <p className="text-sm text-gray-500">
                            {new Date(comment.createdAt).toLocaleString()}
                        </p>
                    </div>

                </div>

                {isOwner && (
                    <div className="flex gap-3">

                        {!editing ? (
                            <>
                                <button
                                    onClick={() => {
                                        setContent(comment.content || "");
                                        setEditing(true);
                                    }}
                                    className="text-yellow-500 hover:text-yellow-600"
                                >
                                    <FaEdit />
                                </button>

                                <button
                                    onClick={handleDelete}
                                    className="text-red-500 hover:text-red-600"
                                >
                                    <FaTrash />
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={handleUpdate}
                                    className="text-green-600 hover:text-green-700"
                                >
                                    <FaSave />
                                </button>

                                <button
                                    onClick={() => {
                                        setEditing(false);
                                        setContent(comment.content || "");
                                    }}
                                    className="text-gray-600 hover:text-gray-800"
                                >
                                    <FaTimes />
                                </button>
                            </>
                        )}

                    </div>
                )}

            </div>

            {/* Comment */}
            <div className="mt-4">

                {editing ? (
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={3}
                        className="w-full border rounded-lg p-3 text-gray-800"
                    />
                ) : (
                    <p className="text-gray-800 whitespace-pre-wrap break-all">
                        {comment.content}
                    </p>
                )}

            </div>

        </div>
    );
}

export default CommentCard;