import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { HistoryContext } from '~/contexts/historyContext';
import { DiscussionEmbed } from 'disqus-react';
import NotFoundPages from '../Notfound/notFoundPages';
import LazyLoad from 'react-lazyload';

// const ChapterViewer = ({ chapter, slug }) => {
const ChapterViewer = ({ chapter, chapters }) => {
    console.log('chapter view', chapter);
    console.log('chapters view', chapters);
    const id = chapter.chapterId;
    const chapter_image = chapter.images;
    const chapter_number = chapter.chapterNumber;
    const chapter_title = chapter.title;

    const chapters_name = chapters.title; //ten truyen
    const allchapters = chapters.chapters; //tất cả chapter
    console.log('allchapters', allchapters);

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
    const addHistory = () => {
        // dispatch({ type: 'REMOVE_HISTORY', id: id });
        // dispatch({
        //     type: 'ADD_HISTORY',
        //     chapter: {
        //         id,
        //         ch_title,
        //         slug,
        //         date_time,
        //         chapters_name,
        //     },
        // });
    };
    console.log('chapter_title', allchapters);

    const currentChapterIndex = allchapters.findIndex((chapter) => chapter.chapterNumber === chapter_number);
    console.log('currentChapterIndex', currentChapterIndex);
    console.log('allchapters.length - 1', allchapters.length - 1);

    const prevChapter = currentChapterIndex === allchapters.length - 1 ? null : allchapters[currentChapterIndex + 1];
    console.log('prevChapter', prevChapter);

    const nextChapter = currentChapterIndex === 0 ? null : allchapters[currentChapterIndex - 1];
    console.log('nextChapter', nextChapter);
    return (
        <div className="container">
            {!chapter_number && <NotFoundPages />}
            {chapter_number && (
                <div className="chapter-viewer" onLoad={() => addHistory()}>
                    <div className="viewer-info">
                        <h3>
                            {chapters_name} - Chapter {chapter_number}
                        </h3>
                        <div className="navi-chapter">
                            {prevChapter ? (
                                <Link to={`/chapter/${prevChapter.chapterId}/${chapters.story_id}`}>
                                    <span className="prev">
                                        <FontAwesomeIcon icon={faArrowLeft} /> Prev
                                    </span>
                                </Link>
                            ) : (
                                <span className="prev disabled">
                                    <FontAwesomeIcon icon={faArrowLeft} /> Prev
                                </span>
                            )}
                            <Link to={``}>
                                <span className="all-chapter">View All Chapters</span>
                            </Link>
                            {nextChapter ? (
                                <Link to={`/chapter/${nextChapter.chapterId}/${chapters.story_id}`}>
                                    <span className="next">
                                        Next <FontAwesomeIcon icon={faArrowRight} />
                                    </span>
                                </Link>
                            ) : (
                                <span className="next disabled">
                                    Next <FontAwesomeIcon icon={faArrowRight} />
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
                                    <FontAwesomeIcon icon={faArrowLeft} /> Prev
                                </span>
                            </Link>
                        ) : (
                            <span className="prev disabled">
                                <FontAwesomeIcon icon={faArrowLeft} /> Prev
                            </span>
                        )}
                        <Link to={``}>
                            <span className="all-chapter">View All Chapters</span>
                        </Link>
                        {nextChapter ? (
                            <Link to={`/chapter/${nextChapter.chapterId}/${chapters.story_id}`}>
                                <span className="next">
                                    Next <FontAwesomeIcon icon={faArrowRight} />
                                </span>
                            </Link>
                        ) : (
                            <span className="next disabled">
                                Next <FontAwesomeIcon icon={faArrowRight} />
                            </span>
                        )}
                    </div>

                    <div className="comments">
                        <DiscussionEmbed shortname={disqusShortname} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChapterViewer;
