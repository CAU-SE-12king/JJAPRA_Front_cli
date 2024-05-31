import axios from 'axios';
import inquirer from 'inquirer';
import { LocalStorage } from 'node-localstorage';
import { menuinissue } from './menuinissue.js';
import { showissuedetails } from './showissuedetails.js'; // 필요한 경우에만 사용

const localStorage = new LocalStorage('./scratch');

export async function changeissuestate() {
    const issueId = localStorage.getItem('currentIssueId');
    if (!issueId) {
        console.log("현재 선택된 이슈가 없습니다.");
        return;
    }

    const token = localStorage.getItem('TOKEN');
    const userRole = localStorage.getItem('role');
    const username = localStorage.getItem('username');
    const url = `https://jjapra.r-e.kr/issues/${issueId}`;

    // 이슈의 현재 상태와 assignee 정보를 가져옴
    let currentStatus;
    let currentAssignee;
    try {
        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 200) {
            const issueDetails = response.data;
            currentStatus = issueDetails.issue.status;
            currentAssignee = issueDetails.assignee;
        } else {
            console.error('이슈 조회에 실패했습니다.');
            return;
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
        return;
    }

    const questionForField = [
        {
            type: 'list',
            name: 'field',
            message: '어떤 필드를 변경하시겠습니까?',
            choices: ['title', 'description', 'priority', 'status']
        }
    ];
    const { field } = await inquirer.prompt(questionForField);

    let value;
    if (field === 'status') {
        const haveAuthorityOrNot = (currentStatus === 'ASSIGNED' && currentAssignee === username)||
        (userRole === 'TESTER' && currentStatus === 'FIXED')|| (userRole === 'PL');
        let choices;
        if(haveAuthorityOrNot){
            if (currentStatus === 'ASSIGNED' && currentAssignee === username) {
                choices = ['FIXED'];
            } 
            else if (userRole === 'TESTER' && currentStatus === 'FIXED'){
                choices = ['RESOLVED'];
            }else {
                choices = ['NEW', 'ASSIGNED', 'FIXED', 'RESOLVED', 'CLOSED'];
        }
    

        const questionForStatus = [
            {
                type: 'list',
                name: 'status',
                message: '새로운 status 값을 선택하세요:',
                choices: choices
            }
        ];
        const statusAnswer = await inquirer.prompt(questionForStatus);
        value = statusAnswer.status;
        }
        else{console.log('status를 바꿀 권한이 없습니다.')
            await menuinissue();
            return;
        };
    } else if (field === 'priority') {
        const questionForPriority = [
            {
                type: 'list',
                name: 'priority',
                message: '새로운 priority 값을 선택하세요:',
                choices: ['BLOCKER', 'CRITICAL', 'MAJOR', 'MINOR', 'TRIVIAL']
            }
        ];
        const priorityAnswer = await inquirer.prompt(questionForPriority);
        value = priorityAnswer.priority;
    } else {
        const questionForValue = [
            {
                type: 'input',
                name: 'value',
                message: `새로운 ${field} 값을 입력하세요:`
            }
        ];
        const valueAnswer = await inquirer.prompt(questionForValue);
        value = valueAnswer.value;
    }

    const payload = {
        [field]: value
    };
    console.log(payload);

    console.log(`Changing issue field: ${field}`);
    console.log(`New value: ${value}`);
    try {
        const response = await axios.patch(url, payload, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 200) {
            console.log('이슈 상태가 성공적으로 변경되었습니다.');
        } else {
            console.error('이슈 상태 변경에 실패했습니다.');
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

    await menuinissue();
}
