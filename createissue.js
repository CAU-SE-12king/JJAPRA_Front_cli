import axios from 'axios';
import inquirer from 'inquirer';
import { LocalStorage } from 'node-localstorage';
import { menuinproject } from './menuinproject.js';

const localStorage = new LocalStorage('./scratch');

export async function createissue() {
    const questionIssueInfo = [
        {
            type: 'input',
            name: 'issueName',
            message: '이슈 이름을 입력하세요:',
        },
        {
            type: 'input',
            name: 'issueComment',
            message: '이슈에 대한 설명을 입력하세요:',
        },
        {
            type: 'list',
            name: 'issuePriority',
            message: '이슈의 우선순위를 정하세요:',
            choices: ['BLOCKER', 'CRITICAL', 'MAJOR', 'MINOR', 'TRIVIAL'],
        }
    ];
    const answersIssueInfo = await inquirer.prompt(questionIssueInfo);

    const priorityMap = {
        'BLOCKER': 0,
        'CRITICAL': 1,
        'MAJOR': 2,
        'MINOR': 3,
        'TRIVIAL': 4
    };

    const projectId = localStorage.getItem('currentProjectId');
    if (!projectId) {
        console.log("현재 선택된 프로젝트가 없습니다.");
        return;
    }

    const payload = {
        title: answersIssueInfo.issueName,
        description: answersIssueInfo.issueComment,
        priority: priorityMap[answersIssueInfo.issuePriority]
    };

    try {
        const response = await axios.post(`https://jjapra.r-e.kr/projects/${projectId}/issues`, payload, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('TOKEN')}`
            }
        });

        if (response.status === 201) {
            console.log('이슈가 성공적으로 추가되었습니다.');
            console.log('이슈 정보:', response.data);
        } else {
            console.error('이슈 추가에 실패했습니다.');
        }
    } catch (error) {
        if (error.response) {
            if (error.response.status === 400) {
                console.log('잘못된 요청입니다. 이미 존재하는 이슈 제목일 수 있습니다.');
            } else {
                console.error(`오류가 발생했습니다: ${error.response.status} ${error.response.statusText}`);
            }
        } else {
            console.error('네트워크 오류가 발생했습니다:', error.message);
        }
    }

    menuinproject();
}
