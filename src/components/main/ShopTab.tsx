import React, { useState, useEffect } from 'react';
import { ShoppingBag, Coins, Filter, Search, Star, Package } from 'lucide-react';
import { ShopProduct } from '../../types';
import { supabase } from '../../lib/supabase';

export const ShopTab: React.FC = () => {
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [userCoins, setUserCoins] = useState<number>(1250); // Mock user coins
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Athleisure', 'Accessories', 'Sports Nutrition', 'Equipment', 'Personal Grooming'];

  useEffect(() => {
    fetchProducts();
    fetchUserCoins();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('shop_products')
        .select('*')
        .eq('is_available', true)
        .order('category', { ascending: true });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserCoins = async () => {
    try {
      const user = await supabase.auth.getUser();
      if (user.data.user) {
        const { data, error } = await supabase
          .from('users')
          .select('coin_balance')
          .eq('id', user.data.user.id)
          .single();

        if (error) throw error;
        setUserCoins(data?.coin_balance || 0);
      }
    } catch (error) {
      console.error('Error fetching user coins:', error);
    }
  };

  const handleRedeem = async (product: ShopProduct) => {
    if (userCoins < product.coin_cost) {
      alert('Insufficient coins!');
      return;
    }

    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) return;

      // Record purchase
      const { error: purchaseError } = await supabase
        .from('user_purchases')
        .insert({
          user_id: user.data.user.id,
          product_id: product.id,
          coins_spent: product.coin_cost
        });

      if (purchaseError) throw purchaseError;

      // Update user coin balance
      const { error: updateError } = await supabase
        .from('users')
        .update({ coin_balance: userCoins - product.coin_cost })
        .eq('id', user.data.user.id);

      if (updateError) throw updateError;

      setUserCoins(prev => prev - product.coin_cost);
      alert(`Successfully redeemed ${product.name}!`);
    } catch (error) {
      console.error('Error redeeming product:', error);
      alert('Failed to redeem product. Please try again.');
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Athleisure': return '👕';
      case 'Accessories': return '⌚';
      case 'Sports Nutrition': return '🥤';
      case 'Equipment': return '🏋️';
      case 'Personal Grooming': return '🧴';
      default: return '🛍️';
    }
  };

  if (loading) {
    return (
      <div className="pb-20 px-4 pt-6 flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-2 border-[#4BE0D1] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="pb-20 px-4 pt-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F3F4F6]">Shop</h1>
          <p className="text-[#CBD5E1]">Redeem your earned coins for rewards</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-[#161B22] px-4 py-2 rounded-xl border border-[#2B3440]">
            <Coins className="w-5 h-5 text-[#F8B84E]" />
            <span className="text-[#F3F4F6] font-bold">{userCoins.toLocaleString()}</span>
          </div>
          <div className="w-12 h-12 bg-[#4BE0D1] rounded-2xl flex items-center justify-center">
            <ShoppingBag className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#CBD5E1]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-3 bg-[#161B22] border border-[#2B3440] rounded-xl text-[#F3F4F6] placeholder-[#CBD5E1] focus:border-[#4BE0D1] focus:outline-none"
          />
        </div>

        {/* Categories */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
                selectedCategory === category
                  ? 'bg-[#4BE0D1] text-white'
                  : 'bg-[#161B22] text-[#CBD5E1] hover:bg-[#2B3440] border border-[#2B3440]'
              }`}
            >
              <span>{getCategoryIcon(category)}</span>
              <span>{category}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 gap-4">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-[#161B22] rounded-2xl border border-[#2B3440] overflow-hidden">
            {/* Product Image */}
            <div className="aspect-square bg-[#2B3440] relative overflow-hidden">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/416528/pexels-photo-416528.jpeg';
                }}
              />
              <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
                {getCategoryIcon(product.category)}
              </div>
            </div>

            {/* Product Info */}
            <div className="p-4">
              <div className="mb-2">
                <h3 className="font-semibold text-[#F3F4F6] text-sm leading-tight">{product.name}</h3>
                <p className="text-xs text-[#CBD5E1]">{product.brand}</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <Coins className="w-4 h-4 text-[#F8B84E]" />
                  <span className="font-bold text-[#F8B84E]">{product.coin_cost}</span>
                </div>
                
                <button
                  onClick={() => handleRedeem(product)}
                  disabled={userCoins < product.coin_cost}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    userCoins >= product.coin_cost
                      ? 'bg-[#4BE0D1] hover:bg-[#6BD0D2] text-white'
                      : 'bg-[#2B3440] text-[#CBD5E1] cursor-not-allowed'
                  }`}
                >
                  {userCoins >= product.coin_cost ? 'Redeem' : 'Need More'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && !loading && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-[#2B3440] mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-[#CBD5E1] mb-2">No Products Found</h3>
          <p className="text-[#CBD5E1]">Try adjusting your search or category filter</p>
        </div>
      )}

      {/* Earn More Coins CTA */}
      <div className="bg-[#161B22] rounded-2xl p-6 border border-[#2B3440] bg-gradient-to-r from-[#F8B84E]/5 to-[#F08A3E]/5">
        <div className="flex items-center space-x-3 mb-4">
          <Coins className="w-8 h-8 text-[#F8B84E]" />
          <div>
            <h3 className="text-lg font-semibold text-[#F3F4F6]">Earn More Coins</h3>
            <p className="text-sm text-[#CBD5E1]">Complete fitness activities to earn coins</p>
          </div>
        </div>
        
        <div className="space-y-2 text-sm text-[#F3F4F6]">
          <div className="flex justify-between">
            <span>Complete daily workout</span>
            <span className="text-[#F8B84E] font-medium">+50 coins</span>
          </div>
          <div className="flex justify-between">
            <span>Log all meals for a day</span>
            <span className="text-[#F8B84E] font-medium">+30 coins</span>
          </div>
          <div className="flex justify-between">
            <span>Achieve step goal</span>
            <span className="text-[#F8B84E] font-medium">+25 coins</span>
          </div>
          <div className="flex justify-between">
            <span>Weekly streak bonus</span>
            <span className="text-[#F8B84E] font-medium">+100 coins</span>
          </div>
        </div>
      </div>
    </div>
  );
};