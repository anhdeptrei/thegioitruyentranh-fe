import { useState, useEffect } from 'react';

const ChapterComments = ({ chapterId, loggedInUser }) => {
    const [comments, setComments] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const [newComment, setNewComment] = useState('');
    const [replyingTo, setReplyingTo] = useState(null); // commentId being replied to
    const [replyContent, setReplyContent] = useState('');
    const [editingId, setEditingId] = useState(null); // commentId being edited
    const [editContent, setEditContent] = useState('');
    const [error, setError] = useState('');
    const [totalComments, setTotalComments] = useState(0); // tổng số bình luận

    // Fetch root comments for chapter
    useEffect(() => {
        const fetchComments = async () => {
            setLoading(true);
            try {
                const res = await fetch(
                    `http://localhost:8080/comments/roots-by-chapter?chapter_id=${chapterId}&page=${page}&size=10`,
                );
                const data = await res.json();
                if (Array.isArray(data.content)) {
                    setComments(data.content);
                    setTotalPages(data.totalPages || 1);
                } else {
                    setComments([]);
                    setTotalPages(1);
                }
            } catch (err) {
                setComments([]);
                setTotalPages(1);
            } finally {
                setLoading(false);
            }
        };
        fetchComments();
    }, [chapterId, page, refreshKey]);

    // Fetch total comment count for chapter
    useEffect(() => {
        const fetchTotalComments = async () => {
            try {
                const res = await fetch(`http://localhost:8080/comments/by-chapter?chapter_id=${chapterId}&page=0`);
                const data = await res.json();
                if (typeof data.totalElements === 'number') {
                    setTotalComments(data.totalElements);
                } else {
                    setTotalComments(0);
                }
            } catch {
                setTotalComments(0);
            }
        };
        fetchTotalComments();
    }, [chapterId, refreshKey]);

    // Fetch replies for a comment
    const fetchReplies = async (parentId) => {
        try {
            const res = await fetch(
                `http://localhost:8080/comments/replies?parent_comment_id=${parentId}&page=0&size=100`,
            );
            const data = await res.json();
            if (Array.isArray(data.content)) {
                console.log('Replies loaded:', data.content);
                return data.content;
            }
            return [];
        } catch {
            return [];
        }
    };

    // Add new root comment
    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        setError('');
        try {
            const res = await fetch('http://localhost:8080/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: loggedInUser.userId,
                    chapterId: chapterId,
                    parentCommentId: null,
                    contentComment: newComment,
                }),
            });
            if (res.ok) {
                setNewComment('');
                setRefreshKey((k) => k + 1);
            } else {
                setError('Không thể gửi bình luận.');
            }
        } catch {
            setError('Lỗi kết nối máy chủ.');
        }
    };

    // Add reply to a comment
    const handleAddReply = async (parentId) => {
        if (!replyContent.trim()) return;
        setError('');
        try {
            const res = await fetch('http://localhost:8080/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: loggedInUser.userId,
                    chapterId: chapterId,
                    parentCommentId: parentId,
                    contentComment: replyContent,
                }),
            });
            if (res.ok) {
                setReplyContent('');
                setReplyingTo(null);
                // Sau khi thêm reply, load lại replies của parent
                handleShowReplies(parentId);
            } else {
                setError('Không thể gửi trả lời.');
            }
        } catch {
            setError('Lỗi kết nối máy chủ.');
        }
    };

    // Edit a comment
    const handleEditComment = async (commentId, parentCommentId) => {
        if (!editContent.trim()) return;
        setError('');
        try {
            const res = await fetch(`http://localhost:8080/comments/${commentId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    commentId: commentId,
                    userId: loggedInUser.userId,
                    userName: loggedInUser.username,
                    chapterId: chapterId,
                    parentCommentId: parentCommentId ? parentCommentId : null, // or keep as is
                    contentComment: editContent,
                }),
            });
            if (res.ok) {
                setEditingId(null);
                setEditContent('');
                if (parentCommentId) {
                    // Nếu là reply, load lại replies của parent
                    handleShowReplies(parentCommentId);
                } else {
                    // Nếu là comment gốc, load lại danh sách comment
                    setRefreshKey((k) => k + 1);
                }
            } else {
                setError('Không thể sửa bình luận.');
            }
        } catch {
            setError('Lỗi kết nối máy chủ.');
        }
    };

    // Xóa bình luận
    const handleDeleteComment = async (commentId, parentCommentId) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa bình luận này?')) return;
        setError('');
        try {
            const res = await fetch(`http://localhost:8080/comments/${commentId}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                if (parentCommentId) {
                    // Nếu là reply, load lại replies của parent
                    handleShowReplies(parentCommentId);
                } else {
                    // Nếu là comment gốc, load lại danh sách comment
                    setRefreshKey((k) => k + 1);
                }
            } else {
                setError('Không thể xóa bình luận.');
            }
        } catch {
            setError('Lỗi kết nối máy chủ.');
        }
    };

    // Render replies for a comment
    const [replies, setReplies] = useState({}); // { [parentId]: [replyList] }
    const handleShowReplies = async (parentId) => {
        // Luôn fetch lại replies để đảm bảo giao diện cập nhật mới nhất
        const replyList = await fetchReplies(parentId);
        setReplies((prev) => ({ ...prev, [parentId]: replyList }));
    };

    // Đệ quy render comment và replies
    const renderComment = (comment, level = 0) => {
        console.log('Replies loaded:', replies[comment.commentId] ? replies[comment.commentId].length : 0);
        const replyCount = comment.replyCount || (replies[comment.commentId] ? replies[comment.commentId].length : 0);
        return (
            <div
                className={`fb-comment-item${comment.parentCommentId ? ' fb-reply' : ''}`}
                key={comment.commentId}
                style={{ marginLeft: level > 0 ? 32 : 0 }}
            >
                <img
                    className="fb-comment-avatar"
                    src={comment.userAvatar || '/assets/noimage.png'}
                    alt={comment.userName}
                />
                <div className="fb-comment-main">
                    <div className="fb-comment-header">
                        <span className="fb-comment-user">{comment.userName}</span>
                        <span className="fb-comment-date">{new Date(comment.createAt).toLocaleString()}</span>
                        {loggedInUser && comment.userId === loggedInUser.userId && (
                            <>
                                <button
                                    className="fb-comment-edit-btn"
                                    onClick={() => {
                                        setEditingId(comment.commentId);
                                        setEditContent(comment.contentComment);
                                    }}
                                >
                                    Sửa
                                </button>
                                <button
                                    className="fb-comment-edit-btn"
                                    onClick={() => handleDeleteComment(comment.commentId, comment.parentCommentId)}
                                >
                                    Xóa
                                </button>
                            </>
                        )}
                    </div>
                    {editingId === comment.commentId ? (
                        <div className="fb-comment-edit-form">
                            <textarea
                                className="fb-comment-input"
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                rows={2}
                            />
                            <button
                                className="fb-comment-save-btn"
                                onClick={() => handleEditComment(comment.commentId, comment.parentCommentId)}
                            >
                                Lưu
                            </button>
                            <button className="fb-comment-cancel-btn" onClick={() => setEditingId(null)}>
                                Hủy
                            </button>
                        </div>
                    ) : (
                        <div className="fb-comment-content">{comment.contentComment}</div>
                    )}
                    <div className="fb-comment-actions">
                        {loggedInUser && (
                            <button
                                className="fb-comment-reply-btn"
                                onClick={() =>
                                    setReplyingTo(replyingTo === comment.commentId ? null : comment.commentId)
                                }
                            >
                                Trả lời
                            </button>
                        )}
                        {replyCount > 0 && (
                            <button
                                className="fb-comment-show-replies-btn"
                                onClick={() => handleShowReplies(comment.commentId)}
                            >
                                Xem phản hồi ({replyCount})
                            </button>
                        )}
                    </div>
                    {replyingTo === comment.commentId && (
                        <div className="fb-comment-reply-form">
                            <textarea
                                className="fb-comment-input"
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                rows={2}
                            />
                            <button className="fb-comment-submit" onClick={() => handleAddReply(comment.commentId)}>
                                Gửi
                            </button>
                            <button className="fb-comment-cancel-btn" onClick={() => setReplyingTo(null)}>
                                Hủy
                            </button>
                        </div>
                    )}
                    {/* Đệ quy hiển thị replies nếu có */}
                    {replies[comment.commentId] && replies[comment.commentId].length > 0 && (
                        <div className="fb-comment-replies">
                            {replies[comment.commentId].map((reply) => renderComment(reply, level + 1))}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="chapter-comments fb-comments">
            <h4 className="fb-comments-title">Bình luận ({totalComments})</h4>
            <div className="fb-comments-subtitle">
                {loggedInUser
                    ? 'hãy để lại bình luận để nêu cảm ngĩ của bạn về chapter này nhé !'
                    : 'Bạn cần đăng nhập để viết bình luận'}
            </div>
            {loggedInUser && (
                <form className="fb-comment-form" onSubmit={handleAddComment}>
                    <img className="fb-comment-avatar" src={loggedInUser.avatar || '/assets/user.png'} alt="avatar" />
                    <textarea
                        className="fb-comment-input"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Viết bình luận..."
                        rows={2}
                        required
                    />
                    <button type="submit" className="fb-comment-submit">
                        Gửi
                    </button>
                </form>
            )}
            {error && <div className="fb-comment-error">{error}</div>}
            <div className="fb-comment-list">
                {loading ? (
                    <div className="fb-comment-empty">Đang tải bình luận...</div>
                ) : comments.length === 0 ? (
                    <div className="fb-comment-empty">Chưa có bình luận nào.</div>
                ) : (
                    comments.map((comment) => renderComment(comment))
                )}
                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="fb-comment-pagination">
                        <button onClick={() => setPage(page - 1)} disabled={page === 0}>
                            &lt;
                        </button>
                        <span>
                            {page + 1} / {totalPages}
                        </span>
                        <button onClick={() => setPage(page + 1)} disabled={page + 1 >= totalPages}>
                            &gt;
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChapterComments;
