var valid_students = [{
  student_number: '10860025201306300001',
  
  username: 'aaa',
  password: '123456',

  grade_id: 1,
  state: 0,

  name: 'AAA',
  bud_name: 'B111',
  gender: true,

  birthday: Date.now() - 365 * 1000 * 3600 * 24 * 20,

  qq: '1111',
  email: '1111@qq.com',
  phone: '13951999999'

}, {
  student_number: '10860025201306300002',
  username: 'bbb',
  password: '123456',

  grade_id: 2,
  state: 0,

  name: 'DDD',
  bud_name: 'E111',
  gender: true,

  birthday: Date.now() - 365 * 1000 * 3600 * 24 * 19,

  qq: '2222',
  email: '2222@qq.com',
  phone: '13951999998'
}];


var invalid_students = [{}];

exports.valid_students = valid_students;
exports.invalid_students = invalid_students;
