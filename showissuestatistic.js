import axios from 'axios';
import { LocalStorage } from 'node-localstorage';
import { menuinproject } from './menuinproject.js';

const localStorage = new LocalStorage('./scratch');

export async function showissuestatistic() {
    const projectId = localStorage.getItem('currentProjectId');
    const token = localStorage.getItem('TOKEN');

    if (!projectId || !token) {
        console.log('프로젝트 ID 또는 토큰이 없습니다.');
        return;
    }

    const url = `https://jjapra.r-e.kr/projects/${projectId}/issues`;

    try {
        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 200) {
            const issues = response.data;

            // 우선순위와 상태 통계 계산
            const priorityStats = {
                BLOCKER: 0,
                CRITICAL: 0,
                MAJOR: 0,
                MINOR: 0,
                TRIVIAL: 0
            };

            const statusStats = {
                NEW: 0,
                ASSIGNED: 0,
                RESOLVED: 0,
                FIXED: 0,
                CLOSED: 0
            };

            issues.forEach(issueData => {
                const { priority, status } = issueData.issue;
                priorityStats[priority]++;
                statusStats[status]++;
            });

            const totalIssues = issues.length;

            // 우선순위 통계 출력
            console.log('Priority Statistics:');
            Object.keys(priorityStats).forEach(priority => {
                const count = priorityStats[priority];
                const percentage = ((count / totalIssues) * 100).toFixed(2);
                console.log(`${priority}: ${count} (${percentage}%)`);
            });

            // 상태 통계 출력
            console.log('Status Statistics:');
            Object.keys(statusStats).forEach(status => {
                const count = statusStats[status];
                const percentage = ((count / totalIssues) * 100).toFixed(2);
                console.log(`${status}: ${count} (${percentage}%)`);
            });
        } else {
            console.error('이슈 통계 조회에 실패했습니다.');
        }
    } catch (error) {
        if (error.response) {
            console.error(`오류가 발생했습니다: ${error.response.status} ${error.response.statusText}`);
            console.error('응답 데이터:', error.response.data);
        } else {
            console.error('네트워크 오류가 발생했습니다:', error.message);
        }
    }

    await menuinproject();
}
