import inquirer from 'inquirer';
import { LocalStorage } from 'node-localstorage';
import { menuinproject } from './menuinproject.js';
import { showissuedetails } from './showissuedetails.js';
import { createissuecomment } from './createissuecomment.js';
import {assignUsertoIssue} from './assignUsertoIssue.js';
import {changeissuestate} from './changeissuestate.js'
import { deleteissue } from './deleteissue.js';

const localStorage = new LocalStorage('./scratch');
export async function menuinissue() {
    const userRole = localStorage.getItem('role');
    console.log('Stored role:', userRole);
    const isAdminOrPl = (userRole === 'ADMIN') || (userRole === 'PL');
    const questionForIssuePage = [
        {
            type: 'list',
            name: 'issueAction',
            message: 'What do you want to do?',
            choices: isAdminOrPl
            ? ['이슈 코멘트 추가', '이슈 상태 변경','이슈에 개발자 할당', '이슈 정보 확인', '이슈 삭제', '뒤로 가기']
            : ['이슈 코멘트 추가', '이슈 상태 변경', '이슈 정보 확인', '이슈 삭제', '뒤로 가기'],
        }
    ];
    const issuepageAnswer = await inquirer.prompt(questionForIssuePage);

    switch (issuepageAnswer.issueAction) {
        case '이슈 코멘트 추가':
            await createissuecomment();
            break;
        case '이슈 상태 변경':
            console.log('이슈 상태 변경 페이지로 넘어갑니다.');
            await changeissuestate();
            break;
        case '이슈에 개발자 할당':
            console.log('개발자 할당 페이지로 넘어갑니다.')
            await assignUsertoIssue();
            break;
        case '이슈 정보 확인':
            console.log('이슈 정보를 확인합니다.');
            await showissuedetails();
            break;
        case '이슈 삭제':
            console.log('이슈를 삭제합니다.');
            await deleteissue();
            break;
        case '뒤로 가기':
            console.log('프로젝트 메뉴 페이지로 돌아갑니다.');
            await menuinproject();
            break;
    }
}
