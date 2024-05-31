import axios from 'axios';
import { LocalStorage } from 'node-localstorage';

const localStorage = new LocalStorage('./scratch');

export async function createproject(projectName, projectComment) {
    const token = localStorage.getItem('TOKEN');

    const payload = {
        title: projectName,
        description: projectComment
    };

    try {
        const response = await axios.post('https://jjapra.r-e.kr/projects', payload, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 201) {
            console.log('프로젝트가 성공적으로 생성되었습니다.');
            console.log(`프로젝트 ID: ${response.data.id}, 제목: ${response.data.title}, 설명: ${response.data.description}`);
        } else {
            console.error('프로젝트 생성에 실패했습니다.');
        }
    } catch (error) {
        if (error.response) {
            if (error.response.status === 400) {
                console.log('잘못된 요청입니다. 프로젝트의 제목과 설명을 확인해주세요.');
            } else if (error.response.status === 401) {
                console.log('권한이 없습니다. ADMIN 역할의 사용자만 프로젝트를 생성할 수 있습니다.');
            } else {
                console.error(`오류가 발생했습니다: ${error.response.status} ${error.response.statusText}`);
            }
        } else {
            console.error('네트워크 오류가 발생했습니다:', error.message);
        }
    }
}
