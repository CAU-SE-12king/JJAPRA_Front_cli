import axios from 'axios';
import { LocalStorage } from 'node-localstorage';

const localStorage = new LocalStorage('./scratch');

export async function deleteproject() {
    const projectId = localStorage.getItem('currentProjectId');
    if (!projectId) {
        console.log("현재 선택된 프로젝트가 없습니다.");
        return;
    }

    try {
        const response = await axios.delete(`https://jjapra.r-e.kr/projects/${projectId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('TOKEN')}`
            }
        });

        if (response.status === 200) {
            console.log('프로젝트가 성공적으로 삭제되었습니다.');
            localStorage.removeItem('currentProjectId');
            localStorage.removeItem('currentProjectTitle');
        } else {
            console.error('프로젝트 삭제에 실패했습니다.');
        }
    } catch (error) {
        if (error.response) {
            if (error.response.status === 404) {
                console.log('존재하지 않는 프로젝트 ID입니다.');
            } else {
                console.error(`오류가 발생했습니다: ${error.response.status} ${error.response.statusText}`);
            }
        } else {
            console.error('네트워크 오류가 발생했습니다:', error.message);
        }
    }
}
