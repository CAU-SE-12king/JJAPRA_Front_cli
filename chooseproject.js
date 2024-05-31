import inquirer from 'inquirer';
import { fetchprojects } from './fetchprojects.js';
import { menuinproject } from './menuinproject.js';
import { LocalStorage } from 'node-localstorage';

const localStorage = new LocalStorage('./scratch');

export async function chooseproject() {
    const projects = await fetchprojects();
    if (projects.length === 0) {
        console.log('선택 가능한 프로젝트가 없습니다.');
        projectpage();
        return;
    }

    const choices = projects.map(project => ({
        name: `${project.project.title} (ID: ${project.project.id})`,
        value: project.project.id
    }));

    const question = [{
        type: 'list',
        name: 'projectId',
        message: '입장할 프로젝트를 선택하세요:',
        choices: choices
    }];

    const answer = await inquirer.prompt(question);
    const selectedProject = projects.find(project => project.project.id === answer.projectId);

    localStorage.setItem('currentProjectId', selectedProject.project.id);
    const storedProjectId = localStorage.getItem('currentProjectId');
    console.log(`저장된 프로젝트 ID: ${storedProjectId}`);

    menuinproject();
}
