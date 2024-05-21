import axios from 'axios'; //실행 가능
import inquirer from 'inquirer'
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
    const inquirer = await import('inquirer');
    console.log('로그인 페이지입니다.');

    const questionIdAndPassword = [
    {
        type: 'input',
        name: 'id',
        message: '아이디를 입력하세요:',
    },
    {
        type: 'input',
        name: 'password',
        message: '비밀번호를 입력하세요:',
    }
    ];
    const answers = await inquirer.default.prompt(questionIdAndPassword);
    //아이디, 비밀번호를 서버에 보내고 회원 정보와 일치 시 프로젝트 페이지로 넘어가기
projectpage();
}


async function join() {
    const inquirer = await import('inquirer');
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
            choices: ['프로젝트 생성', '프로젝트 입장', 'logout'],
        }
        ];
        const projectpageAnswer = await inquirer.default.prompt(questionForProjectpage);
    
        switch (projectpageAnswer.projectAction) {
            case '프로젝트 생성':
                console.log('프로젝트 생성 페이지로 넘어갑니다.');
                makeproject();
                break;
            case '프로젝트 입장':
                //get 이용해서 서버에서 프로젝트 리스트 출력 후 프로젝트 선택하게 하기
                console.log('프로젝트 목록을 불러옵니다.');
                await chooseproject();     //서버에서 프로젝트 정보 받아서 메뉴 출력
                break;
            case 'logout':
                console.log('초기 화면으로 이동합니다.')
                firstpage();
                break;
        }
}

async function makeproject(){
    const inquirer = await import('inquirer');
    console.log('프로젝트 생성 페이지입니다.');
    const questionForMakeProject = [
        {
            type: 'input',
            name: 'projectName',
            message: '프로젝트 이름을 입력하세요:'
        }
    ];
    const answerProjectName = await inquirer.default.prompt(questionForMakeProject);
    //post 이용해서 프로젝트 생성
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

/////////////////////////////////////////////////////////////// 이 아래로는 서버 요청 함수들

async function fetchprojects() {
    try {
        const response = await axios.get('https://jjapra.r-e.kr/projects');
        return response.data; // 데이터 형식에 따라 response.data.projects로 할 수도 있음
    } catch (error) {
        console.error('프로젝트를 불러오는 중 오류가 발생했습니다:', error);
        return [];
    }
}





/////////////////////////////////////////////////////////////// 이 아래는 진입점
main();