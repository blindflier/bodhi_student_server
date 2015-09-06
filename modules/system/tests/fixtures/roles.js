
var roles=[{
  id : 1,
  name : 'super_admin',
  desc : '超级管理员',
  students : [
    {id: 1}
  ],
  permissions : [
    {id: 1},{id: 2}
  ]
},{
  id : 2,
  name : 'system_admin',
  desc : '系统管理员',
  students : [
    {id: 2}
  ],
  permissions: [
    {id: 2},{id:3}
  ]
},{
  id : 3,
  name : 'basicinfo_admin',
  desc : '基本信息管理员',
  students : [
    {id: 3}
  ],
  permissions: [
    {id:2}
  ]
},{
  id : 4,
  name : 'study_admin',
  desc : '修学管理员',
  students : [
    {id: 3}
  ],
  permissions: [
    {id:3}
  ]
}];
module.exports = roles;