import Moment from 'moment';
import './section2.scss';

const Section2 = (props) => {
    const {
        celebrationDay,
        email,
        facebook,
        youtube,
        fullEnglishName,
        fullVietnameseName,
        shorthandName,
        captain,
        songs
    } = props.info;

    return (
        <div className="section section2">
            <div className="background"></div>
            <div className="content">
                <h1>Tổng quan về Đội</h1>
                <ul>
                    <li>
                        <p>
                            Tên gọi đầy đủ: <b>{fullVietnameseName}</b>
                        </p>
                    </li>
                    <li>
                        <p>
                            Tên viết tắt: <b>{shorthandName}</b> -{' '}
                            <b>{fullEnglishName}</b>
                        </p>
                    </li>
                    <li>
                        <p className="list">Bài hát của Đội:</p>
                        <ul>
                            {songs?.map((song, index) => {
                                return <li key={index}>{song}</li>;
                            })}
                        </ul>
                    </li>
                    <li>
                        <p>
                            Đội trưởng đương nhiệm:{' '}
                            <a href={captain?.facebook} target="blank">
                                <b>{captain?.fullName}</b>
                            </a>
                        </p>
                    </li>
                    <li>
                        <p>
                            Ngày truyền thống của Đội:{' '}
                            <b>{Moment(celebrationDay).format('DD-MM')}</b>
                        </p>
                    </li>
                    <li>
                        <p className="list">
                            Hoạt động truyền thống hàng tuần của Đội:
                        </p>
                        <ul>
                            <li>
                                Dạy học tại{' '}
                                <a href="http://huunghidongda.org.vn/">
                                    Nhà Trẻ Hữu Nghị Quận Đống Đa
                                </a>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <p className="list">
                            Cổng thông tin chính thức của Đội:
                        </p>
                        <ul>
                            <li>
                                E-mail:{' '}
                                <a href={`mailto:${email}`} target="blank">
                                    {email}
                                </a>
                            </li>
                            <li>
                                Youtube:{' '}
                                <a href={youtube} target="blank">
                                    Trường CNTT&TT Đội SVTN
                                </a>
                            </li>
                            <li>
                                Facebook:{' '}
                                <a href={facebook} target="blank">
                                    Đội Tình nguyện Trường Công nghệ Thông tin
                                    và Truyền thông
                                </a>
                            </li>
                            <li>
                                Fanpage:{' '}
                                <a href={facebook} target="blank">
                                    Đội Tình nguyện Trường Công nghệ Thông tin
                                    và Truyền thông
                                </a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Section2;
