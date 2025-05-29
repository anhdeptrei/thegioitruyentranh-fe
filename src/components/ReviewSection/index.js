// Đánh giá truyện
import { useState } from 'react';

const ReviewSection = ({ storyId, reviews, loggedInUser, onReviewSubmit }) => {
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!reviewText.trim() || rating === 0) {
            setError('Vui lòng nhập nội dung và chọn số sao!');
            return;
        }
        setSubmitting(true);
        setError('');
        try {
            const res = await fetch('http://localhost:8080/review', {
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
                if (onReviewSubmit) onReviewSubmit();
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
                {reviews && reviews.length > 0 ? (
                    reviews.map((review) => (
                        <div className="review-item" key={review.review_id}>
                            <div className="review-header">
                                <span className="review-user">{review.user_name}</span>
                                <span className="review-rating">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <span key={star} className={star <= review.rating ? 'star active' : 'star'}>
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
            </div>
        </div>
    );
};

export default ReviewSection;
