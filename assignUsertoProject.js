import axios from 'axios';
import inquirer from 'inquirer';
import { LocalStorage } from 'node-localstorage';
import { fetchUsers } from './fetchUsers.js';
import { projectpage } from './projectpage.js';
import { menuinproject } from './menuinproject.js';

const localStorage = new LocalStorage('./scratch');

export async function assignUsertoProject() {
    const projectId = localStorage.getItem('currentProjectId');
    if (!projectId) {
        console.log("현재 선택된 프로젝트가 없습니다.");
        return;
    }

    const users = await fetchUsers();
    if (users.length === 0) {
        console.log('선택 가능한 사용자가 없습니다.');
        return;
    }

    const userChoices = users.map(user => ({
        name: `${user.name} (ID: ${user.id})`,
        value: user.id
    }));

    const roleChoices = ['DEV', 'TESTER', 'PL'];

    const questions = [
        {
            type: 'list',
            name: 'userId',
            message: '사용자를 선택하세요:',
            choices: userChoices
        },
        {
            type: 'list',
            name: 'role',
            message: '사용자의 역할을 선택하세요:',
            choices: roleChoices
        }
    ];

    const answers = await inquirer.prompt(questions);

    const payload = {
        id: answers.userId,
        role: answers.role
    };

    try {
        const response = await axios.post(`https://jjapra.r-e.kr/projects/${projectId}/members`, payload, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('TOKEN')}`
            }
        });

        if (response.status === 201) {
            console.log('사용자가 프로젝트에 성공적으로 할당되었습니다.');
            console.log(`프로젝트 ID: ${response.data.project.id}`);
            console.log(`사용자 ID: ${response.data.member.id}`);
            console.log(`역할: ${response.data.role}`);
            menuinproject();
        } else {
            console.error('사용자 할당에 실패했습니다.');
        }
    } catch (error) {
        if (error.response) {
            if (error.response.status === 404) {
                console.log('존재하지 않는 프로젝트 ID 또는 사용자 ID입니다.');
            } else {
                console.error(`오류가 발생했습니다: ${error.response.status} ${error.response.statusText}`);
            }
        } else {
            console.error('네트워크 오류가 발생했습니다:', error.message);
        }
    }
}
