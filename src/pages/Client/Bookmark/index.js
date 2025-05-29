import { useContext, useEffect, useState } from 'react';
import { BookmarkContext } from '~/contexts/bookmarkContext';
import { AuthContext } from '~/contexts/authContext'; // Import AuthContext
import notFound from '~/components/images/not-found.svg'; // Assuming this path is correct
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import swal from 'sweetalert';
// Assuming you have a component to display series items, let's call it SeriesItem
// import SeriesItem from '~/components/SeriesItem'; // You might need to create/use a reusable component

const Bookmark = () => {
    // Get bookmark state and actions from BookmarkContext (for non-logged-in users)
    // Assuming removeBookmark and removeAllBookmarks are available in BookmarkContext
    const { bookmark, dispatch } = useContext(BookmarkContext); // Use dispatch for local bookmark actions

    // Get loggedInUser and handleLoginSuccess from AuthContext
    const { loggedInUser, handleLoginSuccess } = useContext(AuthContext); // Also get handleLoginSuccess to update user after unfollow

    // State to hold the list of stories to display (either from follows or local bookmark)
    const [displayedStories, setDisplayedStories] = useState([]);
    const [loading, setLoading] = useState(true); // Add loading state

    // Effect to update displayedStories when loggedInUser or local bookmark changes
    useEffect(() => {
        setLoading(true); // Start loading
        if (loggedInUser && loggedInUser.follows) {
            console.log('User logged in, using follows data:', loggedInUser.follows);
            // Map follows data to a format suitable for display
            // Assuming follows array contains objects with story details like coverImage, title, storyId
            // If follows only contains story IDs, you'll need to fetch story details from backend
            // For now, assuming follows objects have necessary details or can be mapped directly
            const userFollows = loggedInUser.follows.map((follow) => ({
                // Map fields from follow object to display format
                id: follow.storyId, // Use storyId as id for consistency if needed
                title: follow.title, // Assuming title is available in follow object
                cover_image: follow.coverImage, // Assuming coverImage is available in follow object
                date: follow.followedDate, // Assuming followedDate is available
                // Add other fields needed for display if any
                recentReadChapter: follow.recentReadChapter, // Example
            }));

            // Sort by date if needed (assuming date is a valid date string/object)
            const sortedFollows = userFollows.sort((a, b) => new Date(b.date) - new Date(a.date));

            setDisplayedStories(sortedFollows);
            setLoading(false); // End loading
        } else {
            console.log('No user logged in, using local bookmark data:', bookmark);
            // Use local bookmark data if no user is logged in
            // Sort local bookmarks by date if needed
            const sortedLocalBookmarks = bookmark.sort((a, b) => new Date(b.date) - new Date(a.date));
            setDisplayedStories(sortedLocalBookmarks);
            setLoading(false); // End loading
        }
    }, [loggedInUser, bookmark]); // Depend on loggedInUser and local bookmark

    const handleRemoveBookmark = (storyId) => {
        swal({
            title: 'Bạn có chắc chắn không?',
            text: 'Một khi đã xóa, bạn sẽ không thể khôi phục lại đánh dấu của mình!',
            icon: 'warning',
            buttons: ['Không', 'Có'],
            dangerMode: true,
        }).then(async (remove) => {
            // Made async to use await for backend call
            if (remove) {
                if (loggedInUser) {
                    // If user is logged in, find the followId for the given storyId
                    const followToRemove = loggedInUser.follows.find((follow) => follow.storyId === storyId);

                    if (!followToRemove) {
                        console.warn(`Follow not found for storyId: ${storyId} for user: ${loggedInUser.userId}`);
                        swal('Lỗi!', 'Không tìm thấy thông tin theo dõi để xóa.', 'error');
                        return; // Exit if follow not found
                    }

                    const followIdToRemove = followToRemove.followId; // *** Get the followId ***

                    // If user is logged in, call backend API to unfollow
                    console.log(`Attempting to unfollow storyId: ${storyId} for user: ${loggedInUser.userId}`);
                    try {
                        const response = await fetch(`http://localhost:8080/follows/${followIdToRemove}`, {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        });

                        if (response.ok) {
                            console.log('Unfollow successful on backend.');
                            try {
                                // Call your backend API to get user data by ID
                                const response = await fetch(
                                    `http://localhost:8080/users/all-dto/${loggedInUser.userId}`,
                                );

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

                            swal('Thành công!', 'Đã xóa truyện khỏi danh sách theo dõi.', 'success');
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
                    }
                } else {
                    // If no user is logged in, use the local bookmark context
                    dispatch({ type: 'REMOVE_BOOKMARK', id: storyId }); // Use dispatch for local state
                    swal('Thành công!', 'Đã xóa truyện khỏi danh sách theo dõi cục bộ.', 'success');
                }
            }
        });
    };

    // Function to handle removing all bookmarks
    const handleRemoveAllBookmarks = () => {
        // This function needs similar logic:
        // If loggedInUser, call backend API to unfollow all or clear follows.
        // If not loggedInUser, call removeAllBookmarks from BookmarkContext.
        // You'll need a backend endpoint for this (e.g., DELETE /users/{userId}/follows)
        swal({
            title: 'Bạn có chắc chắn không?',
            text: 'Một khi đã xóa, bạn sẽ không thể khôi phục lại đánh dấu của mình!',
            icon: 'warning',
            buttons: ['Không', 'Có'],
            dangerMode: true,
        }).then(async (willDelete) => {
            // Made async to use await for backend call
            if (willDelete) {
                if (loggedInUser) {
                    // *** IMPORTANT: Replace with your actual backend API endpoint to clear all follows ***
                    // Assuming a DELETE request to /users/{userId}/follows
                    console.log(`Attempting to clear all follows for user: ${loggedInUser.userId}`);
                    try {
                        const response = await fetch(`http://localhost:8080/follows/user/${loggedInUser.userId}`, {
                            method: 'DELETE', // Or POST, check your backend API
                            headers: {
                                'Content-Type': 'application/json',
                                // Add any necessary auth headers
                            },
                        });

                        if (response.ok) {
                            console.log('Clear all follows successful on backend.');
                            // *** MODIFIED LOGIC TO HANDLE EMPTY RESPONSE BODY ***
                            // Instead of expecting JSON, manually update the loggedInUser state
                            // by clearing the follows array.
                            // This avoids calling response.json() if the backend returns no body.
                            // Check if the response has a body before trying to parse JSON (optional but safer)
                            const contentType = response.headers.get('content-type');
                            if (contentType && contentType.indexOf('application/json') !== -1) {
                                const updatedUser = await response.json(); // Assuming backend returns updated user
                                handleLoginSuccess(updatedUser); // Update user state in context and localStorage
                            } else {
                                // If no JSON body, manually update the loggedInUser state
                                try {
                                    // Call your backend API to get user data by ID
                                    const response = await fetch(
                                        `http://localhost:8080/users/all-dto/${loggedInUser.userId}`,
                                    );

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
                            }

                            swal('Thành công!', 'Đã xóa tất cả truyện khỏi danh sách theo dõi.', 'success');
                        } else {
                            let errorText = 'Không thể xóa tất cả truyện khỏi danh sách theo dõi.';
                            try {
                                errorText = await response.text();
                            } catch (e) {
                                console.error('Failed to read error response body:', e);
                            }
                            console.error('Clear all follows failed on backend:', response.status, errorText);
                            swal('Lỗi!', errorText, 'error');
                        }
                    } catch (err) {
                        console.error('Network error during clear all follows:', err);
                        swal('Lỗi!', 'Đã xảy ra lỗi khi kết nối đến máy chủ.', 'error');
                    }
                } else {
                    // If no user is logged in, use the local bookmark context
                    // You need to add a removeAllBookmarks function to your BookmarkContext
                    // Assuming removeAllBookmarks exists in BookmarkContext and uses dispatch
                    dispatch({ type: 'REMOVE_ALL_BOOKMARKS' }); // Use dispatch for local state
                    swal('Thành công!', 'Đã xóa tất cả đánh dấu.', 'success');
                    // The original code reloaded the page here, which is generally not recommended in React.
                    // Removing all bookmarks via context/reducer should update the UI automatically.
                    // setTimeout(window.location.reload.bind(window.location), 2000); // Avoid page reload
                }
            }
        });
    };

    return (
        <>
            <Helmet>
                <title>Theo dõi - thế giới truyện tranh</title>
                <meta
                    name="description"
                    content="Danh sách tất cả các bộ truyện tranh theo dõi trên thế giới truyện tranh"
                />
            </Helmet>
            <div className="container all-list">
                <div className="serieslist">
                    <h2>
                        <span>Danh sách</span> Theo dõi
                        {/* Show "Xóa tất cả" button only if there are stories to display */}
                        {displayedStories && displayedStories.length > 0 && (
                            <button className="remove-all" onClick={handleRemoveAllBookmarks}>
                                Xóa tất cả
                            </button>
                        )}
                    </h2>

                    {loading ? (
                        <p className="text-message">Đang tải danh sách truyện theo dõi...</p>
                    ) : (
                        <>
                            {displayedStories && displayedStories.length > 0 ? (
                                <div className="series-list">
                                    {displayedStories.map((seri) => (
                                        // Render each series item
                                        // You might have a reusable SeriesItem component
                                        // If not, render the structure directly here
                                        <div className="series-item" key={seri.id}>
                                            {' '}
                                            {/* Use seri.id or seri.storyId */}
                                            <div className="series-content">
                                                <div className="thumb">
                                                    <Link to={`/series/` + seri.id}>
                                                        <img src={seri.cover_image} alt={seri.title} />{' '}
                                                        {/* Use seri.title for alt text */}
                                                    </Link>
                                                </div>
                                                <div className="series-preview">
                                                    <Link to={`/series/` + seri.id + `/`}>
                                                        <h3 className="title">{seri.title}</h3>
                                                    </Link>
                                                    <div className="favorite pages">
                                                        {/* Use seri.id or seri.storyId for removal */}
                                                        <button
                                                            className="remove"
                                                            onClick={() => handleRemoveBookmark(seri.id)}
                                                        >
                                                            <FontAwesomeIcon icon={faXmark} /> Xóa
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-message not-found">
                                    <h2>Danh sách truyện theo dõi trống</h2>
                                    <p>
                                        Bạn chưa theo dõi truyện nào, hãy bấm theo dõi để lưu bộ truyện mình thích nhé!
                                    </p>
                                    <div className="svg-img">
                                        <img src={notFound} alt="Not Found" />
                                    </div>
                                    <Link to="/series-list/0">
                                        <span className="back-home">Quay về danh sách truyện</span>
                                    </Link>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default Bookmark;
