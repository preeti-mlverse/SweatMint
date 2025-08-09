import React, { useState, useEffect } from 'react';
import { Users, MessageCircle, Heart, Share, Plus, Trophy, UserPlus, Search } from 'lucide-react';
import { CommunityPost, Club } from '../../types';
import { supabase } from '../../lib/supabase';

type CommunitySection = 'feed' | 'clubs' | 'leaderboard';

export const CommunityTab: React.FC = () => {
  const [activeSection, setActiveSection] = useState<CommunitySection>('feed');
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPostText, setNewPostText] = useState('');
  const [showCreatePost, setShowCreatePost] = useState(false);

  useEffect(() => {
    if (activeSection === 'feed') {
      fetchPosts();
    } else if (activeSection === 'clubs') {
      fetchClubs();
    } else if (activeSection === 'leaderboard') {
      fetchLeaderboard();
    }
  }, [activeSection]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          users!posts_user_id_fkey(name, avatar_url),
          post_likes(count),
          post_comments(count)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedPosts: CommunityPost[] = (data || []).map(post => ({
        id: post.id,
        user_id: post.user_id,
        user_name: post.users?.name || 'Anonymous',
        user_avatar: post.users?.avatar_url,
        content_text: post.content_text,
        content_image_url: post.content_image_url,
        like_count: post.post_likes?.length || 0,
        comment_count: post.post_comments?.length || 0,
        is_liked: false, // TODO: Check if current user liked
        created_at: new Date(post.created_at)
      }));

      setPosts(formattedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClubs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('clubs')
        .select(`
          *,
          club_members(count),
          users!clubs_created_by_fkey(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedClubs: Club[] = (data || []).map(club => ({
        id: club.id,
        name: club.name,
        description: club.description,
        member_count: club.club_members?.length || 0,
        is_member: false, // TODO: Check if current user is member
        created_by: club.created_by,
        created_at: new Date(club.created_at)
      }));

      setClubs(formattedClubs);
    } catch (error) {
      console.error('Error fetching clubs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('performance_scores')
        .select(`
          *,
          users!performance_scores_user_id_fkey(name, avatar_url)
        `)
        .order('score', { ascending: false })
        .limit(50);

      if (error) throw error;
      setLeaderboard(data || []);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newPostText.trim()) return;

    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) return;

      const { error } = await supabase
        .from('posts')
        .insert({
          user_id: user.data.user.id,
          content_text: newPostText
        });

      if (error) throw error;

      setNewPostText('');
      setShowCreatePost(false);
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleLikePost = async (postId: string) => {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) return;

      const { error } = await supabase
        .from('post_likes')
        .insert({
          post_id: postId,
          user_id: user.data.user.id
        });

      if (error) throw error;
      fetchPosts();
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const renderFeed = () => (
    <div className="space-y-6">
      {/* Create Post */}
      <div className="bg-[#161B22] rounded-2xl p-4 border border-[#2B3440]">
        {showCreatePost ? (
          <div className="space-y-4">
            <textarea
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              placeholder="Share your fitness journey..."
              rows={3}
              className="w-full px-4 py-3 bg-[#0D1117] border border-[#2B3440] rounded-xl text-[#F3F4F6] placeholder-[#CBD5E1] focus:border-[#4BE0D1] focus:outline-none resize-none"
            />
            <div className="flex space-x-3">
              <button
                onClick={() => setShowCreatePost(false)}
                className="flex-1 bg-[#2B3440] hover:bg-[#0D1117] text-[#CBD5E1] py-2 px-4 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePost}
                disabled={!newPostText.trim()}
                className="flex-1 bg-[#4BE0D1] hover:bg-[#6BD0D2] disabled:bg-[#2B3440] disabled:text-[#CBD5E1] text-white py-2 px-4 rounded-xl transition-colors"
              >
                Post
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowCreatePost(true)}
            className="w-full flex items-center space-x-3 p-3 bg-[#0D1117] hover:bg-[#2B3440] border border-[#2B3440] rounded-xl transition-colors text-left"
          >
            <Plus className="w-5 h-5 text-[#4BE0D1]" />
            <span className="text-[#CBD5E1]">Share your fitness journey...</span>
          </button>
        )}
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-[#161B22] rounded-2xl p-6 border border-[#2B3440]">
            {/* Post Header */}
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-[#4BE0D1] rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-[#F3F4F6]">{post.user_name}</h4>
                <p className="text-sm text-[#CBD5E1]">
                  {post.created_at.toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Post Content */}
            <p className="text-[#F3F4F6] mb-4">{post.content_text}</p>

            {/* Post Actions */}
            <div className="flex items-center space-x-6">
              <button
                onClick={() => handleLikePost(post.id)}
                className="flex items-center space-x-2 text-[#CBD5E1] hover:text-[#EF4444] transition-colors"
              >
                <Heart className={`w-5 h-5 ${post.is_liked ? 'fill-[#EF4444] text-[#EF4444]' : ''}`} />
                <span>{post.like_count}</span>
              </button>
              <button className="flex items-center space-x-2 text-[#CBD5E1] hover:text-[#4BE0D1] transition-colors">
                <MessageCircle className="w-5 h-5" />
                <span>{post.comment_count}</span>
              </button>
              <button className="flex items-center space-x-2 text-[#CBD5E1] hover:text-[#6BD0D2] transition-colors">
                <Share className="w-5 h-5" />
                <span>Share</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderClubs = () => (
    <div className="space-y-6">
      {/* Create Club Button */}
      <button className="w-full bg-[#161B22] hover:bg-[#2B3440] border border-[#2B3440] rounded-2xl p-4 transition-colors">
        <div className="flex items-center justify-center space-x-3">
          <Plus className="w-6 h-6 text-[#4BE0D1]" />
          <span className="text-[#F3F4F6] font-medium">Create New Club</span>
        </div>
      </button>

      {/* Clubs List */}
      <div className="space-y-4">
        {clubs.map((club) => (
          <div key={club.id} className="bg-[#161B22] rounded-2xl p-6 border border-[#2B3440]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-[#F3F4F6]">{club.name}</h3>
                <p className="text-sm text-[#CBD5E1] mb-2">{club.description}</p>
                <div className="flex items-center space-x-4 text-sm text-[#CBD5E1]">
                  <span>{club.member_count} members</span>
                  <span>Created {club.created_at.toLocaleDateString()}</span>
                </div>
              </div>
              <button
                className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                  club.is_member
                    ? 'bg-[#2B3440] text-[#CBD5E1] hover:bg-red-500/20 hover:text-red-400'
                    : 'bg-[#4BE0D1] hover:bg-[#6BD0D2] text-white'
                }`}
              >
                {club.is_member ? 'Leave' : 'Join'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderLeaderboard = () => (
    <div className="space-y-6">
      {/* Leaderboard Header */}
      <div className="bg-[#161B22] rounded-2xl p-6 border border-[#2B3440]">
        <div className="flex items-center space-x-3 mb-4">
          <Trophy className="w-8 h-8 text-[#F8B84E]" />
          <div>
            <h3 className="text-lg font-semibold text-[#F3F4F6]">Fitness Leaderboard</h3>
            <p className="text-sm text-[#CBD5E1]">Top performers this month</p>
          </div>
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="space-y-3">
        {leaderboard.map((entry, index) => (
          <div key={entry.id} className="bg-[#161B22] rounded-2xl p-4 border border-[#2B3440]">
            <div className="flex items-center space-x-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                index === 0 ? 'bg-[#F8B84E] text-white' :
                index === 1 ? 'bg-[#CBD5E1] text-white' :
                index === 2 ? 'bg-[#B45309] text-white' :
                'bg-[#2B3440] text-[#CBD5E1]'
              }`}>
                {index + 1}
              </div>
              
              <div className="w-10 h-10 bg-[#4BE0D1] rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              
              <div className="flex-1">
                <h4 className="font-medium text-[#F3F4F6]">{entry.users?.name || 'Anonymous'}</h4>
                <p className="text-sm text-[#CBD5E1]">Fitness enthusiast</p>
              </div>
              
              <div className="text-right">
                <div className="text-lg font-bold text-[#F8B84E]">{entry.score}</div>
                <div className="text-xs text-[#CBD5E1]">points</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="pb-20 px-4 pt-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F3F4F6]">Community</h1>
          <p className="text-[#CBD5E1]">Connect with fellow fitness enthusiasts</p>
        </div>
        <div className="w-12 h-12 bg-[#6BD0D2] rounded-2xl flex items-center justify-center">
          <Users className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex space-x-2 bg-[#161B22] p-2 rounded-2xl border border-[#2B3440]">
        {[
          { id: 'feed', label: 'Feed', icon: MessageCircle },
          { id: 'clubs', label: 'Clubs', icon: UserPlus },
          { id: 'leaderboard', label: 'Leaderboard', icon: Trophy }
        ].map((section) => {
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id as CommunitySection)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-all ${
                activeSection === section.id
                  ? 'bg-[#4BE0D1] text-white'
                  : 'text-[#CBD5E1] hover:text-[#F3F4F6] hover:bg-[#0D1117]'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{section.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-[#4BE0D1] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {activeSection === 'feed' && renderFeed()}
          {activeSection === 'clubs' && renderClubs()}
          {activeSection === 'leaderboard' && renderLeaderboard()}
        </>
      )}
    </div>
  );
};