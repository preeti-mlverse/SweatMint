export interface UserProfile {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  weight?: number;
  weightUnit: 'kg' | 'pounds';
  createdAt: Date;
}

export interface ShopProduct {
  id: string;
  name: string;
  brand: string;
  category: 'Athleisure' | 'Accessories' | 'Sports Nutrition' | 'Equipment' | 'Personal Grooming';
  coin_cost: number;
  image_url: string;
  description?: string;
}

export interface CommunityPost {
  id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  content_text: string;
  content_image_url?: string;
  like_count: number;
  comment_count: number;
  is_liked: boolean;
  created_at: Date;
}

export interface Club {
  id: string;
  name: string;
  description: string;
  member_count: number;
  is_member: boolean;
  created_by: string;
  created_at: Date;
}

export interface Goal {

export type AppScreen = 'welcome' | 'profile' | 'user-details' | 'goals' | 'goal-setup' | 'main';
export type MainTab = 'today' | 'progress' | 'plan' | 'shop' | 'community' | 'profile';