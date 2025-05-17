import { useContext } from 'react';
import { HistoryContext } from '~/contexts/historyContext';
import notFound from '~/components/images/not-found.svg';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import swal from 'sweetalert';

const History = () => {
    const { dispatch, history } = useContext(HistoryContext);
    console.log('history', history);
    const shortHistory = history.sort(function (a, b) {
        return new Date(b.date) - new Date(a.date);
    });
    const removeHistory = (hist_id) => {
        swal({
            title: 'Bạn có chắc chắn không?',
            text: 'Một khi đã xóa, bạn sẽ không thể khôi phục lại lịch sử của mình!',
            icon: 'warning',
            buttons: ['Không', 'Có'],
            dangerMode: true,
        }).then((remove) => {
            if (remove) {
                dispatch({ type: 'REMOVE_HISTORY', id: hist_id });
                swal({
                    title: 'Đã xóa',
                    text: 'Đã xóa khỏi lịch sử',
                    icon: 'success',
                });
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
        }).then((remove) => {
            if (remove) {
                swal({
                    title: 'Đã xóa',
                    text: 'Đã xóa tất cả lịch sử',
                    icon: 'success',
                });
                localStorage.setItem('history', []);
                setTimeout(window.location.reload.bind(window.location), 2000);
            }
        });
    };
    return history.length ? (
        <div className="container all-list">
            <Helmet>
                <title>Lịch sử đọc truyện - thế giới truyện tranh</title>
                <meta name="description" content="Lịch sử đọc truyện trên thế giới truyện tranh" />
            </Helmet>
            <div className="history-list">
                <h2>
                    <span>Lịch sử</span> đọc truyện
                    <button className="remove-all" onClick={() => removeAllHistory()}>
                        Xóa tất cả
                    </button>
                </h2>
                {shortHistory.map((hist) => (
                    <div className="history-item" key={hist.id}>
                        <Link
                            to={`/chapter/${hist.id}/${hist.id_chapters}`}
                        >{`${hist.title}-${hist.manga_title}`}</Link>
                        <button className="remove" onClick={() => removeHistory(hist.id)}>
                            <FontAwesomeIcon icon={faXmark} /> Remove
                        </button>
                    </div>
                ))}
            </div>
        </div>
    ) : (
        <div className="container">
            <Helmet>
                <title>Lịch sử đọc truyện - thế giới truyện tranh</title>
                <meta name="description" content="Lịch sử đọc truyện trên thế giới truyện tranh" />
            </Helmet>
            <div className="text-message not-found">
                <h2>Lịch sử trống</h2>
                <p>Bạn chưa đọc truyện nào, hãy đọc truyện mới nhé!</p>
                <div className="svg-img">
                    <img src={notFound} alt="Not Found" />
                </div>
                <Link to="/series-list/">
                    <span className="back-home">Quay về danh sách truyện</span>
                </Link>
            </div>
        </div>
    );
};

export default History;
