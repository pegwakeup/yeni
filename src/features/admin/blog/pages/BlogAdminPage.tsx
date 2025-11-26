import React, { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import BlogStats from '../components/BlogStats';
import BlogFilters from '../components/BlogFilters';
import BlogList from '../components/BlogList';
import { getBlogPosts, deleteBlogPost } from '../../../../lib/config/supabase';
import type { BlogPost } from '../types';

interface BlogStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  categories: Set<string>;
}

const BlogAdminPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stats, setStats] = useState<BlogStats>({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    categories: new Set()
  });

  useEffect(() => {
    loadBlogData();
  }, []);

  const loadBlogData = async () => {
    try {
      setLoading(true);
      const fetchedPosts = await getBlogPosts(true);
      setPosts(fetchedPosts);

      const published = fetchedPosts.filter(post => post.published).length;
      setStats({
        totalPosts: fetchedPosts.length,
        publishedPosts: published,
        draftPosts: fetchedPosts.length - published,
        categories: new Set(fetchedPosts.map(post => post.category))
      });
    } catch (err) {
      console.error('Blog data loading error:', err);
      setError('Blog verileri yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bu blog yazısını silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      await deleteBlogPost(id);
      setPosts(posts => posts.filter(post => post.id !== id));
      alert('Blog yazısı başarıyla silindi!');
    } catch (error) {
      console.error('Blog silme hatası:', error);
      alert('Blog yazısı silinirken bir hata oluştu.');
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'published' && post.published) ||
                         (statusFilter === 'draft' && !post.published);
    const matchesCategory = categoryFilter === 'all' || post.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Blog Yönetimi</h1>
          <p className="text-slate-500 dark:text-gray-400 mt-1">Blog yazılarını yönetin</p>
        </div>

        <Link
          to="/admin/blog/new"
          className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 bg-primary rounded-xl hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25 min-h-[48px]"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Yeni Blog Yazısı</span>
        </Link>
      </div>

      <BlogStats stats={stats} />

      <BlogFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        categories={stats.categories}
      />

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={loadBlogData}
            className="w-full sm:w-auto px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors min-h-[48px]"
          >
            Tekrar Dene
          </button>
        </div>
      ) : (
        <BlogList
          posts={filteredPosts}
          onEdit={(post) => {/* Handle edit */}}
          onDelete={handleDelete}
        />
      )}
    </>
  );
};

export default BlogAdminPage;