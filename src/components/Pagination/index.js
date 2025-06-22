import { Link } from 'react-router-dom';

const Pagination = ({ series, url }) => {
    console.log('Dữ liệu của pagination series:', series);
    const checkNull = true;
    // Lấy số trang hiện tại (bắt đầu từ 1)
    const currentPages = checkNull ? parseInt(series.pageable.pageNumber) + 1 : 1;
    const totalPages = checkNull ? parseInt(series.totalPages) : 1;
    const prev = currentPages - 1;
    const next = currentPages + 1;
    const prev_status = currentPages > 1;
    const next_status = currentPages < totalPages;

    // Tạo mảng số trang để hiển thị
    let pageNumbers = [];
    if (totalPages <= 6) {
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
        }
    } else {
        if (currentPages <= 4) {
            pageNumbers = [1, 2, 3, 4, 5, '...', totalPages];
        } else if (currentPages >= totalPages - 3) {
            pageNumbers = [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        } else {
            pageNumbers = [1, '...', currentPages - 1, currentPages, currentPages + 1, '...', totalPages];
        }
    }

    return (
        <div className="pagination">
            {!series.error && checkNull === true && (
                <ul className="pagination-list">
                    {prev_status ? (
                        <li className="prev-page">
                            <Link to={url + (prev - 1)}>Trang trước</Link>
                        </li>
                    ) : (
                        <li className="prev-page disabled">
                            <span>Trang trước</span>
                        </li>
                    )}
                    {pageNumbers.map((num, idx) => {
                        if (num === '...') {
                            return (
                                <li key={'ellipsis-' + idx} className="ellipsis">
                                    <span>...</span>
                                </li>
                            );
                        }
                        return num === currentPages ? (
                            <li key={num} className="current-page">
                                <span>{num}</span>
                            </li>
                        ) : (
                            <li key={num}>
                                <Link to={url + (num - 1)}>{num}</Link>
                            </li>
                        );
                    })}
                    {next_status ? (
                        <li className="next-page">
                            <Link to={url + (next - 1)}>Trang sau</Link>
                        </li>
                    ) : (
                        <li className="next-page disabled">
                            <span>Trang sau</span>
                        </li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default Pagination;
