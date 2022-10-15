import { useContext, useEffect } from 'react';
import Table from '../../components/table/Table';
import { AuthContext } from '../../contexts/AuthContext';
import moment from 'moment';

const renderHead = (item, index) => <th key={index}>{item}</th>;

const renderBody = (item, index) => (
  <tr key={index}>
    <td>{index + 1}</td>
    <td>{item.fullName}</td>
    <td>{moment(item.birthday).format('DD/MM/YYYY')}</td>
    <td>{item.phoneNumber}</td>
    <td>{item.studentId}</td>
    <td>{item.className}</td>
    <td>{item.gen}</td>
    <td>
      {item.gender === 'male'
        ? 'Nam'
        : item.gender === 'female'
        ? 'Nữ'
        : 'Khác'}
    </td>
    <td>{item.school}</td>
    <td>{moment(item.dateJoin).format('MM/YYYY')}</td>
  </tr>
);

const tableHead = [
  'STT',
  'Họ và Tên',
  'Ngày sinh',
  'SĐT',
  'MSSV',
  'Lớp',
  'Khóa',
  'Giới tính',
  'Viện',
  'Năm vào Đội'
];

const Members = () => {
  const {
    authState: { users, usersLoad },
    getUsers
  } = useContext(AuthContext);

  useEffect(() => getUsers(), []);

  return (
    <div>
      <h2 className="page-header">Danh sách thành viên</h2>
      {usersLoad ? (
        <div className="row">
          <div className="col-12">
            <Table
              limit="10"
              headData={tableHead}
              renderHead={renderHead}
              bodyData={users}
              renderBody={(item, index) => renderBody(item, index)}
            />
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default Members;
