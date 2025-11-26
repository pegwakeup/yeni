import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Image, ArrowLeft, Bold, Italic, Link as LinkIcon, Code, 
  ListOrdered, List, Heading2, Heading3, Quote, Eye,
  AlignLeft, AlignCenter, AlignRight, ImagePlus, Save,
  Calendar, Clock, Tag, ChevronRight, AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createBlogPost, uploadImage, type BlogPost } from '../lib/config/supabase';

const NewBlogPost = () => {
  const navigate = useNavigate();
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    image_url: '',
    category: '',
    tags: '',
    author_id: 'a52c1934-0c96-4c44-9567-97c36ce7e042', // Default author ID
    read_time: '',
    published: false,
    status: 'draft' as const
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\\s-]/g, '')
      .replace(/\\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const imageUrl = await uploadImage(file, 'blog-images');
      
      if (e.target.name === 'coverImage') {
        setFormData(prev => ({ ...prev, image_url: imageUrl }));
      } else {
        insertAtCursor(`<img src="${imageUrl}" alt="Blog görseli" class="w-full rounded-lg shadow-lg" />`);
      }
    } catch (error) {
      console.error('Görsel yükleme hatası:', error);
      setError('Görsel yüklenirken bir hata oluştu.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent, action: 'publish' | 'draft') => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);
      
      const postData = {
        title: formData.title,
        slug: formData.slug || generateSlug(formData.title),
        excerpt: formData.excerpt,
        content: formData.content,
        image_url: formData.image_url,
        category: formData.category,
        tags: tagsArray,
        author_id: formData.author_id,
        read_time: formData.read_time,
        published: action === 'publish',
        status: action
      };

      await createBlogPost(postData);
      navigate('/admin/blog');
    } catch (error: any) {
      console.error('Blog kaydetme hatası:', error);
      setError(error.message || 'Blog yazısı kaydedilirken bir hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name === 'title' && !formData.slug) {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        slug: generateSlug(value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      }));
    }
  };

  const insertAtCursor = useCallback((before: string, after: string = '') => {
    const textarea = contentRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);
    
    const newText = text.substring(0, start) + 
                   before + 
                   selectedText + 
                   after + 
                   text.substring(end);

    setFormData(prev => ({ ...prev, content: newText }));
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        end + before.length
      );
    }, 0);
  }, []);

  const formatButtons = [
    { icon: Heading2, action: () => insertAtCursor('\n<h2>', '</h2>\n'), title: 'Başlık 2' },
    { icon: Heading3, action: () => insertAtCursor('\n<h3>', '</h3>\n'), title: 'Başlık 3' },
    { icon: Bold, action: () => insertAtCursor('<strong>', '</strong>'), title: 'Kalın' },
    { icon: Italic, action: () => insertAtCursor('<em>', '</em>'), title: 'İtalik' },
    { icon: LinkIcon, action: () => insertAtCursor('<a href="">', '</a>'), title: 'Link' },
    { icon: Code, action: () => insertAtCursor('<code>', '</code>'), title: 'Kod' },
    { icon: ListOrdered, action: () => insertAtCursor('\n<ol>\n  <li>', '</li>\n</ol>'), title: 'Sıralı Liste' },
    { icon: List, action: () => insertAtCursor('\n<ul>\n  <li>', '</li>\n</ul>'), title: 'Sırasız Liste' },
    { icon: Quote, action: () => insertAtCursor('\n<blockquote>\n  ', '\n</blockquote>\n'), title: 'Alıntı' },
    { icon: AlignLeft, action: () => insertAtCursor('<div class="text-left">', '</div>'), title: 'Sola Hizala' },
    { icon: AlignCenter, action: () => insertAtCursor('<div class="text-center">', '</div>'), title: 'Ortala' },
    { icon: AlignRight, action: () => insertAtCursor('<div class="text-right">', '</div>'), title: 'Sağa Hizala' },
  ];

  return (
    <div className="min-h-screen bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/admin/blog')}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Geri Dön</span>
            </button>
            <h1 className="text-2xl font-bold">Yeni Blog Yazısı</h1>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className="flex items-center space-x-2 px-4 py-2 bg-dark-light border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span>{previewMode ? 'Düzenleme Modu' : 'Önizleme'}</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <div className="flex items-center space-x-2 text-red-500">
              <AlertCircle className="w-5 h-5" />
              <p>{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={(e) => handleSubmit(e, 'draft')} className="space-y-8">
          <div className="grid grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="col-span-2 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-2">Başlık</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full bg-dark-light border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-primary"
                  placeholder="Blog yazısı başlığı"
                  required
                />
              </div>

              {/* Content Editor */}
              <div>
                <label className="block text-sm font-medium mb-2">İçerik</label>
                <div className="bg-dark-light border border-white/10 rounded-lg overflow-hidden">
                  {/* Toolbar */}
                  <div className="flex flex-wrap gap-1 p-2 bg-white/5 border-b border-white/10">
                    {formatButtons.map((button, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={button.action}
                        className="p-2 hover:bg-white/10 rounded transition-colors"
                        title={button.title}
                      >
                        <button.icon className="w-4 h-4" />
                      </button>
                    ))}
                    <label className="p-2 hover:bg-white/10 rounded transition-colors cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={uploading}
                      />
                      <ImagePlus className="w-4 h-4" />
                    </label>
                  </div>

                  {/* Editor/Preview */}
                  {previewMode ? (
                    <div 
                      className="prose prose-invert max-w-none p-4"
                      dangerouslySetInnerHTML={{ __html: formData.content }}
                    />
                  ) : (
                    <textarea
                      ref={contentRef}
                      name="content"
                      value={formData.content}
                      onChange={handleChange}
                      className="w-full bg-transparent px-4 py-3 focus:outline-none min-h-[600px] font-mono"
                      placeholder="Blog yazısı içeriği..."
                      required
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Cover Image */}
              <div>
                <label className="block text-sm font-medium mb-2">Kapak Görseli</label>
                <div className="space-y-4">
                  {formData.image_url && (
                    <img
                      src={formData.image_url}
                      alt="Preview"
                      className="w-full aspect-video object-cover rounded-lg"
                    />
                  )}
                  <div className="flex items-center space-x-4">
                    <label className="flex-1">
                      <input
                        type="file"
                        name="coverImage"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={uploading}
                      />
                      <div className="flex items-center justify-center px-4 py-3 bg-primary/10 hover:bg-primary/20 transition-colors rounded-lg cursor-pointer">
                        <Image className="w-5 h-5 mr-2" />
                        <span>{uploading ? 'Yükleniyor...' : 'Kapak Görseli Seç'}</span>
                      </div>
                    </label>
                    {formData.image_url && (
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                        className="px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
                      >
                        Görseli Kaldır
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-medium mb-2">Özet</label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  className="w-full bg-dark-light border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-primary"
                  rows={3}
                  placeholder="Blog yazısının kısa özeti..."
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium mb-2">Kategori</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-dark-light border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-primary"
                  required
                >
                  <option value="">Kategori Seçin</option>
                  <option value="Teknoloji">Teknoloji</option>
                  <option value="Tasarım">Tasarım</option>
                  <option value="Yapay Zeka">Yapay Zeka</option>
                  <option value="Web Geliştirme">Web Geliştirme</option>
                  <option value="Mobil">Mobil</option>
                </select>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium mb-2">Etiketler</label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="w-full bg-dark-light border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-primary"
                  placeholder="Etiketleri virgülle ayırın..."
                />
              </div>

              {/* Read Time */}
              <div>
                <label className="block text-sm font-medium mb-2">Okuma Süresi</label>
                <input
                  type="text"
                  name="read_time"
                  value={formData.read_time}
                  onChange={handleChange}
                  className="w-full bg-dark-light border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-primary"
                  placeholder="örn: 5 dk"
                  required
                />
              </div>

              {/* Actions */}
              <div className="flex flex-col space-y-4 sticky top-4">
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e, 'publish')}
                  disabled={saving}
                  className="w-full bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <Save className="w-5 h-5" />
                  <span>{saving ? 'Kaydediliyor...' : 'Yayına Al'}</span>
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-dark-light border border-white/10 hover:bg-white/5 px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
                >
                  Taslak Olarak Kaydet
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewBlogPost;