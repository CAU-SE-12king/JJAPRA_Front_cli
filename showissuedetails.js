import axios from 'axios';
import { LocalStorage } from 'node-localstorage';
import { menuinissue } from './menuinissue.js';

const localStorage = new LocalStorage('./scratch');

export async function showissuedetails() {
    const issueId = localStorage.getItem('currentIssueId');
    if (!issueId) {
        console.log("현재 선택된 이슈가 없습니다.");
        return;
    }

    const token = localStorage.getItem('TOKEN');
    const url = `https://jjapra.r-e.kr/issues/${issueId}`;

    console.log(`Requesting issue details for issue ID: ${issueId}`);
    try {
        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 200) {
            const issueDetails = response.data;
            console.log('이슈 세부 정보:');
            console.log(`이슈 ID: ${issueDetails.issue.issueId}`);
            console.log(`프로젝트 ID: ${issueDetails.issue.projectId}`);
            console.log(`제목: ${issueDetails.issue.title}`);
            console.log(`설명: ${issueDetails.issue.description}`);
            console.log(`작성자: ${issueDetails.issue.writer}`);
            console.log(`assignee: ${issueDetails.assignee}`);
            console.log(`생성일: ${issueDetails.issue.createdAt}`);
            console.log(`우선순위: ${issueDetails.issue.priority}`);
            console.log(`상태: ${issueDetails.issue.status}`);
            console.log(`댓글 수: ${issueDetails.issue.comments.length}`);
            console.log('-------------------------------');
            console.log(issueDetails.issue.comments)
        } else {
            console.error('이슈 조회에 실패했습니다.');
        }
    } catch (error) {
        if (error.response) {
            if (error.response.status === 404) {
                console.log('존재하지 않는 이슈 ID입니다.');
            } else {
                console.error(`오류가 발생했습니다: ${error.response.status} ${error.response.statusText}`);
                console.error('응답 데이터:', error.response.data);
            }
        } else {
            console.error('네트워크 오류가 발생했습니다:', error.message);
        }
    }

    await menuinissue();
}
