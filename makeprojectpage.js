import inquirer from 'inquirer';
import { createproject } from './createproject.js';
import { projectpage } from './projectpage.js';

export async function makeprojectpage() {
    const questionForMakeProject = [
        {
            type: 'input',
            name: 'projectName',
            message: '프로젝트 이름을 입력하세요:'
        },
        {
            type: 'input',
            name: 'projectComment',
            message: '프로젝트 설명을 입력하세요:'
        }
    ];
    const answers = await inquirer.prompt(questionForMakeProject);
    
    await createproject(answers.projectName, answers.projectComment);
    
    projectpage();
}
