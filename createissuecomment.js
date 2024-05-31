// import axios from 'axios';
// import inquirer from 'inquirer';
// import { menuinissue } from './menuinissue.js';
// import { LocalStorage } from 'node-localstorage';
// const localStorage = new LocalStorage('./scratch');

// export async function createissuecomment() {
//     const issueId = localStorage.getItem('currentIssueId');
//     if (!issueId) {
//         console.log("현재 선택된 이슈가 없습니다.");
//         return;
//     }

//     const question = [
//         { type: 'input', name: 'comment', message: '댓글 내용을 입력하세요:' }
//     ];

//     const answer = await inquirer.prompt(question);
//     const payload = { description: answer.comment };
//     const token = localStorage.getItem('TOKEN');
//     try {
//         const response = await axios.post(`https://jjapra.r-e.kr/issues/${issueId}/comments`, payload, {
//                     headers: {
//                         'Authorization': `Bearer ${token}`
//                     }
//                  });
//         if (response) {
//             console.log('댓글이 성공적으로 추가되었습니다.');
//             console.log('이슈 정보:', response);
//         } 
//         else {
//             console.error('댓글 추가에 실패했습니다.');
//         }
//     } catch (error) {
//         console.error('댓글 추가 중 오류가 발생했습니다:', error.message);
//     }

//     await menuinissue();
// }
import axios from 'axios';
import inquirer from 'inquirer';
import { LocalStorage } from 'node-localstorage';
import { menuinissue } from './menuinissue.js';

const localStorage = new LocalStorage('./scratch');

export async function createissuecomment() {
    const issueId = localStorage.getItem('currentIssueId');
    if (!issueId) {
        console.log("현재 선택된 이슈가 없습니다.");
        return;
    }

    const questionComment = [
        {
            type: 'input',
            name: 'comment',
            message: '추가할 코멘트를 입력하세요:',
        }
    ];
    const answerComment = await inquirer.prompt(questionComment);

    const payload = {
        content: answerComment.comment
    };

    try {
        const response = await axios.post(`https://jjapra.r-e.kr/issues/${issueId}/comments`, payload, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('TOKEN')}`
            }
        });

        if (response.status === 201) {
            console.log('코멘트가 성공적으로 추가되었습니다.');
            console.log('이슈 정보:', response.data);
        } else {
            console.error('코멘트 추가에 실패했습니다.');
        }
    } catch (error) {
        if (error.response) {
            if (error.response.status === 400) {
                console.log('잘못된 요청입니다.');
            } else {
                console.error(`오류가 발생했습니다: ${error.response.status} ${error.response.statusText}`);
            }
        } else {
            console.error('네트워크 오류가 발생했습니다:', error.message);
        }
    }

    menuinissue();
}
