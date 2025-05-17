import { Link } from 'react-router-dom';
import notFound from '../images/not-found.svg';
import { Helmet } from 'react-helmet';

const NotFoundSeries = () => {
    return (
        <div className="container">
            <Helmet>
                <title>Search Not Found - thế giới truyện tranh</title>
                <meta name="description" content="Kết quả tìm kiếm không tồn tại trên thế giới truyện tranh" />
            </Helmet>
            <div className="text-message not-found">
                <h2>Xin lỗi</h2>
                <p>Kết quả tìm kiếm không được tìm thấy</p>
                <div className="svg-img">
                    <img src={notFound} alt="Not Found" />
                </div>
                <Link to="/">
                    <span className="back-home">Quay về trang chủ</span>
                </Link>
            </div>
        </div>
    );
};

export default NotFoundSeries;
