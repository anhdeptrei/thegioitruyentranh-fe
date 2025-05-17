import { Link } from 'react-router-dom';
import { useContext, useEffect } from 'react';
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
    console.log(id);
    const chapter_image = chapter.images;
    const chapter_number = chapter.chapterNumber;
    const chapter_title = chapter.title;

    const id_chapters = chapters.story_id;
    console.log(id_chapters);
    const chapters_name = chapters.title; //ten truyen
    console.log(chapters_name);
    const allchapters = chapters.chapters; //tất cả chapter
    console.log('allchapters', allchapters);

    // const slug = chapters.data.item.slug; //slug truyen

    const ch_title = 'Chapter ' + chapter_number;
    console.log(ch_title);

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
        dispatch({ type: 'REMOVE_HISTORY', id: id });
        dispatch({
            type: 'ADD_HISTORY',
            chapter: {
                id,
                ch_title,
                id_chapters,
                chapters_name,
                date_time,
            },
        });
        console.log('Adding to history:', {
            id,
            ch_title,
            id_chapters,
            chapters_name,
            date_time,
        });
    };
    useEffect(() => {
        addHistory();
    }, []); // Chỉ chạy một lần khi component được render

    const currentChapterIndex = allchapters.findIndex((chapter) => chapter.chapterNumber === chapter_number);

    const prevChapter = currentChapterIndex === allchapters.length - 1 ? null : allchapters[currentChapterIndex + 1];

    const nextChapter = currentChapterIndex === 0 ? null : allchapters[currentChapterIndex - 1];
    return (
        <div className="container">
            {!chapter_number && <NotFoundPages />}
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

                    <div className="comments">
                        <DiscussionEmbed shortname={disqusShortname} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChapterViewer;
