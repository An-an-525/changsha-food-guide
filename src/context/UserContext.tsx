import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import toast from 'react-hot-toast';

export interface UserProfile {
  username: string;
  points: number;
  favorites: string[];
  likes: string[];
}

interface UserContextType {
  currentUser: string | null;
  profile: UserProfile | null;
  login: (username: string) => void;
  logout: () => void;
  toggleFavorite: (placeId: string) => void;
  toggleLike: (placeId: string) => void;
  addPoints: (pts: number, reason: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const loadProfiles = (): Record<string, UserProfile> => {
    try {
      return JSON.parse(localStorage.getItem('xiangyu_profiles') || '{}');
    } catch {
      return {};
    }
  };

  const saveProfile = (p: UserProfile) => {
    const profiles = loadProfiles();
    profiles[p.username] = p;
    localStorage.setItem('xiangyu_profiles', JSON.stringify(profiles));
    setProfile(p);
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('xiangyu_current_user');
    if (savedUser) {
      setCurrentUser(savedUser);
      const profiles = loadProfiles();
      if (profiles[savedUser]) {
        setProfile(profiles[savedUser]);
      } else {
        const newProfile = { username: savedUser, points: 0, favorites: [], likes: [] };
        saveProfile(newProfile);
      }
    }
  }, []);

  const login = (username: string) => {
    localStorage.setItem('xiangyu_current_user', username);
    setCurrentUser(username);
    const profiles = loadProfiles();
    if (profiles[username]) {
      setProfile(profiles[username]);
      toast.success(`欢迎回来，${username}！`);
    } else {
      const newProfile = { username, points: 10, favorites: [], likes: [] };
      saveProfile(newProfile);
      toast.success(`注册成功！已赠送10个探店积分。`);
    }
  };

  const logout = () => {
    localStorage.removeItem('xiangyu_current_user');
    setCurrentUser(null);
    setProfile(null);
    toast('已安全退出账号', { icon: '👋' });
  };

  const toggleFavorite = (placeId: string) => {
    if (!profile) {
      toast.error('请先登录账号才能收藏！');
      return;
    }
    const isFav = profile.favorites.includes(placeId);
    const updated = {
      ...profile,
      favorites: isFav ? profile.favorites.filter(id => id !== placeId) : [...profile.favorites, placeId]
    };
    saveProfile(updated);
    if (!isFav) {
      toast.success('已加入我的私藏清单！');
      addPoints(2, '收藏地点');
    } else {
      toast('已取消收藏');
    }
  };

  const toggleLike = (placeId: string) => {
    if (!profile) {
      toast.error('请先登录账号才能点赞！');
      return;
    }
    const isLiked = profile.likes.includes(placeId);
    const updated = {
      ...profile,
      likes: isLiked ? profile.likes.filter(id => id !== placeId) : [...profile.likes, placeId]
    };
    saveProfile(updated);
    if (!isLiked) {
      toast.success('点赞成功，这篇探店因为你更火了！');
      addPoints(1, '点赞互动');
    }
  };

  const addPoints = (pts: number, reason: string) => {
    if (!profile) return;
    const updated = { ...profile, points: profile.points + pts };
    saveProfile(updated);
    toast.success(`积分 +${pts} (${reason})`, { icon: '✨' });
  };

  return (
    <UserContext.Provider value={{ currentUser, profile, login, logout, toggleFavorite, toggleLike, addPoints }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};