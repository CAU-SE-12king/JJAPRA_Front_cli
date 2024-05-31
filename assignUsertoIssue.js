import axios from 'axios';
import inquirer from 'inquirer';
import { LocalStorage } from 'node-localstorage';
import { menuinissue } from './menuinissue.js';

const localStorage = new LocalStorage('./scratch');

export async function assignUsertoIssue() {
    const issueId = localStorage.getItem('currentIssueId');
    const projectId = localStorage.getItem('currentProjectId');
    if (!issueId) {
        console.log("현재 선택된 이슈가 없습니다.");
        return;
    }

    const token = localStorage.getItem('TOKEN');
    const projectUrl = `https://jjapra.r-e.kr/projects/${projectId}`;
    const assignUrl = `https://jjapra.r-e.kr/issues/${issueId}/members`;

    try {
        const projectResponse = await axios.get(projectUrl, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (projectResponse.status === 200) {
            const members = projectResponse.data.members;
            const devMembers = members.filter(member => member.value === 'DEV');

            if (devMembers.length === 0) {
                console.log('이 프로젝트에는 DEV 역할을 가진 사용자가 없습니다.');
                return;
            }

            const devChoices = devMembers.map(dev => ({
                name: dev.key,
                value: dev.key
            }));

            const questionForAssignee = [
                {
                    type: 'list',
                    name: 'assignee',
                    message: '이슈에 할당할 사용자를 선택하세요:',
                    choices: devChoices
                }
            ];

            const { assignee } = await inquirer.prompt(questionForAssignee);

            const payload = {
                id: assignee,
                role: 'ASSIGNEE'
            };

            console.log('Payload:', payload); 

            try {
                const assignResponse = await axios.post(assignUrl, payload, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (assignResponse.status === 201) {
                    console.log('사용자가 성공적으로 이슈에 할당되었습니다.');

                    // 이슈의 상태를 'ASSIGNED'로 변경하는 코드 추가
                    const changeStatePayload = { status: 'ASSIGNED' };
                    const changeStateUrl = `https://jjapra.r-e.kr/issues/${issueId}`;

                    try {
                        const changeStateResponse = await axios.patch(changeStateUrl, changeStatePayload, {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        });

                        if (changeStateResponse.status === 200) {
                            console.log('이슈 상태가 ASSIGNED로 성공적으로 변경되었습니다.');
                        } else {
                            console.error('이슈 상태 변경에 실패했습니다.');
                            console.error(`응답 코드: ${changeStateResponse.status}`);
                            console.error('응답 데이터:', changeStateResponse.data);
                        }
                    } catch (error) {
                        if (error.response) {
                            console.error(`오류가 발생했습니다: ${error.response.status} ${error.response.statusText}`);
                            console.error('응답 데이터:', error.response.data);
                        } else {
                            console.error('네트워크 오류가 발생했습니다:', error.message);
                        }
                    }
                } else {
                    console.error('사용자 할당에 실패했습니다.');
                    console.error(`응답 코드: ${assignResponse.status}`);
                    console.error('응답 데이터:', assignResponse.data);
                }
            } catch (error) {
                if (error.response) {
                    console.error(`오류가 발생했습니다: ${error.response.status} ${error.response.statusText}`);
                    console.error('응답 데이터:', error.response.data);
                } else {
                    console.error('네트워크 오류가 발생했습니다:', error.message);
                }
            }
        } else {
            console.error('프로젝트 정보를 불러오는 데 실패했습니다.');
            console.error(`응답 코드: ${projectResponse.status}`);
            console.error('응답 데이터:', projectResponse.data);
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
