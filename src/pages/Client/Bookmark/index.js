import { useContext } from 'react';
import { BookmarkContext } from '~/contexts/bookmarkContext';
import notFound from '~/components/images/not-found.svg';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import swal from 'sweetalert';

const Bookmark = () => {
    const { dispatch, bookmark } = useContext(BookmarkContext);
    console.log('bookmark', bookmark);
    const shortBookmark = bookmark.sort(function (a, b) {
        return new Date(b.date) - new Date(a.date);
    });
    const removeBookmark = (seri_id) => {
        swal({
            title: 'Bạn có chắc chắn không?',
            text: 'Một khi đã xóa, bạn sẽ không thể khôi phục lại đánh dấu của mình!',
            icon: 'warning',
            buttons: ['Không', 'Có'],
            dangerMode: true,
        }).then((remove) => {
            if (remove) {
                dispatch({ type: 'REMOVE_BOOKMARK', id: seri_id });
                swal({
                    title: 'Đã xóa',
                    text: 'Đã xóa khỏi danh sách yêu thích',
                    icon: 'success',
                });
            }
        });
    };
    const removeAllBookmark = () => {
        swal({
            title: 'Bạn có chắc chắn không?',
            text: 'Một khi đã xóa, bạn sẽ không thể khôi phục lại đánh dấu của mình!',
            icon: 'warning',
            buttons: ['Không', 'Có'],
            dangerMode: true,
        }).then((remove) => {
            if (remove) {
                swal({
                    title: 'Đã xóa',
                    text: 'Đã xóa tất cả đánh dấu',
                    icon: 'success',
                });
                localStorage.setItem('bookmark', []);
                setTimeout(window.location.reload.bind(window.location), 2000);
            }
        });
    };
    return bookmark.length ? (
        <div className="container all-list">
            <Helmet>
                <title>Theo dõi - thế giới truyện tranh</title>
                <meta
                    name="description"
                    content="Danh sách tất cả các bộ truyện tranh theo dõi trên thế giới truyện tranh"
                />
            </Helmet>
            <div className="serieslist">
                <h2>
                    <span>Danh sách</span> Theo dõi
                    <button className="remove-all" onClick={() => removeAllBookmark()}>
                        Xóa tất cả
                    </button>
                </h2>
                <div className="series-list">
                    {shortBookmark.map((seri) => (
                        <div className="series-item" key={seri.id}>
                            <div className="series-content">
                                <div className="thumb">
                                    <Link to={`/series/` + seri.id}>
                                        <img src={seri.cover_image} alt={seri.cover_image} />
                                        {console.log('corver image', seri.cover_image)}
                                    </Link>
                                </div>
                                <div className="series-preview">
                                    <Link to={`/series/` + seri.id + `/`}>
                                        <h3 className="title">{seri.title}</h3>
                                    </Link>
                                    <div className="favorite pages">
                                        <button className="remove" onClick={() => removeBookmark(seri.id)}>
                                            <FontAwesomeIcon icon={faXmark} /> Xóa
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    ) : (
        <div className="container">
            <Helmet>
                <title>Theo dõi - thế giới truyện tranh</title>
                <meta
                    name="description"
                    content="Danh sách tất cả các bộ truyện tranh theo dõi trên thế giới truyện tranh"
                />
            </Helmet>
            <div className="text-message not-found">
                <h2>Danh sách truyện theo dõi trống</h2>
                <p>Bạn chưa theo dõi truyện nào, hãy bấm theo dõi để lưu bộ truyện mình thích nhé!</p>
                <div className="svg-img">
                    <img src={notFound} alt="Not Found" />
                </div>
                <Link to="/series-list/0">
                    <span className="back-home">Quay về danh sách truyện</span>
                </Link>
            </div>
        </div>
    );
};

export default Bookmark;
