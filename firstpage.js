import inquirer from 'inquirer';
import { login } from './login.js';
import { join } from './join.js';

export async function firstpage() {
    const question = [
        {
            type: 'list',
            name: 'action',
            message: 'What do you want to do?',
            choices: ['Log in', '회원가입', 'Exit']
        }
    ];
    const answers = await inquirer.prompt(question);
    
    switch (answers.action) {
        case 'Log in':
            console.log('log in 페이지로 넘어갑니다.');
            login();
            break;
        case '회원가입':
            console.log('회원가입 페이지로 넘어갑니다.');
            join();
            break;
        case 'Exit':
            console.log('프로그램을 종료합니다.')
            break;
    }
}
