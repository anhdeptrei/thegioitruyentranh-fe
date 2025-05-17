import { Link } from 'react-router-dom';
import notFound from '../images/not-found.svg';
import { Helmet } from 'react-helmet';

const NotFoundPages = () => {
    return (
        <div className="container">
            <Helmet>
                <title>Page Not Found - thế giới truyện tranh</title>
                <meta name="description" content="Trang này không tồn tại trên thế giới truyện tranh" />
            </Helmet>
            <div className="text-message not-found">
                <h2>Xin lỗi</h2>
                <p>Trang này không thể được tìm thấy</p>
                <div className="svg-img">
                    <img src={notFound} alt="404 Not Found" />
                </div>
                <Link to="/">
                    <span className="back-home">Back to Home</span>
                </Link>
            </div>
        </div>
    );
};

export default NotFoundPages;
