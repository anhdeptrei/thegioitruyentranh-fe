import { Link } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faFlag } from '@fortawesome/free-solid-svg-icons';
import { HistoryContext } from '~/contexts/historyContext';
import { AuthContext } from '~/contexts/authContext'; // Import AuthContext
import { DiscussionEmbed } from 'disqus-react';
import NotFoundPages from '../Notfound/notFoundPages';
import LazyLoad from 'react-lazyload';
import Modal from '../Layout/Client/PageComponents/Modal'; // Import Modal component (adjust path if needed)
import ReportForm from '../Layout/Client/PageComponents/Modal/ReportForm'; // *** Import ReportForm ***
import swal from 'sweetalert'; // Import swal for messages
import ChapterComments from './ChapterComments';

const ChapterViewer = ({ chapter, chapters }) => {
    console.log('chapter view', chapter);
    console.log('chapters view', chapters);
    const id = chapter.chapterId; // chapterId
    const chapter_image = chapter.images;
    const chapter_number = chapter.chapterNumber;
    const chapter_title = chapter.title;

    const id_chapters = chapters.story_id; // storyId
    const chapters_name = chapters.title; //ten truyen
    const allchapters = chapters.chapters; //tất cả chapter

    // const slug = chapters.data.item.slug; //slug truyen

    const ch_title = 'Chapter ' + chapter_number;

    const title = chapter.manga_title;
    const ch = chapter.current_ch;

    const series = chapter.manga_slug;
    const images = chapter.chapters;
    const navi = chapter.nav;

    const disqusShortname = 'read-comic';
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    var date_time = date + ' ' + time;

    const { dispatch } = useContext(HistoryContext);
    // Get loggedInUser from AuthContext
    const { loggedInUser, handleLoginSuccess } = useContext(AuthContext);

    // State for report modal (remains in ChapterViewer)
    const [showReportModal, setShowReportModal] = useState(false);
    // Removed report form specific states (reportDetail, reportDescription, loadingReport, reportError)

    // const addHistory = () => {
    //     dispatch({ type: 'REMOVE_HISTORY', id: id });
    //     dispatch({
    //         type: 'ADD_HISTORY',
    //         chapter: {
    //             id,
    //             ch_title,
    //             id_chapters,
    //             chapters_name,
    //             date_time,
    //         },
    //     });
    //     console.log('Adding to history:', {
    //         id,
    //         ch_title,
    //         id_chapters,
    //         chapters_name,
    //         date_time,
    //     });
    // };
    const userAddHistory = async (historyEntryData) => {
        const response = await fetch(`http://localhost:8080/readinghistories`, {
            // Example URL
            method: 'POST', // Or PUT, check your backend API
            headers: {
                'Content-Type': 'application/json',
                // Add any necessary auth headers
            },
            body: JSON.stringify({
                userId: loggedInUser.userId,
                lastReadChapter: historyEntryData.chapterId, // Send chapter ID
            }),
        });

        if (response.ok) {
            console.log('History saved successfully on backend. Refetching user data...');
            // *** Refetch user data after successful save ***
            // Call refetchUser from context to get updated user data including readingHistories
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
        } else {
            // Handle backend error
            let errorText = 'Không thể lưu lịch sử đọc.';
            try {
                errorText = await response.text();
            } catch (e) {
                console.error('Failed to read error response body:', e);
            }
            console.error('Save history failed on backend:', response.status, errorText);
            // Optionally show a swal error message
            // swal('Lỗi!', errorText, 'error');
        }
    };
    const userUpdateHistory = async (historyId, historyEntryData) => {
        const response = await fetch(`http://localhost:8080/readinghistories/${historyId}`, {
            // Example URL
            method: 'PUT', // Or POST, check your backend API
            headers: {
                'Content-Type': 'application/json',
                // Add any necessary auth headers
            },
            body: JSON.stringify({
                userId: loggedInUser.userId,
                lastReadChapter: historyEntryData.chapterId, // Send chapter ID
            }),
        });

        if (response.ok) {
            console.log('History saved successfully on backend. Refetching user data...');
            // *** Refetch user data after successful save ***
            // Call refetchUser from context to get updated user data including readingHistories
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
        } else {
            // Handle backend error
            let errorText = 'Không thể lưu lịch sử đọc.';
            try {
                errorText = await response.text();
            } catch (e) {
                console.error('Failed to read error response body:', e);
            }
            console.error('Save history failed on backend:', response.status, errorText);
            // Optionally show a swal error message
            // swal('Lỗi!', errorText, 'error');
        }
    };
    const { history } = useContext(HistoryContext); // Get history from context
    const addHistory = async () => {
        // Made async to use await for backend call
        // Data needed for history entry (both backend and local)

        const historyEntryData = {
            storyId: id_chapters,
            chapterId: id,
            storyTitle: chapters_name,
            chapterTitle: ch_title,
            date: date_time,
        };

        if (loggedInUser) {
            // If user is logged in, call backend API to save/update history
            console.log('Attempting to save history to backend:', historyEntryData);
            try {
                // Đảm bảo chỉ có 1 entry cho mỗi storyId
                const histories = loggedInUser.readingHistories || [];
                const historyEntry = histories.find((item) => item.storyId === id_chapters);

                if (historyEntry) {
                    if (historyEntry.lastReadChapter === id) {
                        // Đã up-to-date, không làm gì cả
                        return;
                    } else {
                        // Update entry
                        console.log('Updating existing history entry:', historyEntry);
                        await userUpdateHistory(historyEntry.readingHistoryId, historyEntryData);
                    }
                } else {
                    // Chưa có entry cho story này, thêm mới
                    await userAddHistory(historyEntryData);
                }
            } catch (err) {
                console.error('Network error during save history API call:', err);
            }
        } else {
            // If no user is logged in, use the local history context
            console.log('Saving history to local storage:', historyEntryData);
            dispatch({
                type: 'ADD_HISTORY',
                chapter: historyEntryData, // Dispatch the new structure
            });
        }
    };

    // Use effect to add history when chapterId or storyId changes (indicating a new chapter/story is viewed)
    // This ensures history is recorded when navigating between chapters of the same story or to a new story
    useEffect(() => {
        // Only add history if chapterId and storyId are valid
        if (id && id_chapters) {
            addHistory();
            console.log('add history successfully');
        }
    }, [id, id_chapters, loggedInUser]); // Depend on chapterId, storyId, and loggedInUser (to trigger refetch on login)

    const currentChapterIndex = allchapters.findIndex((chapter) => chapter.chapterNumber === chapter_number);

    const prevChapter = currentChapterIndex === allchapters.length - 1 ? null : allchapters[currentChapterIndex + 1];

    const nextChapter = currentChapterIndex === 0 ? null : allchapters[currentChapterIndex - 1];

    // Functions to control report modal (remain in ChapterViewer)
    const openReportModal = () => {
        if (loggedInUser) {
            // Only allow reporting if logged in
            setShowReportModal(true);
            // No need to clear form states here, ReportForm manages its own state
        } else {
            swal('Thông báo', 'Vui lòng đăng nhập để gửi báo cáo.', 'info');
        }
    };

    const closeReportModal = () => {
        setShowReportModal(false);
        // No need to reset form states here, ReportForm manages its own state
    };

    // Removed handleSubmitReport function

    return (
        <div className="container">
            {!chapter_number && <NotFoundPages />} {/* Check if chapter_number exists */}
            {chapter_number && (
                <div className="chapter-viewer">
                    <div className="viewer-info">
                        <h3>
                            {chapters_name} - Chapter {chapter_number}
                        </h3>
                        <div className="navi-chapter">
                            {prevChapter ? (
                                <Link to={`/chapter/${prevChapter.chapterId}/${chapters.story_id}`}>
                                    <span className="prev">
                                        <FontAwesomeIcon icon={faArrowLeft} /> chương trước
                                    </span>
                                </Link>
                            ) : (
                                <span className="prev-disabled">
                                    <FontAwesomeIcon icon={faArrowLeft} /> chương trước
                                </span>
                            )}
                            {/* <Link to={``}>
                                <span className="all-chapter">View All Chapters</span>
                            </Link> */}
                            {/* Report Button - Show only if logged in */}
                            {loggedInUser && (
                                <button className="report-button" onClick={openReportModal}>
                                    <FontAwesomeIcon icon={faFlag} /> Báo cáo
                                </button>
                            )}
                            {nextChapter ? (
                                <Link to={`/chapter/${nextChapter.chapterId}/${chapters.story_id}`}>
                                    <span className="next">
                                        Chương sau <FontAwesomeIcon icon={faArrowRight} />
                                    </span>
                                </Link>
                            ) : (
                                <span className="next-disabled">
                                    Chương sau <FontAwesomeIcon icon={faArrowRight} />
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="reader-area">
                        {chapter_image.map((img, index) => (
                            <LazyLoad height={200} offset={100} key={index}>
                                <img src={img.imageUrl} alt={img.imageUrl} />
                            </LazyLoad>
                        ))}
                    </div>
                    <div className="navi-chapter">
                        {prevChapter ? (
                            <Link to={`/chapter/${prevChapter.chapterId}/${chapters.story_id}`}>
                                <span className="prev">
                                    <FontAwesomeIcon icon={faArrowLeft} /> Chương trước
                                </span>
                            </Link>
                        ) : (
                            <span className="prev-disabled">
                                <FontAwesomeIcon icon={faArrowLeft} /> Chương trước
                            </span>
                        )}
                        {/* <Link to={``}>
                            <span className="all-chapter">View All Chapters</span>
                        </Link> */}
                        {nextChapter ? (
                            <Link to={`/chapter/${nextChapter.chapterId}/${chapters.story_id}`}>
                                <span className="next">
                                    Chương sau <FontAwesomeIcon icon={faArrowRight} />
                                </span>
                            </Link>
                        ) : (
                            <span className="next-disabled">
                                Chương sau <FontAwesomeIcon icon={faArrowRight} />
                            </span>
                        )}
                    </div>

                    {/* <div className="comments">
                        <DiscussionEmbed shortname={disqusShortname} />
                    </div> */}
                    <ChapterComments chapterId={id} loggedInUser={loggedInUser} />
                </div>
            )}
            {/* Report Modal - Render ReportForm inside */}
            <Modal isOpen={showReportModal} onClose={closeReportModal}>
                {/* Render ReportForm component and pass necessary props */}
                <ReportForm chapterId={id} onClose={closeReportModal} />
            </Modal>
        </div>
    );
};

export default ChapterViewer;
