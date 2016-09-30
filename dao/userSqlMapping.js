/**
 * Created by lishengyong on 2016/9/30.
 */

var user = {
    insert : 'insert into user(id, name, age) values(0, ?, ?)',
    udpate: 'update user set name=?, age=? where id=?',
    delete: 'delete from user where id=?',
    queryById: 'select * from user where id=?',
    queryAll: 'select * from user'
}

module.exports = user;
