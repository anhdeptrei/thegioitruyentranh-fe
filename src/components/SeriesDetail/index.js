import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { BookmarkContext } from '~/contexts/bookmarkContext';
import { HistoryContext } from '~/contexts/historyContext';

import { DiscussionEmbed } from 'disqus-react';
import ChapterList from '../ChapterList';
import NotFoundPages from '../Notfound/notFoundPages';
import swal from 'sweetalert';

const SeriesDetail = ({ series }) => {
    console.log('series detail', series);
    const id = series.story_id; //id truyen
    const chapters = series.chapters; //chap truyen
    const categories = series.categories; //the loai truyen
    console.log('categories', categories);
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

    const { dispatch, bookmark } = useContext(BookmarkContext);
    const addBookmark = () => {
        // dispatch({
        //     type: 'ADD_BOOKMARK',
        //     series: {
        //         id,
        //         title,
        //         thumb_url,
        //         slug,
        //         date_time,
        //     },
        // });
        // swal({
        //     title: 'Saved',
        //     text: 'Success added to Bookmark',
        //     icon: 'success',
        // });
    };
    const removeBookmark = () => {
        // dispatch({ type: 'REMOVE_BOOKMARK', id: series.data.item._id });
        // swal({
        //     title: 'Removed',
        //     text: 'Success removed from Bookmark',
        //     icon: 'success',
        // });
    };
    let storedSeries = bookmark.find((bookmark) => bookmark.id === id);
    const bookmarkDisabled = storedSeries ? true : false;

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
                                            {!bookmarkDisabled && (
                                                <button onClick={() => addBookmark()}>
                                                    <FontAwesomeIcon icon={faHeart} /> Add to Bookmark
                                                </button>
                                            )}
                                            {bookmarkDisabled && (
                                                <button className="remove" onClick={() => removeBookmark()}>
                                                    <FontAwesomeIcon icon={faXmark} /> Remove
                                                </button>
                                            )}
                                        </div>
                                        {shortHistory.length !== 0 && (
                                            <span className="continue">
                                                <Link to={`/chapter/${shortHistory[0].id}/${shortHistory[0].slug}`}>
                                                    Continue Read
                                                </Link>
                                            </span>
                                        )}
                                    </div>
                                    <ul>
                                        {console.log('authors', authors)}
                                        {authors && (
                                            <li>
                                                <b>Author(s)</b>
                                                <span>{authors}</span>
                                            </li>
                                        )}
                                        {status && (
                                            <li>
                                                <b>Status</b>
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
                                                        <Link to={`/genre/${category.categori_name}`} key={index}>
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
                                    <h4>Synopsis</h4>
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
                            <div className="comments">
                                <DiscussionEmbed shortname={disqusShortname} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SeriesDetail;
