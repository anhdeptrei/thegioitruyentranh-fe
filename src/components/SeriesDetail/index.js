import { useContext, useState, useEffect } from 'react'; // Import useState, useEffect
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { BookmarkContext } from '~/contexts/bookmarkContext';
import { HistoryContext } from '~/contexts/historyContext';
import { AuthContext } from '~/contexts/authContext'; // Import AuthContext
import { DiscussionEmbed } from 'disqus-react';
import ChapterList from '../ChapterList';
import NotFoundPages from '../Notfound/notFoundPages';
import swal from 'sweetalert';

// Đánh giá truyện với phân trang
const ReviewSection = ({ storyId, loggedInUser }) => {
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [reviews, setReviews] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loadingReviews, setLoadingReviews] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0); // Thêm state refreshKey

    // Fetch reviews by storyId and page
    useEffect(() => {
        const fetchReviews = async () => {
            setLoadingReviews(true);
            try {
                const res = await fetch(`http://localhost:8080/reviews?story_id=${storyId}&page=${page}&size=4`);
                const data = await res.json();
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
    }, [storyId, page, refreshKey]); // Thêm refreshKey vào dependency

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
                // Refetch reviews after submit
                setPage(0);
                // Force refetch by changing a key
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
                {/* Pagination */}
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

const SeriesDetail = ({ series }) => {
    const id = series.story_id; //id truyen
    const chapters = series.chapters; //chap truyen
    const categories = series.categories; //the loai truyen
    const status = series.status; //trang thai truyen
    const title = series.title; //ten truyen
    const description = series.description; //noi dung truyen
    const authors = series.author; //tac gia truyen
    const cover_image = series.cover_image; //ảnh truyen
    const updatedAt = series.updateAt; //thoi gian cap nhat truyen

    const disqusShortname = 'read-comic';
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    var date_time = date + ' ' + time;

    // Get bookmark state and dispatch from BookmarkContext (for non-logged-in users)
    const { bookmark, dispatch } = useContext(BookmarkContext);

    // Get loggedInUser and handleLoginSuccess from AuthContext
    const { loggedInUser, handleLoginSuccess } = useContext(AuthContext); // handleLoginSuccess is needed to update user state after follow/unfollow

    // State to determine if the current series is bookmarked/followed
    const [isFollowed, setIsFollowed] = useState(false);
    const [loadingFollow, setLoadingFollow] = useState(false); // Loading state for follow/unfollow actions
    const [currentFollowId, setCurrentFollowId] = useState(null);

    // Effect to check if the series is followed/bookmarked when component mounts or user/bookmark changes
    useEffect(() => {
        if (loggedInUser && loggedInUser.follows) {
            // If user is logged in, check their follows list
            const foundInFollows = loggedInUser.follows.find((follow) => follow.storyId === id);
            console.log('foundInFollows', foundInFollows);
            if (foundInFollows) {
                setIsFollowed(true);
                setCurrentFollowId(foundInFollows.followId); // *** Store the followId ***
            } else {
                setIsFollowed(false);
                setCurrentFollowId(null); // Clear followId if not found
            }
        } else {
            // If no user is logged in, check the local bookmark list
            const foundInBookmark = bookmark.some((item) => item.id === id);
            setIsFollowed(foundInBookmark);
        }
    }, [loggedInUser, bookmark, id]); // Depend on loggedInUser, bookmark, and series id

    const addBookmark = async () => {
        // Made async
        setLoadingFollow(true); // Start loading

        if (loggedInUser) {
            // If user is logged in, call backend API to follow
            console.log(`Attempting to follow storyId: ${id} for user: ${loggedInUser.userId}`);
            try {
                // *** IMPORTANT: Replace with your actual backend follow API endpoint ***
                // Assuming a POST request to /users/{userId}/follows with storyId in body
                const response = await fetch(`http://localhost:8080/follows`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        // Add any necessary auth headers if your backend requires them (e.g., JWT)
                        // 'Authorization': `Bearer ${yourAuthToken}`
                    },
                    body: JSON.stringify({ userId: loggedInUser.userId, storyId: id }), // Send storyId in the body
                });

                if (response.ok) {
                    console.log('Follow successful on backend.');
                    // Backend should ideally return the updated user object or the new follow object.
                    // If backend returns the updated user object with the new follow added:

                    const newFollow = await response.json();
                    try {
                        // Call your backend API to get user data by ID
                        const response = await fetch(`http://localhost:8080/users/all-dto/${loggedInUser.userId}`);

                        if (response.ok) {
                            const updatedUser = await response.json();
                            // Update the user state with the fresh data
                            handleLoginSuccess(updatedUser); // Reuse handleLoginSuccess to update state and localStorage
                            console.log('User data refetched and state updated:', updatedUser);
                            // localStorage is updated by the useEffect triggered by setLoggedInUser
                        } else {
                            // Handle error during refetch
                            let errorText = 'Failed to refetch user data.';
                            try {
                                errorText = await response.text();
                            } catch (e) {
                                console.error('Failed to read error response body during refetch:', e);
                            }
                            console.error('Failed to refetch user data:', response.status, errorText);
                            // Optionally, handle this error (e.g., show a message, log the user out if data seems inconsistent)
                        }
                    } catch (err) {
                        console.error('Network error during user data refetch:', err);
                        // Optionally, handle network errors
                    }
                    swal({
                        title: 'Đã lưu',
                        text: 'Thêm vào danh sách theo dõi thành công',
                        icon: 'success',
                    });
                } else {
                    // Handle backend error
                    let errorText = 'Không thể thêm truyện vào danh sách theo dõi.';
                    try {
                        // Assuming backend returns plain text error message
                        errorText = await response.text();
                        // If backend returns JSON error, you might need to parse it:
                        // const errorJson = await response.json();
                        // errorText = errorJson.message || errorText; // Adjust based on your backend error structure
                    } catch (e) {
                        console.error('Failed to read error response body:', e);
                    }
                    console.error('Follow failed on backend:', response.status, errorText);
                    swal('Lỗi!', errorText, 'error');
                }
            } catch (err) {
                console.error('Network error during follow:', err);
                swal('Lỗi!', 'Đã xảy ra lỗi khi kết nối đến máy chủ.', 'error');
            } finally {
                setLoadingFollow(false); // End loading
            }
        } else {
            // If no user is logged in, use the local bookmark context
            dispatch({
                type: 'ADD_BOOKMARK',
                series: {
                    id,
                    title,
                    cover_image,
                    date_time,
                },
            });
            swal({
                title: 'Đã lưu',
                text: 'Thêm vào danh sách yêu thích thành công',
                icon: 'success',
            });
            setLoadingFollow(false); // End loading
        }
    };

    const removeBookmark = async () => {
        // Made async
        setLoadingFollow(true); // Start loading

        if (loggedInUser) {
            // If user is logged in, call backend API to unfollow
            console.log(`Attempting to unfollow storyId: ${currentFollowId} for user: ${loggedInUser.userId}`);
            try {
                // *** IMPORTANT: Replace with your actual backend unfollow API endpoint ***
                // Assuming a DELETE request to /users/{userId}/follows/{storyId}
                const response = await fetch(`http://localhost:8080/follows/${currentFollowId}`, {
                    method: 'DELETE', // Or 'POST' with a specific body, check your backend API
                    headers: {
                        'Content-Type': 'application/json',
                        // Add any necessary auth headers if your backend requires them (e.g., JWT)
                        // 'Authorization': `Bearer ${yourAuthToken}`
                    },
                    // If using POST for unfollow, you might need a body:
                    // body: JSON.stringify({ storyId: id })
                });

                if (response.ok) {
                    console.log('Unfollow successful on backend.');
                    try {
                        // Call your backend API to get user data by ID
                        const response = await fetch(`http://localhost:8080/users/all-dto/${loggedInUser.userId}`);

                        if (response.ok) {
                            const updatedUser = await response.json();
                            // Update the user state with the fresh data
                            handleLoginSuccess(updatedUser); // Reuse handleLoginSuccess to update state and localStorage
                            console.log('User data refetched and state updated:', updatedUser);
                            // localStorage is updated by the useEffect triggered by setLoggedInUser
                        } else {
                            // Handle error during refetch
                            let errorText = 'Failed to refetch user data.';
                            try {
                                errorText = await response.text();
                            } catch (e) {
                                console.error('Failed to read error response body during refetch:', e);
                            }
                            console.error('Failed to refetch user data:', response.status, errorText);
                            // Optionally, handle this error (e.g., show a message, log the user out if data seems inconsistent)
                        }
                    } catch (err) {
                        console.error('Network error during user data refetch:', err);
                        // Optionally, handle network errors
                    }
                    swal({
                        title: 'Đã xóa',
                        text: 'Đã xóa khỏi danh sách theo dõi thành công',
                        icon: 'success',
                    });
                } else {
                    // Handle backend error
                    let errorText = 'Không thể xóa truyện khỏi danh sách theo dõi.';
                    try {
                        // Assuming backend returns plain text error message
                        errorText = await response.text();
                        // If backend returns JSON error, you might need to parse it:
                        // const errorJson = await response.json();
                        // errorText = errorJson.message || errorText; // Adjust based on your backend error structure
                    } catch (e) {
                        console.error('Failed to read error response body:', e);
                    }
                    console.error('Unfollow failed on backend:', response.status, errorText);
                    swal('Lỗi!', errorText, 'error');
                }
            } catch (err) {
                console.error('Network error during unfollow:', err);
                swal('Lỗi!', 'Đã xảy ra lỗi khi kết nối đến máy chủ.', 'error');
            } finally {
                setLoadingFollow(false); // End loading
            }
        } else {
            // If no user is logged in, use the local bookmark context
            dispatch({ type: 'REMOVE_BOOKMARK', id: series.story_id });
            swal({
                title: 'Đã xóa',
                text: 'Đã xóa khỏi danh sách yêu thích thành công',
                icon: 'success',
            });
            setLoadingFollow(false); // End loading
        }
    };

    // The bookmarkDisabled state is now replaced by isFollowed state
    // const bookmarkDisabled = storedSeries ? true : false;

    const { history } = useContext(HistoryContext);
    console.log('history', history);
    const filterHistory = history.filter((item) => item.manga_title === title);
    const shortHistory = filterHistory.sort(function (a, b) {
        return new Date(b.date) - new Date(a.date);
    });
    console.log('shortHistory', shortHistory);

    return (
        <div className="series">
            {series.error && <NotFoundPages />}
            {!series.error && (
                <div className="series-details">
                    <div className="series-details-top">
                        <div className="container">
                            <div className="series-wrapper">
                                <div className="series-thumb">
                                    <img src={cover_image} alt={title} />
                                </div>
                                <div className="series-info">
                                    <div className="series-title">
                                        <h3>{title}</h3>
                                        <div className="favorite">
                                            {/* Use isFollowed state to conditionally render buttons */}
                                            {!isFollowed ? (
                                                // Show "Theo dõi" button if not followed
                                                <button onClick={() => addBookmark()} disabled={loadingFollow}>
                                                    <FontAwesomeIcon icon={faHeart} />{' '}
                                                    {loadingFollow ? 'Đang theo dõi...' : 'Theo dõi'}
                                                </button>
                                            ) : (
                                                // Show "Bỏ theo dõi" button if followed
                                                <button
                                                    className="remove"
                                                    onClick={() => removeBookmark()}
                                                    disabled={loadingFollow}
                                                >
                                                    <FontAwesomeIcon icon={faXmark} />{' '}
                                                    {loadingFollow ? 'Đang bỏ theo dõi...' : 'Bỏ theo dõi'}
                                                </button>
                                            )}
                                        </div>
                                        {shortHistory.length !== 0 && (
                                            <span className="continue">
                                                <Link
                                                    to={`/chapter/${shortHistory[0].id}/${shortHistory[0].id_chapters}`}
                                                >
                                                    Tiếp tục đọc
                                                </Link>
                                            </span>
                                        )}
                                    </div>
                                    <ul>
                                        {authors && (
                                            <li>
                                                <b>Tác giả</b>
                                                <span>{authors}</span>
                                            </li>
                                        )}
                                        {status && (
                                            <li>
                                                <b>Trạng thái</b>
                                                <span>
                                                    {status === 'dang-cap-nhat' && 'Đang cập nhật'}
                                                    {status === 'hoan-thanh' && 'Hoàn thành'}
                                                    {status === 'truyen-moi' && 'Truyện mới'}
                                                    {status === 'sap-ra-mat' && 'Sắp ra mắt'}
                                                </span>
                                            </li>
                                        )}
                                    </ul>
                                    <div className="series-genres">
                                        {Array.isArray(categories) &&
                                            categories.length > 0 &&
                                            categories.map(
                                                (category, index) =>
                                                    category.categori_name && (
                                                        <Link to={`/genre/${category.category_id}/0`} key={index}>
                                                            {category.categori_name}
                                                        </Link>
                                                    ),
                                            )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="series-details-bottom">
                        <div className="container">
                            {description && (
                                <div className="series-description">
                                    <h4>Giới thiệu</h4>
                                    <div dangerouslySetInnerHTML={{ __html: description }} />
                                </div>
                            )}
                            {chapters === 'Error Getting Chapters!' && (
                                <div className="text-message">No Chapter Found...</div>
                            )}
                            {chapters.length === 0 && <div className="text-message">No Chapter Found...</div>}
                            {chapters !== 'Error Getting Chapters!' && chapters.length > 0 && (
                                <ChapterList chapters={chapters} id={id} />
                            )}
                            {/* <div className="comments">
                                <DiscussionEmbed shortname={disqusShortname} />
                            </div> */}
                            <ReviewSection storyId={id} loggedInUser={loggedInUser} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SeriesDetail;
