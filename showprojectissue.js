import axios from 'axios';
import inquirer from 'inquirer';
import { LocalStorage } from 'node-localstorage';
import { menuinproject } from './menuinproject.js';
import { menuinissue } from './menuinissue.js';

const localStorage = new LocalStorage('./scratch'); // LocalStorage 인스턴스 생성

export async function showprojectissue() {
    const projectId = localStorage.getItem('currentProjectId');
    if (!projectId) {
        console.log("현재 선택된 프로젝트가 없습니다.");
        return;
    }

    try {
        const response = await axios.get(`https://jjapra.r-e.kr/projects/${projectId}/issues`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('TOKEN')}`
            }
        });

        if (response.status === 200) {
            const issues = response.data;
            if (issues.length === 0) {
                console.log('이 프로젝트에는 등록된 이슈가 없습니다.');
            } else {
                const choices = issues.map(issue => ({
                    name: `${issue.issue.title} (ID: ${issue.issue.issueId})`,
                    value: issue.issue.issueId
                }));

                const question = [{
                    type: 'list',
                    name: 'issueId',
                    message: '입장할 이슈를 선택하세요:',
                    choices: choices
                }];

                const answer = await inquirer.prompt(question);
                localStorage.setItem('currentIssueId', answer.issueId);

                console.log(`저장된 이슈 ID: ${answer.issueId}`);
            }
        } else {
            console.error('이슈 조회에 실패했습니다.');
        }
    } catch (error) {
        if (error.response) {
            if (error.response.status === 404) {
                console.log('존재하지 않는 프로젝트 ID입니다.');
            } else {
                console.error(`오류가 발생했습니다: ${error.response.status} ${error.response.statusText}`);
            }
        } 
    }
    await menuinissue(); // 수정: await 추가
}
