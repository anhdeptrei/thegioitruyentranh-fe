import { useState, useEffect } from 'react';
import swal from 'sweetalert';

const ReviewSection = ({ storyId, loggedInUser }) => {
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [reviews, setReviews] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loadingReviews, setLoadingReviews] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        const fetchReviews = async () => {
            setLoadingReviews(true);
            try {
                const res = await fetch(`http://localhost:8080/reviews?story_id=${storyId}&page=${page}&size=4`);
                const data = await res.json();
                console.log('Fetched reviews:', data);
                if (Array.isArray(data.content)) {
                    setReviews(data.content);
                    setTotalPages(data.totalPages || 1);
                } else if (Array.isArray(data)) {
                    setReviews(data);
                    setTotalPages(1);
                } else {
                    setReviews([]);
                    setTotalPages(1);
                }
            } catch (err) {
                setReviews([]);
                setTotalPages(1);
            } finally {
                setLoadingReviews(false);
            }
        };
        fetchReviews();
    }, [storyId, page, refreshKey]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!reviewText.trim() || rating === 0) {
            setError('Vui lòng nhập nội dung và chọn số sao!');
            return;
        }
        setSubmitting(true);
        setError('');
        try {
            const res = await fetch('http://localhost:8080/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    story_id: storyId,
                    user_id: loggedInUser.userId,
                    user_name: loggedInUser.username,
                    review_text: reviewText,
                    rating: rating,
                }),
            });
            if (res.ok) {
                setReviewText('');
                setRating(0);
                setError('');
                setPage(0);
                setRefreshKey((prev) => prev + 1);
                swal('Thành công!', 'Đánh giá của bạn đã được gửi.', 'success');
            } else {
                setError('Không thể gửi đánh giá.');
            }
        } catch (err) {
            setError('Lỗi kết nối máy chủ.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="review-section">
            <h4>Đánh giá truyện</h4>
            {loggedInUser ? (
                <form className="review-form" onSubmit={handleSubmit}>
                    <div className="rating-stars">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                className={star <= rating ? 'star active' : 'star'}
                                onClick={() => setRating(star)}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                    <textarea
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Nhập đánh giá của bạn..."
                        rows={3}
                        required
                    />
                    {error && <div className="review-error">{error}</div>}
                    <button type="submit" disabled={submitting}>
                        {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
                    </button>
                </form>
            ) : (
                <div className="review-login-message">Vui lòng đăng nhập để đánh giá truyện.</div>
            )}
            <div className="review-list">
                <h5>Đánh giá của người đọc</h5>
                {loadingReviews ? (
                    <div className="review-empty">Đang tải đánh giá...</div>
                ) : reviews && reviews.length > 0 ? (
                    reviews.map((review) => (
                        <div className="review-item" key={review.review_id}>
                            <div className="review-header">
                                <img
                                    className="review-avatar"
                                    src={review.user_avatar || '/assets/user.png'}
                                    alt={review.user_name}
                                    style={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        marginRight: 10,
                                        border: '2px solid #6e6dfb',
                                        background: '#fff',
                                    }}
                                />
                                <span className="review-user">{review.user_name}</span>
                                <span className="rating-stars">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <span
                                            key={star}
                                            className={star <= Number(review.rating) ? 'star active' : 'star'}
                                        >
                                            ★
                                        </span>
                                    ))}
                                </span>
                                <span className="review-date">{new Date(review.create_at).toLocaleString()}</span>
                            </div>
                            <div className="review-text">{review.review_text}</div>
                        </div>
                    ))
                ) : (
                    <div className="review-empty">Chưa có đánh giá nào.</div>
                )}
                {totalPages > 1 && (
                    <div className="review-pagination">
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

export default ReviewSection;
