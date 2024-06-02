import axios from 'axios';
import inquirer from 'inquirer';
import { LocalStorage } from 'node-localstorage';
import { menuinproject } from './menuinproject.js';

const localStorage = new LocalStorage('./scratch');

export async function browseissue() {
    const projectId = localStorage.getItem('currentProjectId');
    const token = localStorage.getItem('TOKEN');

    if (!projectId || !token) {
        console.log('프로젝트 ID 또는 토큰이 없습니다.');
        return;
    }

    async function fetchProjectData(projectId, token) {
        const url = `https://jjapra.r-e.kr/projects/${projectId}`;
        try {
            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                return response.data;
            } else {
                console.error('프로젝트 정보를 가져오는 데 실패했습니다.');
                return null;
            }
        } catch (error) {
            if (error.response) {
                console.error(`오류가 발생했습니다: ${error.response.status} ${error.response.statusText}`);
                console.error('응답 데이터:', error.response.data);
            } else {
                console.error('네트워크 오류가 발생했습니다:', error.message);
            }
            return null;
        }
    }

    async function fetchIssues(projectId, token) {
        const url = `https://jjapra.r-e.kr/projects/${projectId}/issues`;
        try {
            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                return response.data;
            } else {
                console.error('이슈 정보를 가져오는 데 실패했습니다.');
                return [];
            }
        } catch (error) {
            if (error.response) {
                console.error(`오류가 발생했습니다: ${error.response.status} ${error.response.statusText}`);
                console.error('응답 데이터:', error.response.data);
            } else {
                console.error('네트워크 오류가 발생했습니다:', error.message);
            }
            return [];
        }
    }

    const fieldQuestion = [
        {
            type: 'list',
            name: 'field',
            message: '어떤 필드로 검색하시겠습니까?',
            choices: ['writer', 'assignee', 'status']
        }
    ];
    const { field } = await inquirer.prompt(fieldQuestion);

    let value;
    if (field === 'writer' || field === 'assignee') {
        const projectData = await fetchProjectData(projectId, token);
        if (!projectData) return;

        let choices;
        if (field === 'writer') {
            choices = projectData.members.map(member => ({
                name: member.key,
                value: member.key
            }));
        } else if (field === 'assignee') {
            choices = projectData.members
                .filter(member => member.value === 'DEV')
                .map(member => ({
                    name: member.key,
                    value: member.key
                }));
        }

        const valueQuestion = [
            {
                type: 'list',
                name: 'value',
                message: `검색할 ${field}를 선택하세요:`,
                choices: choices
            }
        ];
        const answer = await inquirer.prompt(valueQuestion);
        value = answer.value;
    } else if (field === 'status') {
        const statusChoices = ['NEW', 'ASSIGNED', 'FIXED', 'RESOLVED', 'CLOSED'];
        const statusQuestion = [
            {
                type: 'list',
                name: 'value',
                message: '검색할 status를 선택하세요:',
                choices: statusChoices
            }
        ];
        const answer = await inquirer.prompt(statusQuestion);
        value = answer.value;
    }

    const issues = await fetchIssues(projectId, token);
    let filteredIssues;
    if(field === 'writer'){
        filteredIssues = issues.filter(issueData => issueData.issue[field] === value);
    }
    else{
        filteredIssues = issues.filter(issueData => issueData[field] === value);
    }

    if (filteredIssues.length > 0) {
        console.log(`검색 결과 (필드: ${field}, 값: ${value}):`);
        filteredIssues.forEach(issueData => {
            console.log(`Issue ID: ${issueData.issue.issueId}, Title: ${issueData.issue.title}`);
        });
    } else {
        console.log(`검색 결과가 없습니다 (필드: ${field}, 값: ${value}).`);
    }

    await menuinproject();
}
