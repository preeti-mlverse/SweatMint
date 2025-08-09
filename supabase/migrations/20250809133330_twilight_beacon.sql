/*
  # Community and Shop Features

  1. New Tables
    - `users` - Extended user information for community features
    - `posts` - Community feed posts
    - `post_likes` - Post likes tracking
    - `post_comments` - Post comments
    - `clubs` - Fitness clubs/groups
    - `club_members` - Club membership tracking
    - `performance_scores` - Leaderboard scores
    - `shop_products` - Shop products
    - `user_purchases` - Purchase history

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users

  3. Initial Data
    - Preload fitness clubs
    - Sample shop products
*/

-- Users table (extended from auth.users)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text,
  email text UNIQUE,
  avatar_url text,
  coin_balance integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Posts table for community feed
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  content_text text NOT NULL,
  content_image_url text,
  created_at timestamptz DEFAULT now()
);

-- Post likes
CREATE TABLE IF NOT EXISTS post_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- Post comments
CREATE TABLE IF NOT EXISTS post_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  comment_text text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Clubs
CREATE TABLE IF NOT EXISTS clubs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  created_by uuid REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Club members
CREATE TABLE IF NOT EXISTS club_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id uuid REFERENCES clubs(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  joined_at timestamptz DEFAULT now(),
  UNIQUE(club_id, user_id)
);

-- Performance scores for leaderboard
CREATE TABLE IF NOT EXISTS performance_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  score integer DEFAULT 0,
  last_updated timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Shop products
CREATE TABLE IF NOT EXISTS shop_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  brand text NOT NULL,
  category text NOT NULL CHECK (category IN ('Athleisure', 'Accessories', 'Sports Nutrition', 'Equipment', 'Personal Grooming')),
  coin_cost integer NOT NULL,
  image_url text NOT NULL,
  description text,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- User purchases
CREATE TABLE IF NOT EXISTS user_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  product_id uuid REFERENCES shop_products(id) ON DELETE CASCADE,
  coins_spent integer NOT NULL,
  purchased_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_purchases ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can read all user profiles"
  ON users FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

-- RLS Policies for posts
CREATE POLICY "Users can read all posts"
  ON posts FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can create own posts"
  ON posts FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts"
  ON posts FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts"
  ON posts FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for post_likes
CREATE POLICY "Users can read all post likes"
  ON post_likes FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can manage own likes"
  ON post_likes FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for post_comments
CREATE POLICY "Users can read all comments"
  ON post_comments FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can create own comments"
  ON post_comments FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments"
  ON post_comments FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
  ON post_comments FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for clubs
CREATE POLICY "Users can read all clubs"
  ON clubs FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can create clubs"
  ON clubs FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own clubs"
  ON clubs FOR UPDATE TO authenticated
  USING (auth.uid() = created_by);

-- RLS Policies for club_members
CREATE POLICY "Users can read all club memberships"
  ON club_members FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can manage own memberships"
  ON club_members FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for performance_scores
CREATE POLICY "Users can read all performance scores"
  ON performance_scores FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update own score"
  ON performance_scores FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for shop_products
CREATE POLICY "Users can read all products"
  ON shop_products FOR SELECT TO authenticated USING (true);

-- RLS Policies for user_purchases
CREATE POLICY "Users can read own purchases"
  ON user_purchases FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own purchases"
  ON user_purchases FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Insert initial clubs
INSERT INTO clubs (name, description, created_by) VALUES
  ('HIIT Club', 'High-intensity interval training enthusiasts', (SELECT id FROM auth.users LIMIT 1)),
  ('Running Club', 'For runners of all levels and distances', (SELECT id FROM auth.users LIMIT 1)),
  ('Yoga Club', 'Mindful movement and flexibility focus', (SELECT id FROM auth.users LIMIT 1)),
  ('Skipping Club', 'Jump rope fitness and coordination', (SELECT id FROM auth.users LIMIT 1))
ON CONFLICT DO NOTHING;

-- Insert sample shop products
INSERT INTO shop_products (name, brand, category, coin_cost, image_url, description) VALUES
  ('Performance T-Shirt', 'FitWear', 'Athleisure', 250, 'https://images.pexels.com/photos/7432/pexels-photo.jpg', 'Moisture-wicking performance tee'),
  ('Smart Water Bottle', 'HydroMate', 'Accessories', 400, 'https://images.pexels.com/photos/416528/pexels-photo-416528.jpeg', 'Smart hydration tracking bottle'),
  ('Whey Protein - 1kg', 'ProGainz', 'Sports Nutrition', 800, 'https://images.pexels.com/photos/4162491/pexels-photo-4162491.jpeg', 'Premium whey protein powder'),
  ('Resistance Bands Set', 'FlexFit', 'Equipment', 600, 'https://images.pexels.com/photos/4162449/pexels-photo-4162449.jpeg', 'Complete resistance training set'),
  ('Recovery Foam Roller', 'RecoverPro', 'Equipment', 350, 'https://images.pexels.com/photos/4162438/pexels-photo-4162438.jpeg', 'Deep tissue massage roller'),
  ('Pre-Workout Energy', 'PowerBoost', 'Sports Nutrition', 450, 'https://images.pexels.com/photos/4162491/pexels-photo-4162491.jpeg', 'Natural energy supplement'),
  ('Fitness Tracker', 'TechFit', 'Accessories', 1200, 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg', 'Advanced fitness monitoring'),
  ('Workout Gloves', 'GripMax', 'Accessories', 180, 'https://images.pexels.com/photos/4162438/pexels-photo-4162438.jpeg', 'Enhanced grip training gloves'),
  ('Post-Workout Shampoo', 'CleanFresh', 'Personal Grooming', 120, 'https://images.pexels.com/photos/3735657/pexels-photo-3735657.jpeg', 'Refreshing post-exercise care'),
  ('Athletic Shorts', 'FlexWear', 'Athleisure', 300, 'https://images.pexels.com/photos/7432/pexels-photo.jpg', 'Comfortable training shorts')
ON CONFLICT DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_post_id ON post_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_club_members_club_id ON club_members(club_id);
CREATE INDEX IF NOT EXISTS idx_performance_scores_score ON performance_scores(score DESC);
CREATE INDEX IF NOT EXISTS idx_shop_products_category ON shop_products(category);
CREATE INDEX IF NOT EXISTS idx_user_purchases_user_id ON user_purchases(user_id);