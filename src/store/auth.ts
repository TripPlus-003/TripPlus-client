import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

type State = {
  userInfo: ApiAuth.UserInfo | null;
  _hasHydrated: boolean;
  getters: {
    isLogin: boolean;
  };
};

type Actions = {
  setUserInfo: (arg: ApiAuth.UserInfo) => void;
  setHasHydrated: (state: boolean) => void;
};

export const useAuthStore = create<State & Actions>()(
  devtools(
    persist(
      (set, get) => ({
        userInfo: null,
        _hasHydrated: false,
        setUserInfo: (params) => {
          set((state) => {
            return { ...state, userInfo: params };
          });
        },
        setHasHydrated: (state) => {
          set({
            _hasHydrated: state
          });
        },
        getters: {
          get isLogin() {
            return !!get().userInfo;
          }
        }
      }),
      {
        name: 'userInfo',
        partialize: (state) =>
          Object.fromEntries(
            Object.entries(state).filter(([key]) => ['userInfo'].includes(key))
          ),
        onRehydrateStorage: () => {
          return (state) => {
            if (state) {
              state.setHasHydrated(true);
            }
          };
        }
      }
    ),
    { name: 'authStore' }
  )
);
