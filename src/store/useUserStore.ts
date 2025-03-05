import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getToken, deleteToken, setToken } from '@/utils/cookie';
import { userInfo } from '@/types/userInfo';
import { useStore } from './useStore';




interface userInfoProps {
  user: userInfo | null; // 유저 정보
  saveUser: (user: userInfo) => void; // 유저 정보 저장
  isLogin: boolean; // 로그인 여부
  checkLogin: () => void; // 로그인 여부 확인 함수
  logout: () => void; // 로그아웃
  getStorage: () => void; // 로그아웃
}

export const useUserStore = create()
  persist<userInfoProps>(
    (set) => {
      return {
        user: null,
        isLogin: false,

        saveUser: (user) => {
          setToken(user.token);
          set({ user, isLogin: true });
        },

        checkLogin: () => {
          const accessToken = getToken();
          if (accessToken) {
            set({ isLogin: true });
          } else {
            set({ user: null, isLogin: false });
          }
        },

        logout: () => {
          deleteToken();
          set({ user: null, isLogin: false });
        },
      };
    },
    {
      name: 'authStore',
      getStorage: () => {
        return localStorage;
      },
    }
);