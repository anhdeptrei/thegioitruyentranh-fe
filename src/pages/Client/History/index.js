import { useContext, useEffect, useState } from 'react';
import { HistoryContext } from '~/contexts/historyContext';
import notFound from '~/components/images/not-found.svg';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import swal from 'sweetalert';
import { AuthContext } from '~/contexts/authContext';

const History = () => {
    const { dispatch, history } = useContext(HistoryContext);
    console.log('history', history);

    // Get loggedInUser and refetchUser from AuthContext
    const { loggedInUser, handleLoginSuccess } = useContext(AuthContext); // Get refetchUser to update user state after history modification
    // State to hold the list of history entries to display (either from readingHistories or local history)
    const [displayedHistory, setDisplayedHistory] = useState([]);
    const [loading, setLoading] = useState(true); // Add loading state

    const shortHistory = history.sort(function (a, b) {
        return new Date(b.date) - new Date(a.date);
    });
    // const removeHistory = (hist_id) => {
    //     swal({
    //         title: 'Bạn có chắc chắn không?',
    //         text: 'Một khi đã xóa, bạn sẽ không thể khôi phục lại lịch sử của mình!',
    //         icon: 'warning',
    //         buttons: ['Không', 'Có'],
    //         dangerMode: true,
    //     }).then((remove) => {
    //         if (remove) {
    //             dispatch({ type: 'REMOVE_HISTORY', id: hist_id });
    //             swal({
    //                 title: 'Đã xóa',
    //                 text: 'Đã xóa khỏi lịch sử',
    //                 icon: 'success',
    //             });
    //         }
    //     });
    // };
    // Effect to update displayedHistory when loggedInUser or local history changes
    useEffect(() => {
        setLoading(true); // Start loading
        if (loggedInUser && loggedInUser.readingHistories) {
            console.log('User logged in, using readingHistories data:', loggedInUser.readingHistories);
            // Map readingHistories data to a format suitable for display
            // Using the structure provided: readingHistoryId, userId, storyId, storyTitle, lastReadChapter (chapter ID), chapterNumber, viewDate
            const userHistory = loggedInUser.readingHistories.map((historyEntry) => ({
                // Map fields from historyEntry object to display format
                id: historyEntry.readingHistoryId, // Use readingHistoryId as id for removal and key
                chapterId: historyEntry.lastReadChapter, // Use lastReadChapter as chapter ID for linking
                storyId: historyEntry.storyId, // *** Use storyId from backend DTO ***
                storyTitle: historyEntry.storyTitle, // Use storyTitle for display
                chapterNumber: historyEntry.chapterNumber, // Use chapterNumber if available for display
                viewDate: historyEntry.viewDate, // Use viewDate for sorting/display date
                // cover_image: historyEntry.storyCoverImage, // If available, include it
            }));

            // Sort by date (most recent first)
            const sortedHistory = userHistory.sort((a, b) => new Date(b.viewDate) - new Date(a.viewDate)); // Use viewDate for sorting

            setDisplayedHistory(sortedHistory);
            setLoading(false); // End loading
        } else {
            console.log('No user logged in, using local history data:', history);
            // Use local history data if no user is logged in
            // Sort local history by date (most recent first)
            const sortedLocalHistory = history.sort((a, b) => new Date(b.date) - new Date(a.date)); // Use date for sorting
            setDisplayedHistory(sortedLocalHistory);
            setLoading(false); // End loading
        }
    }, [loggedInUser, history]); // Depend on loggedInUser and local history

    // Modified to accept history entry ID (readingHistoryId for logged in, chapterId for local)
    const removeHistory = (historyEntryId) => {
        swal({
            title: 'Bạn có chắc chắn không?',
            text: 'Một khi đã xóa, bạn sẽ không thể khôi phục lại lịch sử của mình!',
            icon: 'warning',
            buttons: ['Không', 'Có'],
            dangerMode: true,
        }).then(async (remove) => {
            // Made async to use await for backend call
            if (remove) {
                if (loggedInUser) {
                    // If user is logged in, call backend API to remove history entry by readingHistoryId
                    console.log(
                        `Attempting to remove history entry with readingHistoryId: ${historyEntryId} for user: ${loggedInUser.userId}`,
                    );
                    try {
                        // *** IMPORTANT: Replace with your actual backend API endpoint to remove history by ID ***
                        // Assuming a DELETE request to /users/{userId}/histories/{readingHistoryId}
                        const response = await fetch(`http://localhost:8080/readinghistories/${historyEntryId}`, {
                            // Example URL
                            method: 'DELETE', // Or POST, check your backend API
                            headers: {
                                'Content-Type': 'application/json',
                                // Add any necessary auth headers
                            },
                        });

                        if (response.ok) {
                            console.log('History entry removed successfully on backend. Refetching user data...');
                            // *** Refetch user data after successful removal ***
                            // Call  f to get updated user data
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
                            swal({
                                title: 'Đã xóa',
                                text: 'Đã xóa khỏi lịch sử',
                                icon: 'success',
                            });
                        } else {
                            // Handle backend error
                            let errorText = 'Không thể xóa lịch sử đọc.';
                            try {
                                errorText = await response.text();
                            } catch (e) {
                                console.error('Failed to read error response body:', e);
                            }
                            console.error('Remove history failed on backend:', response.status, errorText);
                            swal('Lỗi!', errorText, 'error');
                        }
                    } catch (err) {
                        console.error('Network error during remove history API call:', err);
                        swal('Lỗi!', 'Đã xảy ra lỗi khi kết nối đến máy chủ.', 'error');
                    }
                } else {
                    // If no user is logged in, use the local history context
                    // Assuming the local history item ID is the chapter ID
                    // The removeHistory button in JSX passes hist.id, which is chapterId for local history
                    dispatch({ type: 'REMOVE_HISTORY', id: historyEntryId }); // Use dispatch with the chapterId
                    swal({
                        title: 'Đã xóa',
                        text: 'Đã xóa khỏi lịch sử',
                        icon: 'success',
                    });
                }
            }
        });
    };

    const removeAllHistory = () => {
        swal({
            title: 'Bạn có chắc chắn không?',
            text: 'Một khi đã xóa, bạn sẽ không thể khôi phục lại lịch sử của mình!',
            icon: 'warning',
            buttons: ['Không', 'Có'],
            dangerMode: true,
        }).then(async (remove) => {
            // Made async to use await for backend call
            if (remove) {
                if (loggedInUser) {
                    // If user is logged in, call backend API to clear all history
                    console.log(`Attempting to clear all history for user: ${loggedInUser.userId}`);
                    try {
                        // *** IMPORTANT: Replace with your actual backend API endpoint to clear all history ***
                        // Assuming a DELETE request to /users/{userId}/histories
                        const response = await fetch(
                            `http://localhost:8080/readinghistories/by-user/${loggedInUser.userId}`,
                            {
                                // Example URL
                                method: 'DELETE', // Or POST, check your backend API
                                headers: {
                                    'Content-Type': 'application/json',
                                    // Add any necessary auth headers
                                },
                            },
                        );

                        if (response.ok) {
                            console.log('Clear all history successful on backend. Refetching user data...');
                            // *** Refetch user data after successful clear all history ***
                            // Call refetchUser from context
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
                            swal({
                                title: 'Đã xóa',
                                text: 'Đã xóa tất cả lịch sử',
                                icon: 'success',
                            });
                            // The original code reloaded the page here, which is generally not recommended in React.
                            // Refetching user data should update the UI automatically.
                            // setTimeout(window.location.reload.bind(window.location), 2000); // Avoid page reload
                        } else {
                            // Handle backend error
                            let errorText = 'Không thể xóa tất cả lịch sử.';
                            try {
                                errorText = await response.text();
                            } catch (e) {
                                console.error('Failed to read error response body:', e);
                            }
                            console.error('Clear all history failed on backend:', response.status, errorText);
                            swal('Lỗi!', errorText, 'error');
                        }
                    } catch (err) {
                        console.error('Network error during clear all history API call:', err);
                        swal('Lỗi!', 'Đã xảy ra lỗi khi kết nối đến máy chủ.', 'error');
                    }
                } else {
                    // If no user is logged in, use the local history context
                    // Assuming removeAllHistories exists in HistoryContext and uses dispatch
                    dispatch({ type: 'REMOVE_ALL_HISTORIES' }); // Use dispatch for local state
                    swal({
                        title: 'Đã xóa',
                        text: 'Đã xóa tất cả lịch sử',
                        icon: 'success',
                    });
                    // The original code reloaded the page here, which is generally not recommended in React.
                    // Removing all history via context/reducer should update the UI automatically.
                    // setTimeout(window.location.reload.bind(window.location), 2000); // Avoid page reload
                }
            }
        });
    };
    return (
        <div className="container all-list">
            <Helmet>
                <title>Lịch sử đọc truyện - thế giới truyện tranh</title>
                <meta name="description" content="Lịch sử đọc truyện trên thế giới truyện tranh" />
            </Helmet>
            <div className="history-list">
                <h2>
                    <span>Lịch sử</span> đọc truyện
                    {/* Show "Xóa tất cả" button only if there are history entries to display */}
                    {displayedHistory && displayedHistory.length > 0 && (
                        <button className="remove-all" onClick={() => removeAllHistory()}>
                            Xóa tất cả
                        </button>
                    )}
                </h2>

                {loggedInUser ? (
                    <p className="text-message">
                        Bạn đang xem lịch sử đọc truyện của tài khoản: <b>{loggedInUser.username}</b>
                    </p>
                ) : (
                    <p className="text-message">
                        Bạn đang xem lịch sử đọc truyện được lưu trữ trên trình duyệt của bạn. Đăng nhập để đồng bộ lịch
                        sử đọc của bạn!
                    </p>
                )}

                {loading ? (
                    <p className="text-message">Đang tải lịch sử đọc truyện...</p>
                ) : (
                    <>
                        {displayedHistory && displayedHistory.length > 0 ? (
                            displayedHistory.map((hist) => (
                                <div className="history-item" key={hist.id || hist.lastReadChapterId}>
                                    {/* Link to the chapter */}
                                    {hist.storyId && hist.lastReadChapterId ? (
                                        <Link to={`/chapter/${hist.lastReadChapterId}/${hist.storyId}`}>
                                            {`${hist.storyTitle} - ${hist.lastReadChapterTitle}`}
                                        </Link>
                                    ) : (
                                        <Link to={`/chapter/${hist.chapterId}/${hist.storyId}`}>
                                            {console.log('hist', hist)}
                                            {`${hist.storyTitle || hist.manga_title} - Chapter ${
                                                hist.chapterNumber || hist.chapterId || ''
                                            }`}
                                        </Link>
                                    )}
                                    <button
                                        className="remove"
                                        onClick={() => removeHistory(hist.id || hist.lastReadChapterId)}
                                    >
                                        <FontAwesomeIcon icon={faXmark} /> Remove
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="text-message not-found">
                                <h2>Lịch sử trống</h2>
                                <p>Bạn chưa đọc truyện nào, hãy đọc truyện mới nhé!</p>
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
    );
};

export default History;
