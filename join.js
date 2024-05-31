import axios from 'axios';
import inquirer from 'inquirer';
import { firstpage } from './firstpage.js';

export async function join() {
    console.log('회원가입 페이지입니다.');
    
    const questionUserInfo = [
        {
            type: 'input',
            name: 'userName',
            message: '이름을 입력하세요:',
        },
        {
            type: 'input',
            name: 'userPhoneNumber',
            message: '전화번호를 입력하세요:',
        },
        {
            type: 'input',
            name: 'userEmail',
            message: '이메일을 입력하세요:',
        }
    ];
    const userInfo = await inquirer.prompt(questionUserInfo);

    const questionIdForJoin = [{ 
        type: 'input',
        name: 'id',
        message: '아이디를 입력하세요:',
    }];
    const id = await inquirer.prompt(questionIdForJoin);

    let password;
    let passwordsMatch = false;
    while (!passwordsMatch) {
        const questionPasswordForJoin = [
            {
                type: 'password',
                name: 'firstPassword',
                message: '비밀번호를 입력하세요:',
            },
            {
                type: 'password', 
                name: 'passwordCheck',
                message: '비밀번호 확인:',
            }
        ];
        const answerPassword = await inquirer.prompt(questionPasswordForJoin);
        if (answerPassword.firstPassword !== answerPassword.passwordCheck) {
            console.log('비밀번호가 일치하지 않습니다. 다시 입력해 주세요.');
        } else {
            passwordsMatch = true;
            password = answerPassword.firstPassword;
        }
    }
    
    const payload = {
        id: id.id,
        password: password,
        name: userInfo.userName,
        email: userInfo.userEmail,
        phone_num: userInfo.userPhoneNumber
    };

    try {
        const response = await axios.post('https://jjapra.r-e.kr/join', payload);
        if (response.status === 200 && response.data === "success") {
            console.log('회원 가입이 완료되었습니다.');
            firstpage();
        } else {
            console.log('회원 가입에 실패했습니다.');
        }
    } catch (error) {
        if (error.response && error.response.status === 400 && error.response.data === "already exists id") {
            console.log('이미 존재하는 아이디입니다.');
        } else {
            console.error('회원 가입 중 오류가 발생했습니다:', error.message);
        }
    }
}
