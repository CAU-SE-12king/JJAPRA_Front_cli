import axios from 'axios';
import { LocalStorage } from 'node-localstorage';
import { firstpage } from './firstpage.js';

const localStorage = new LocalStorage('./scratch');

export async function fetchprojects() {
    const token = localStorage.getItem('TOKEN');

    try {
        const response = await axios.get('https://jjapra.r-e.kr/projects', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 200) {
            return response.data;
        } else {
            console.error(`Unexpected status code: ${response.status}`);
        }
    } catch (error) {
        if (error.response) {
            console.error('Error response:', error.response);
            if (error.response.status === 401) {
                console.log("인증에 실패했습니다. 다시 로그인 해주세요.");
                firstpage();
            } else if (error.response.status === 500) {
                console.log("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
            } else {
                console.error(`An error occurred: ${error.response.status} ${error.response.statusText}`);
            }
        } else {
            console.error('An error occurred:', error.message);
        }
    }
    return [];
}
