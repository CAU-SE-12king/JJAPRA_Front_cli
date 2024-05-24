import axios from 'axios'; 
import inquirer from 'inquirer'
import { CookieJar } from 'tough-cookie';
import { wrapper } from 'axios-cookiejar-support';

const cookieJar = new CookieJar();
const client = wrapper(axios.create({ jar: cookieJar }));
async function main(){
firstpage();
}

//////////////////////////////////////////////////////// 이 아래로는 페이지 함수들
async function firstpage() {
    const inquirer = await import('inquirer');
  
    const question = [
        {
            type: 'list',
            name: 'action',
            message: 'What do you want to do?',
            choices: ['Log in', '회원가입', 'Exit']
        }
    ];
    const answers = await inquirer.default.prompt(question);
    
        switch (answers.action) {
            case 'Log in':
                console.log('log in 페이지로 넘어갑니다.');
                login();
                break;
            case '회원가입':
                console.log('회원가입 페이지로 넘어갑니다.');
                join();
                break;
            case 'Exit':
                console.log('프로그램을 종료합니다.')
                break;
        }
    
}
async function login() {
    console.log('로그인 페이지입니다.');  // Log the page information

    // Define the questions for user input
    const questionIdAndPassword = [
        {
            type: 'input',
            name: 'id',
            message: '아이디를 입력하세요:',
        },
        {
            type: 'password',  // Changed type to 'password' to hide password input
            name: 'password',
            message: '비밀번호를 입력하세요:',
        }
    ];

    const answers = await inquirer.prompt(questionIdAndPassword);

    const payload = {
        id: answers.id,
        password: answers.password
    };

    try {
        const response = await client.post('https://jjapra.r-e.kr/login', payload);

        if (response.status === 200) {
            console.log("redirect:/success"); 
            projectpage(); 
        } else {
            console.log("아이디 또는 비밀번호가 일치하지 않습니다.");
            firstpage();
        }
    } catch (error) {
        
        if (error.response && error.response.status === 400) {
            console.log("redirect:/"); 
        } else {
            console.error('An error occurred:', error.message); 
        }
    }
}


async function join() {
    //const inquirer = await import('inquirer');
    console.log('회원가입 페이지입니다.');
    
    const questionUserInfo = [ //회원 정보 입력
        {
            type: 'input',
            name: 'userName',
            message: '이름을 입력하세요:',
        },
        {
            type: 'input',
            name: 'userPhoneNumber',
            message: '전화번호를 입력하세요:',
        },
        {
            type: 'input',
            name: 'userEmail',
            message: '이메일을 입력하세요:',
        }
        ];
    const userInfo = await inquirer.default.prompt(questionUserInfo);

    
    const questionIdForJoin = [{ //아이디 입력
        type: 'input',
        name: 'id',
        message: '아이디를 입력하세요:',
    }];
    const id = await inquirer.default.prompt(questionIdForJoin);

    let password;
    let passwordsMatch = false;
    while (!passwordsMatch) {
        const questionPasswordForJoin = [
            {
                type: 'password',  // 비밀번호는 보안상 'input' 대신 'password' 타입 사용
                name: 'firstPassword',
                message: '비밀번호를 입력하세요:',
            },
            {
                type: 'password', 
                name: 'passwordCheck',
                message: '비밀번호 확인:',
            }
        ];
        const answerPassword = await inquirer.default.prompt(questionPasswordForJoin);
        if (answerPassword.firstPassword !== answerPassword.passwordCheck) {
            console.log('비밀번호가 일치하지 않습니다. 다시 입력해 주세요.');
        } else {
            passwordsMatch = true;  // 비밀번호가 일치하면 반복문 종료
            password = answerPassword.firstPassword;
        }
    }
    
        //post 이용해서 이름, 전화번호, 이메일, 아이디, 비번 등 회원정보 서버에 등록
    
    console.log('회원 가입이 완료되었습니다.');
    firstpage();
}


async function projectpage(){
    const inquirer = await import('inquirer');
    console.log('프로젝트 페이지입니다.');
    const questionForProjectpage = [
        {
            type: 'list',
            name: 'projectAction',
            message: 'What do you want to do?',
            choices: ['프로젝트 생성', '프로젝트 입장', '프로젝트에 참여하기', 'logout'],
        }
        ];
        const projectpageAnswer = await inquirer.default.prompt(questionForProjectpage);
    
        switch (projectpageAnswer.projectAction) {
            case '프로젝트 생성':
                console.log('프로젝트 생성 페이지로 넘어갑니다.');
                await makeprojectpage();
                break;
            case '프로젝트 입장':
                console.log('프로젝트 목록을 불러옵니다.');
                await chooseproject();     //서버에서 프로젝트 정보 받아서 메뉴 출력
                break;
            case '프로젝트에 참여하기':
                await chooseforjoiningproject();
                break;
            case 'logout':
                console.log('초기 화면으로 이동합니다.')
                firstpage();
                break;
        }
}

async function makeprojectpage(){
    const inquirer = await import('inquirer');
    console.log('프로젝트 생성 페이지입니다.');
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
    const answers = await inquirer.default.prompt(questionForMakeProject);
    
    // 입력 받은 프로젝트 이름과 설명으로 프로젝트 생성 함수 호출
    await createproject(answers.projectName, answers.projectComment);
    
    // 프로젝트 페이지로 돌아가기
    projectpage();
}
async function menuinproject(){
    const inquirer = await import('inquirer');
    console.log('이슈 관리 페이지입니다.');
    const questionMenuinProject = [
        {
            type: 'list',
            name: 'issueTrackingMenu',
            message: 'What do you want to do?',
            choices: ['이슈 등록', '이슈 목록', '이슈 브라우즈', '이슈 통계 확인', '프로젝트 메뉴로'],
        }
    ];
    const answerissueTrackingMenu = await inquirer.default.prompt(questionMenuinProject);
    
        switch (answerissueTrackingMenu.issueTrackingMenu) {
            case '이슈 등록':
                console.log('이슈등록 페이지로 넘어갑니다.');
                createissue();
                break;
            case '이슈 목록':
                console.log('이슈 리스트를 출력합니다');
                break;
            case '이슈 브라우즈':
                console.log('검색할 필드를 정해주세요.');
                break;
            case '이슈 통계 확인':
                console.log('이슈 통계를 확인합니다');
                break;
            case '프로젝트 메뉴로':
                console.log('프로젝트 메뉴로 돌아갑니다.');
                projectpage();
                break;
        }
}

async function createissue(){
    const inquirer = await import('inquirer');
    console.log('이슈 등록 페이지입니다');
    
    const questionIssueInfo = [ //이슈 정보 입력
        {
            type: 'input',
            name: 'issueName',
            message: '이슈 이름을 입력하세요:',
        },
        {
            type: 'input',
            name: 'issueComment',
            message: '이슈에 대한 설명을 입력하세요:',
        },
        {
            type: 'list',
            name: 'issuePriority',
            message: '이슈의 우선순위를 정하세요.',
            choices: ['blocker', 'critical', 'major', 'minor', 'trivial'],
        }
        ];
    const answersIssueInfo = await inquirer.default.prompt(questionIssueInfo);
    // post 이용해서 이슈 등록
    menuinproject();
}
/////////////////////////////////////////////////////////////// 이 아래는 목록 출력 함수 등

