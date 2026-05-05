// 회원 등급 (5단계) 정의
export enum UserLevel {
  GUEST = 1,      // 준회원 (가입 직후)
  MEMBER = 2,     // 정회원 (승인됨, 글쓰기 가능)
  ACTIVE = 3,     // 활동회원
  MASTER = 4,     // 밴드마스터
  ADMIN = 5       // 최고관리자 (실운영진)
}

export interface User {
  id: string;
  email: string;
  password?: string; // 실제로는 Hash 해야 함
  nickname: string;
  position: string; // 보컬, 기타 등
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
    position: "운영진",
    level: UserLevel.ADMIN,
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
  
  addUser: (userData: Omit<User, 'id' | 'level' | 'createdAt'>) => {
    // 이메일 중복 체크
    if (users.find(u => u.email === userData.email)) {
      throw new Error('이미 존재하는 이메일입니다.');
    }
    const newUser: User = {
      ...userData,
      id: Math.random().toString(36).substring(2, 9),
      level: UserLevel.GUEST, // 기본값: 준회원
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    return newUser;
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
  }
};
