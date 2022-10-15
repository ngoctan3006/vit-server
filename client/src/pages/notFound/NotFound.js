import { Link } from 'react-router-dom';
import image from '../../assets/images/404.svg';
import './notFound.css';

const NotFound = () => {
  return (
    <div className="not-found__container">
      <div className="not-found__inner">
        <img src={image} alt="404" />
        <h1>{'Khum có gì ở đây đâu =)))'}</h1>
        <Link to="/">
          <div className="back-to-home">Quay lại trang chủ</div>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
