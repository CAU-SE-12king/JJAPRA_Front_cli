import axios from 'axios';
import { LocalStorage } from 'node-localstorage';
import { menuinproject } from './menuinproject.js';

const localStorage = new LocalStorage('./scratch');

export async function showprojectinfo() {
    const projectId = localStorage.getItem('currentProjectId');
    if (!projectId) {
        console.log("현재 선택된 프로젝트가 없습니다.");
        return;
    }

    try {
        const response = await axios.get(`https://jjapra.r-e.kr/projects/${projectId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('TOKEN')}`
            }
        });

        if (response.status === 200) {
            console.log('프로젝트 정보:');
            console.log(`ID: ${response.data.project.id}`);
            console.log(`제목: ${response.data.project.title}`);
            console.log(`설명: ${response.data.project.description}`);
            menuinproject();
        } else {
            console.error('프로젝트 정보를 가져오는 데 실패했습니다.');
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
