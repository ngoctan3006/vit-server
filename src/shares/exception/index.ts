export const httpErrors = {
  // common
  QUERY_INVALID: {
    message: 'Query params không hợp lệ',
    code: 'COMMON_0001',
  },

  // user
  USER_NOT_FOUND: {
    message: 'Tài khoản không tồn tại',
    code: 'USER_0001',
  },
  EMAIL_EXISTED: {
    message: 'Địa chỉ email đã tồn tại',
    code: 'USER_0002',
  },
  PHONE_EXISTED: {
    message: 'Số điện thoại đã tồn tại',
    code: 'USER_0003',
  },
  USERNAME_EXISTED: {
    message: 'Tên đăng nhập đã tồn tại',
    code: 'USER_0004',
  },
  EMAIL_PHONE_NOT_MATCH: {
    message: 'Tên đăng nhập, địa chỉ email hoặc số điện thoại chưa chính xác',
    code: 'USER_0005',
  },
  BLOCKED_USER: {
    message: 'Tài khoản của bạn đã bị khoá',
    code: 'USER_0006',
  },
  INACTIVE_USER: {
    message: 'Tài khoản của bạn chưa kích hoạt, hãy đổi mật khẩu để kích hoạt',
    code: 'USER_0007',
  },
  TOKEN_EXPIRED: {
    message: 'Token đã hết hạn',
    code: 'USER_0008',
  },
  TOKEN_INVALID: {
    message: 'Token không hợp lệ',
    code: 'USER_0009',
  },
  REFRESH_TOKEN_EXPIRED: {
    message: 'Refresh token đã hết hạn',
    code: 'USER_0010',
  },
  REFRESH_TOKEN_INVALID: {
    message: 'Refresh token không hợp lệ',
    code: 'USER_0011',
  },
  FORBIDDEN: {
    message: 'Bạn không có quyền truy cập vào tài nguyên này',
    code: 'USER_0012',
  },
  LOGIN_WRONG: {
    message: 'Tên đăng nhập hoặc mật khẩu chưa chính xác',
    code: 'USER_0013',
  },
  PASSWORD_NOT_MATCH: {
    message: 'Mật khẩu chưa khớp',
    code: 'USER_0014',
  },
  PASSWORD_WRONG: {
    message: 'Mật khẩu chưa chính xác',
    code: 'USER_0015',
  },
  ACTIVE_USER: {
    message: 'Tài khoản đã được kích hoạt',
    code: 'USER_0016',
  },

  // activity
  ACTIVITY_NOT_FOUND: {
    message: 'Hoạt động này không tồn tại',
    code: 'ACTIVITY_0001',
  },
  ACTIVITY_REGISTERED: {
    message: 'Bạn đã đăng ký hoạt động này rồi',
    code: 'ACTIVITY_0002',
  },
  ACTIVITY_NOT_REGISTERED: {
    message: 'Bạn chưa đăng ký hoạt động này',
    code: 'ACTIVITY_0003',
  },
  ACTIVITY_USER_NOT_REGISTERED: {
    message: 'Tài khoản người dùng chưa đăng ký hoạt động này',
    code: 'ACTIVITY_0004',
  },
  ACTIVITY_ACCEPTED: {
    message: 'Tài khoản người dùng đã được chấp nhận vào hoạt động này',
    code: 'ACTIVITY_0005',
  },

  // event
  EVENT_NOT_FOUND: {
    message: 'Sự kiện này không tồn tại',
    code: 'EVENT_0001',
  },
  EVENT_REGISTERED: {
    message: 'Bạn đã đăng ký sự kiện này rồi',
    code: 'EVENT_0002',
  },
  EVENT_NOT_REGISTERED: {
    message: 'Bạn chưa đăng ký sự kiện này',
    code: 'EVENT_0003',
  },
  EVENT_ACCEPTED: {
    message: 'Bạn đã được chấp nhận vào sự kiện này',
    code: 'EVENT_0004',
  },
  EVENT_USER_NOT_REGISTERED: {
    message: 'Tài khoản người dùng chưa đăng ký sự kiện này',
    code: 'EVENT_0003',
  },
  EVENT_USER_ACCEPTED: {
    message: 'Tài khoản người dùng đã được chấp nhận vào sự kiện này',
    code: 'EVENT_0004',
  },

  // club
  CLUB_NOT_FOUND: {
    message: 'Câu lạc bộ này không tồn tại',
    code: 'CLUB_0001',
  },

  // department
  DEPARTMENT_NOT_FOUND: {
    message: 'Mảng này không tồn tại',
    code: 'DEPARTMENT_0001',
  },

  // group
  GROUP_NOT_FOUND: {
    message: 'Nhóm này không tồn tại',
    code: 'GROUP_0001',
  },
};
