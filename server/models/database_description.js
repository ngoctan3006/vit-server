const vit = {
    _id: '',
    full_vietnamese_name:
        'Đội Sinh viên Tình nguyện Viện Công nghệ Thông tin và Truyền thông - Trường Công nghệ thông tin và Truyền thông - ĐHBKHN',
    full_english_name: 'Volunteer of Information Technology',
    shorthand_name: 'VIT',
    celebration_day: new Date('<2009-09-21>'),
    facebook: 'https://www.facebook.com/doitinhnguyen.soict',
    email: 'tinhnguyen.ict@gmail.com',
    reference:
        'https://drive.google.com/drive/folders/1vgVtfwr17bbiNlPCtSCUrjY7orL-HoJl?usp=sharing', // Link Nội quy, cương lĩnh
    description: '',
    captain: memberId,
    created_at: new Date(''),
    updated_at: new Date(''),
    deleted_at: new Date('')
};

const user = {
    _id: '',
    username: '',
    password: '',
    position: positionId,
    created_at: new Date(''),
    updated_at: new Date(''),
    deleted_at: new Date('')
};

const position = {
    _id: '',
    name: '',
    description: '',
    created_at: new Date(''),
    updated_at: new Date(''),
    deleted_at: new Date('')
};

const member = {
    _id: '',
    first_name: '',
    full_name: '',
    nickname: '',
    gender: 0 / 1 / 2,
    birthday: '',
    home_town: '',
    address: '',
    school: '',
    student_id: '',
    phone_number: '',
    email: '',
    facebook: '',
    created_at: new Date(''),
    updated_at: new Date(''),
    deleted_at: new Date('')
};

const department = {
    _id: '',
    name: '',
    description: '',
    chief: memberId,
    vice: [memberId],
    members: [memberId],
    reference: '',
    created_at: new Date(''),
    updated_at: new Date(''),
    deleted_at: new Date('')
};

const club = {
    _id: '',
    name: '',
    department: departmentId,
    description: '',
    chief: memberId,
    vice: [memberId],
    members: [memberId],
    reference: '',
    created_at: new Date(''),
    updated_at: new Date(''),
    deleted_at: new Date('')
};

const group = {
    _id: '',
    name: '',
    description: '',
    chief: memberId,
    vice: [memberId],
    member: [memberId],
    reference: '',
    created_at: new Date(''),
    updated_at: new Date(''),
    deleted_at: new Date('')
};

const event = {
    _id: '',
    name: '',
    description: '',
    chief: memberId,
    reference: '',
    created_at: new Date(''),
    updated_at: new Date(''),
    deleted_at: new Date('')
};

const activity = {
    _id: '',
    name: '',
    event: eventId,
    description: '',
    chief: memberId,
    reference: '',
    created_at: new Date(''),
    updated_at: new Date(''),
    deleted_at: new Date('')
};
