import inquirer from 'inquirer';
import { LocalStorage } from 'node-localstorage';
import { createissue } from './createissue.js';
import { showprojectissue } from './showprojectissue.js';
import { showprojectinfo } from './showprojectinfo.js';
import { assignUsertoProject } from './assignUsertoProject.js';
import { deleteproject } from './deleteproject.js';
import { projectpage } from './projectpage.js';
import { showissuestatistic } from './showissuestatistic.js';
import { browseissue } from './browseissue.js';
import axios from 'axios';

const localStorage = new LocalStorage('./scratch');

export async function menuinproject() {
    const projectId = localStorage.getItem('currentProjectId');
    const token = localStorage.getItem('TOKEN');
    const userid = localStorage.getItem('userid');

    if (!projectId || !userid || !token) {
        console.log('프로젝트 ID, 사용자 이름 또는 토큰이 없습니다.');
        await menuinproject();
        return;
    }

    try {
        const response = await axios.get(`https://jjapra.r-e.kr/projects/${projectId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 200) {
            const projectData = response.data;
            const member = projectData.members.find(member => member.key === userid);

            if (member) {
                localStorage.setItem('role', member.value);
            } else {
                console.log('프로젝트 내에서 해당 사용자를 찾을 수 없습니다.');
            }
        } else {
            console.error('프로젝트 정보를 불러오는 데 실패했습니다.');
        }
    } catch (error) {
        console.error('프로젝트 정보를 불러오는 도중 오류가 발생했습니다:', error.message);
    }

    const userRole = localStorage.getItem('role');
    console.log('Stored role:', userRole);

    let choices;
    if (userRole === 'ADMIN') {
        choices = ['이슈 등록', '이슈 목록, 입장', '이슈 브라우즈', '이슈 통계 확인', '프로젝트 정보 확인', '프로젝트에 사용자 등록', '뒤로 가기', '프로젝트 삭제'];
    } else if (userRole === 'TESTER') {
        choices = ['이슈 등록', '이슈 목록, 입장', '이슈 브라우즈', '이슈 통계 확인', '프로젝트 정보 확인', '뒤로 가기'];
    } else if (userRole === 'DEV') {
        choices = ['이슈 목록, 입장', '이슈 브라우즈', '이슈 통계 확인', '프로젝트 정보 확인', '뒤로 가기'];
    } else {
        choices = ['이슈 목록, 입장', '이슈 브라우즈', '이슈 통계 확인', '프로젝트 정보 확인', '뒤로 가기'];
    }

    const questionMenuinProject = [
        {
            type: 'list',
            name: 'issueTrackingMenu',
            message: 'What do you want to do?',
            choices: choices
        }
    ];

    const answerissueTrackingMenu = await inquirer.prompt(questionMenuinProject);
    
    switch (answerissueTrackingMenu.issueTrackingMenu) {
        case '이슈 등록':
            console.log('이슈등록 페이지로 넘어갑니다.');
            await createissue();
            break;
        case '이슈 목록, 입장':
            console.log('이슈 리스트를 출력합니다');
            await showprojectissue();
            break;
        case '이슈 브라우즈':
            console.log('이슈 브라우즈를 위한 페이지로 이동합니다.');
            await browseissue();
            break;
        case '이슈 통계 확인':
            console.log('이슈 통계를 확인합니다');
            await showissuestatistic();
            break;
        case '프로젝트 정보 확인':
            console.log('프로젝트 정보를 확인합니다.');
            await showprojectinfo();
            break;
        case '프로젝트에 사용자 등록':
            console.log('프로젝트에 사용자를 등록하는 페이지로 넘어갑니다');
            await assignUsertoProject();
            break;
        case '뒤로 가기':
            console.log('프로젝트 메뉴로 돌아갑니다.');
            await projectpage();
            break;
        case '프로젝트 삭제':
            console.log('프로젝트를 삭제합니다.');
            await deleteproject();
            break;
    }
}
