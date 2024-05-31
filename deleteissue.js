import axios from 'axios';
import { LocalStorage } from 'node-localstorage';
import { menuinproject } from './menuinproject.js';

const localStorage = new LocalStorage('./scratch');

export async function deleteissue() {
    const issueId = localStorage.getItem('currentIssueId');
    if (!issueId) {
        console.log("현재 선택된 이슈가 없습니다.");
        return;
    }

    const url = `https://jjapra.r-e.kr/issues/${issueId}`;
    const token = localStorage.getItem('TOKEN');

    console.log(`Deleting issue with ID: ${issueId}`);

    try {
        const response = await axios.delete(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 204) {
            console.log('이슈가 성공적으로 삭제되었습니다.');
            localStorage.removeItem('currentIssueId');
        } else {
            console.error('이슈 삭제에 실패했습니다.');
            console.error(`응답 코드: ${response.status}`);
            console.error('응답 데이터:', response.data);
        }
    } catch (error) {
        if (error.response) {
            console.error(`오류가 발생했습니다: ${error.response.status} ${error.response.statusText}`);
            console.error('응답 데이터:', error.response.data);
        } else {
            console.error('네트워크 오류가 발생했습니다:', error.message);
        }
    }

    menuinproject();
}
