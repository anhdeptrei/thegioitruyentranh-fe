import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { faPhone, faFace } from '@fortawesome/free-solid-svg-icons';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
    return (
        <div class="custom-footer">
            <div class="custom-footer-text">Nếu bạn muốn tìm thêm thông tin hãy liên hệ với chúng tôi:</div>
            <div class="custom-footer-icons">
                <a
                    href="https://www.facebook.com/doanvietanh289/"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Facebook"
                >
                    <FontAwesomeIcon icon={faFacebook} size="2x" style={{ color: '#1877f3' }} />
                </a>
                <FontAwesomeIcon icon={faPhone} size="2x" style={{ color: '#43a047' }} />
                <span class="custom-footer-phone">0377954843</span>
            </div>
        </div>
    );
};

export default Footer;
