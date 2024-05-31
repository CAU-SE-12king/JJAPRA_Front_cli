import inquirer from 'inquirer';
import { makeprojectpage } from './makeprojectpage.js';
import { chooseproject } from './chooseproject.js';
import { showuserinfo } from './showuserinfo.js';
import { firstpage } from './firstpage.js';
import {showmyissue} from './showmyissue.js'

export async function projectpage() {
    const questionForProjectpage = [
        {
            type: 'list',
            name: 'projectAction',
            message: 'What do you want to do?',
            choices: ['프로젝트 생성', '프로젝트 입장', '유저 정보 확인', '나의 이슈 확인', 'logout'], 
        }
    ];
    const projectpageAnswer = await inquirer.prompt(questionForProjectpage);

    switch (projectpageAnswer.projectAction) {
        case '프로젝트 생성':
            console.log('프로젝트 생성 페이지로 넘어갑니다.');
            await makeprojectpage();
            break;
        case '프로젝트 입장':
            console.log('프로젝트 목록을 불러옵니다.');
            await chooseproject();
            break;
        case '유저 정보 확인':
            console.log('유저 정보를 확인합니다.');
            await showuserinfo();
            break;
        case '나의 이슈 확인':
            console.log('나의 이슈를 확인합니다');
            await showmyissue();
            break;
        case 'logout':
            console.log('초기 화면으로 이동합니다.');
            await firstpage();
            break;
    }
}
