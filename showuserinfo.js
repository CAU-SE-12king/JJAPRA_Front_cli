import { fetchUsers } from './fetchUsers.js';
import { projectpage } from './projectpage.js';
import { LocalStorage } from 'node-localstorage';

const localStorage = new LocalStorage('./scratch');

export async function showuserinfo() {
    const userRole = localStorage.getItem('role');

    if (userRole === 'ADMIN') {
        const users = await fetchUsers();

        if (users.length === 0) {
            console.log('등록된 사용자가 없습니다.');
            return;
        }

        console.log('등록된 사용자 정보:');
        users.forEach(user => {
            console.log(`ID: ${user.id}`);
            console.log(`이름: ${user.name}`);
            console.log(`이메일: ${user.email}`);
            console.log(`전화번호: ${user.phone_num}`);
            console.log(`역할: ${user.role}`);
            console.log('---------------------------');
        });
    } else {
        const user = await fetchUsers();

        if (!user) {
            console.log('사용자 정보를 가져올 수 없습니다.');
            return;
        }

        console.log('사용자 정보:');
        console.log(`ID: ${user.id}`);
        console.log(`이름: ${user.name}`);
        console.log(`이메일: ${user.email}`);
        console.log(`전화번호: ${user.phone_num}`);
        console.log(`역할: ${user.role}`);
        console.log('---------------------------');
    }

    await projectpage();
}
