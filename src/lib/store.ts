// 회원 등급 (6단계) 정의
export enum UserLevel {
  LV1_GUEST = 1,     // 준회원 (회원가입 직후)
  LV2_MEMBER = 2,    // 정회원 (지부 인증 완료)
  LV3_EXCELLENT = 3, // 우수회원 (활동 우수, 공동 행사 참여)
  LV4_MANAGER = 4,   // 지부장급 (네트워크, 소속 회원 승인 권한)
  LV5_ADMIN = 5,     // 관리자 (연합회 총괄 본부 스태프)
  LV6_CEO = 6        // 대표이사 (최고 권한, 최종 의사결정)
}

export interface User {
  id: string;
  email: string;
  password?: string; // 실제로는 Hash 해야 함
  nickname: string;
  name: string; // 이름
  phone: string; // 연락처
  bandName: string; // 소속 동호회(클럽)명
  position: string; // 악기 파트
  address: string; // 주소
  status: 'pending' | 'active'; // 승인 상태
  level: UserLevel;
  createdAt: string;
}

// 게시글 인터페이스 정의
export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  authorId?: string; // 작성자 고유 ID
  createdAt: string;
}

// 초기 Mock 데이터
let users: User[] = [
  {
    id: "admin_1",
    email: "dowooksang@gmail.com",
    password: "admin", // 임시
    nickname: "연합회장",
    name: "도욱상",
    phone: "010-0000-0000",
    bandName: "운영진",
    position: "운영진",
    address: "서울시 강남구",
    status: 'active',
    level: UserLevel.LV6_CEO,
    createdAt: new Date().toISOString(),
  }
];

let posts: Post[] = [];

// 간단한 In-Memory DB 객체 모델
export const db = {
  // --------- 회원 관리 (Users) ---------
  getUsers: () => [...users],
  getUserByEmail: (email: string) => users.find(u => u.email === email) || null,
  getUserById: (id: string) => users.find(u => u.id === id) || null,
  
  addUser: (userData: Omit<User, 'id' | 'level' | 'status' | 'createdAt'>) => {
    // 이메일 중복 체크
    if (users.find(u => u.email === userData.email)) {
      throw new Error('이미 존재하는 이메일입니다.');
    }
    
    // 대표님 이메일이거나 admin인 경우 자동으로 최고 권한(CEO) 부여
    const isOwner = userData.email.includes('dowooksang') || userData.email.includes('admin');
    
    const newUser: User = {
      ...userData,
      id: Math.random().toString(36).substring(2, 9),
      level: isOwner ? UserLevel.LV6_CEO : UserLevel.LV1_GUEST,
      status: isOwner ? 'active' : 'pending',
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    return newUser;
  },

  approveUser: (id: string) => {
    const user = users.find(u => u.id === id);
    if (user) {
      user.status = 'active';
      user.level = UserLevel.LV2_MEMBER; // 승인되면 정회원으로 등급업
      return true;
    }
    return false;
  },

  appointAdmin: (id: string) => {
    const user = users.find(u => u.id === id);
    if (user) {
      user.level = UserLevel.LV5_ADMIN;
      return true;
    }
    return false;
  },

  dismissAdmin: (id: string) => {
    const user = users.find(u => u.id === id);
    if (user && user.level === UserLevel.LV5_ADMIN) {
      user.level = UserLevel.LV2_MEMBER; // 관리자 해임 시 정회원으로 강등
      return true;
    }
    return false;
  },

  changeUserLevel: (id: string, newLevel: UserLevel) => {
    const user = users.find(u => u.id === id);
    if (user) {
      user.level = newLevel;
      return true;
    }
    return false;
  },

  // --------- 게시글 관리 (Posts) ---------
  // 전체 게시글 조회 (최신순 정렬)
  getPosts: () => [...posts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
  
  // 특정 게시글 조회
  getPost: (id: string) => posts.find(p => p.id === id) || null,
  
  // 게시글 작성
  addPost: (post: Omit<Post, 'id' | 'createdAt'>) => {
    const newPost: Post = {
      ...post,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString()
    };
    posts.unshift(newPost);
    return newPost;
  },
  
  // 게시글 수정
  updatePost: (id: string, updated: Partial<Omit<Post, 'id' | 'createdAt'>>) => {
    const index = posts.findIndex(p => p.id === id);
    if (index === -1) return null;
    posts[index] = { ...posts[index], ...updated };
    return posts[index];
  },
  
  // 게시글 삭제
  deletePost: (id: string) => {
    const index = posts.findIndex(p => p.id === id);
    if (index === -1) return false;
    posts.splice(index, 1);
    return true;
  },

  // --------- 지부 관리 (Branches) ---------
  getBranches: () => [...branches],
  
  addBranch: (branchData: Omit<Branch, 'id' | 'status' | 'createdAt'>) => {
    const newBranch: Branch = {
      ...branchData,
      id: Math.random().toString(36).substring(2, 9),
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    branches.push(newBranch);
    return newBranch;
  },
  
  approveBranch: (id: string) => {
    const branch = branches.find(b => b.id === id);
    if (branch) {
      branch.status = 'approved';
      // 지부장의 UserLevel을 밴드마스터(지부장) 등급으로 상향
      const user = users.find(u => u.id === branch.userId);
      if (user && user.level < UserLevel.LV4_MANAGER) {
        user.level = UserLevel.LV4_MANAGER;
      }
      return true;
    }
    return false;
  }
};

export interface Branch {
  id: string;
  name: string; // 지부 명칭
  managerName: string; // 지부장 성함
  managerPhone: string; // 지부장 연락처
  region: string; // 활동 지역
  hasPracticeRoom: boolean; // 연습실 유무
  bandCount: number; // 소속 밴드 수
  status: 'pending' | 'approved';
  userId: string; // 신청자 고유 ID
  createdAt: string;
}

let branches: Branch[] = [];
