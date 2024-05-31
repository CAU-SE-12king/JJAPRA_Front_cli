import axios from 'axios';
import inquirer from 'inquirer';
import { LocalStorage } from 'node-localstorage';
import { firstpage } from './firstpage.js';
import { projectpage } from './projectpage.js';

const localStorage = new LocalStorage('./scratch');

export async function login() {
    console.log('로그인 페이지입니다.');

    const questionIdAndPassword = [
        {
            type: 'input',
            name: 'id',
            message: '아이디를 입력하세요:',
        },
        {
            type: 'password',
            name: 'password',
            message: '비밀번호를 입력하세요:',
        }
    ];

    const answers = await inquirer.prompt(questionIdAndPassword);

    const payload = {
        id: answers.id,
        password: answers.password
    };

    try {
        const response = await axios.post('https://jjapra.r-e.kr/login', payload);

        if (response.status === 200) {
            const { id, role } = response.data.member;
            const token = response.data.token;
            localStorage.setItem('userid', id);
            localStorage.setItem('role', role);
            localStorage.setItem('TOKEN', token);
            projectpage(); 
        } else {
            console.log("아이디 또는 비밀번호가 일치하지 않습니다.");
            firstpage();
        }
    } catch (error) {
        if (error.response) {
            if (error.response.status === 400) {
                if (error.response.data === "Invalid id") {
                    console.log("존재하지 않는 아이디입니다.");
                    firstpage();
                } else if (error.response.data === "Invalid password") {
                    console.log("비밀번호가 일치하지 않습니다.");
                    firstpage();
                } else {
                    console.log("잘못된 요청입니다.");
                }
                console.log("redirect:/");
            } else {
                console.error('An error occurred:', error.message);
            }
        } else {
            console.error('An error occurred:', error.message);
        }
    }
}