async function chooseproject() {
    const projects = await fetchprojects();
    if (projects.length === 0) {
        console.log('사용 가능한 프로젝트가 없습니다.');
        return;
    }

    const choices = projects.map(project => ({
        name: `${project.title} (ID: ${project.id})`, // 프로젝트 제목과 ID를 함께 표시
        value: project.id
    }));

    const question = [{
        type: 'list',
        name: 'projectId',
        message: '입장할 프로젝트를 선택하세요:',
        choices: choices
    }];

    const answer = await inquirer.prompt(question);
    console.log(`선택된 프로젝트 ID: ${answer.projectId}`);
    // 선택된 프로젝트 ID로 다음 단계 함수 호출 예정
}




async function chooseforjoiningproject() {
    const inquirer = await import('inquirer');

    // 전체 프로젝트 목록을 서버로부터 가져오는 함수 호출
    const projects = await fetchprojects(); // 이 함수는 서버에서 프로젝트 목록을 가져오는 기능을 구현해야 합니다.

    if (projects.length === 0) {
        console.log('사용 가능한 프로젝트가 없습니다.');
        return;
    }

    // 프로젝트 선택
    const projectChoices = projects.map(project => ({
        name: `${project.title} (ID: ${project.id})`, // 프로젝트 제목과 ID를 함께 표시
        value: project.project.id
    }));

    const questions = [
        {
            type: 'list',
            name: 'projectId',
            message: '참여할 프로젝트를 선택하세요:',
            choices: projectChoices
        }
    ];

    const answers = await inquirer.prompt(questions);
    const memberId = await getCurrentMemberIdFromCookie();  
    const role = "DEV";       // 이 예제에서는 하드코딩된 역할을 사용합니다.

    // 선택된 프로젝트에 멤버를 할당
    await jointoproject(answers.projectId, memberId, role);
}


/////////////////////////////////////////////////////////////////////////////////////////////// 이 아래로는 서버 요청 함수들



async function fetchprojects() {
    try {
        const response = await client.get('https://jjapra.r-e.kr/projects');
        return response.data;  // 직접 반환하는 형태로 유지
    } catch (error) {
        console.error('프로젝트를 불러오는 중 오류가 발생했습니다:', error);
        return [];
    }
}


async function createproject(title, description) {
    // 이전에 정의한 axios client 'client' 사용
    const payload = {
        title: title,
        description: description
    };

    try {
        // axios POST 요청을 서버에 보내기
        const response = await client.post('https://jjapra.r-e.kr/projects', payload);

        // 응답 상태 코드 체크
        if (response.status === 201) {
            console.log('프로젝트가 성공적으로 생성되었습니다.');
        } else {
            console.log('프로젝트 생성에 실패했습니다.');
        }
    } catch (error) {
        console.error('프로젝트 생성 중 오류가 발생했습니다:', error);
    }
}

async function jointoproject(projectId, memberId, role) {
    const payload = {
        memberId: memberId,
        role: role
    };

    try {
        const response = await client.post(`https://jjapra.r-e.kr/projects/${projectId}`, payload);

        if (response.status === 201) {
            console.log('멤버가 프로젝트에 성공적으로 할당되었습니다.');
        } else {
            console.log('멤버를 프로젝트에 할당하는 데 실패했습니다.', '응답 코드:', response.status);
        }
    } catch (error) {
        console.error('멤버를 프로젝트에 할당하는 동안 오류가 발생했습니다:', error);
    }
}
/////////////////////////////////////////////////////////////// 이 아래는 쿠키에서 정보 추출
async function getCurrentMemberIdFromCookie() {
    try {
        // 쿠키에서 memberId 정보를 읽는 로직 (구현은 서버 측 쿠키 구조에 따라 다를 수 있음)
        const cookies = cookieJar.getCookiesSync('https://jjapra.r-e.kr/');
        const memberCookie = cookies.find(cookie => cookie.key === 'memberId');
        if (memberCookie) {
            return memberCookie.value;
        } else {
            throw new Error('Member ID cookie is not found.');
        }
    } catch (error) {
        console.error('Error retrieving member ID from cookie:', error);
        throw error;
    }
}
/////////////////////////////////////////////////////////////// 이 아래는 진입점
main();