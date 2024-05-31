import axios from 'axios';
import { LocalStorage } from 'node-localstorage';
import { projectpage } from './projectpage.js';

const localStorage = new LocalStorage('./scratch');

export async function showmyissue() {
    const token = localStorage.getItem('TOKEN');
    const url = 'https://jjapra.r-e.kr/issues';

    console.log('Fetching issues for the current user...');

    try {
        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 200) {
            const issues = response.data;
            if (issues.length === 0) {
                console.log('등록된 이슈가 없습니다.');
            } else {
                console.log('나의 이슈 목록:');
                issues.forEach(issue => {
                    console.log(`이슈 ID: ${issue.issueId}`);
                    console.log(`프로젝트 ID: ${issue.projectId}`);
                    console.log(`제목: ${issue.title}`);
                    console.log(`설명: ${issue.description}`);
                    console.log(`작성자: ${issue.writer}`);
                    console.log(`생성일: ${issue.createdAt}`);
                    console.log(`우선순위: ${issue.priority}`);
                    console.log(`상태: ${issue.status}`);
                    console.log('---------------------------');
                });
            }
        } else {
            console.error('이슈 조회에 실패했습니다.');
        }
    } catch (error) {
        if (error.response) {
            if (error.response.status === 404) {
                console.log('이슈를 찾을 수 없습니다.');
            } else {
                console.error(`오류가 발생했습니다: ${error.response.status} ${error.response.statusText}`);
                console.error('응답 데이터:', error.response.data);
            }
        } else {
            console.error('네트워크 오류가 발생했습니다:', error.message);
        }
    }

    projectpage();
}
