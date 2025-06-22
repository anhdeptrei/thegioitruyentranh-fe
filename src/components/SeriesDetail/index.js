import { useContext, useState, useEffect } from 'react'; // Import useState, useEffect
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { faStar } from '@fortawesome/free-solid-svg-icons'; // Thêm icon sao
import { BookmarkContext } from '~/contexts/bookmarkContext';
import { HistoryContext } from '~/contexts/historyContext';
import { AuthContext } from '~/contexts/authContext'; // Import AuthContext
import { DiscussionEmbed } from 'disqus-react';
import ChapterList from '../ChapterList';
import NotFoundPages from '../Notfound/notFoundPages';
import swal from 'sweetalert';
import ReviewSection from '../ReviewSection';
import { faShare } from '@fortawesome/free-solid-svg-icons';

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

    let shortHistory = [];
    if (loggedInUser && Array.isArray(loggedInUser.readingHistories)) {
        // Lấy lịch sử đọc từ server khi đã đăng nhập
        const filterUserHistory = loggedInUser.readingHistories.filter((item) => item.storyId === id);
        shortHistory = filterUserHistory
            .sort((a, b) => new Date(b.viewDate) - new Date(a.viewDate))
            .map((item) => ({
                lastReadChapterId: item.lastReadChapter, // id chương cuối cùng đã đọc
                storyId: item.storyId,
                // Có thể thêm các trường khác nếu cần
            }));
    } else {
        // Lấy lịch sử đọc từ local khi chưa đăng nhập
        const filterHistory = history.filter((item) => item.storyId === id);
        shortHistory = filterHistory.sort((a, b) => new Date(b.readDate || b.date) - new Date(a.readDate || a.date));
    }
    console.log('shortHistory', shortHistory);
    // chia sẻ truyện
    const shareUrl = window.location.href;
    const groupShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;

    const shareToGroup = () => {
        window.open(groupShareUrl, '_blank', 'noopener,noreferrer');
    };
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
                                                <>
                                                    {/* <button className="share-btn" onClick={shareToGroup}>
                                                        <FontAwesomeIcon icon={faShare} /> Chia sẻ
                                                    </button> */}
                                                    {/* Show "Theo dõi" button if not followed */}
                                                    <button onClick={() => addBookmark()} disabled={loadingFollow}>
                                                        <FontAwesomeIcon icon={faHeart} />{' '}
                                                        {loadingFollow ? 'Đang theo dõi...' : 'Theo dõi'}
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    {/* <button className="share-btn" onClick={shareToGroup}>
                                                        <FontAwesomeIcon icon={faShare} /> Chia sẻ
                                                    </button> */}
                                                    {/* Show "Bỏ theo dõi" button if followed */}
                                                    <button
                                                        className="remove"
                                                        onClick={() => removeBookmark()}
                                                        disabled={loadingFollow}
                                                    >
                                                        <FontAwesomeIcon icon={faXmark} />{' '}
                                                        {loadingFollow ? 'Đang bỏ theo dõi...' : 'Bỏ theo dõi'}
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                        {shortHistory.length !== 0 && (
                                            <span className="continue">
                                                <Link
                                                    to={`/chapter/${shortHistory[0].lastReadChapterId}/${shortHistory[0].storyId}`}
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
                                        <li>
                                            <b>Lượt theo dõi</b>
                                            <span>{series.follow || 0}</span>
                                        </li>
                                        <li>
                                            <b>Đánh giá</b>
                                            <span>
                                                {series.favourite ? series.favourite : 0}
                                                <FontAwesomeIcon
                                                    icon={faStar}
                                                    style={{ color: '#FFD700', marginLeft: 4 }}
                                                />
                                            </span>
                                        </li>
                                        <li>
                                            <b>Lượt xem</b>
                                            <span>{series.view_count || 0}</span>
                                        </li>
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
