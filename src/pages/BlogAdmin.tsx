import React, { useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { createBlogPost, uploadImage, updateBlogPost, type BlogPost } from '../lib/config/supabase';
import { 
  Image, ArrowLeft, Bold, Italic, Link as LinkIcon, Code, 
  ListOrdered, List, Heading2, ImagePlus, Undo, Redo,
  AlignLeft, AlignCenter, AlignRight, Quote, Eye, Save, Upload, X, Check
} from 'lucide-react';
import DOMPurify from 'dompurify';

interface BlogAdminProps {
  post?: BlogPost | null;
  onCancel?: () => void;
  onSuccess?: () => void;
}

const BlogAdmin = ({ post, onCancel, onSuccess }: BlogAdminProps) => {
  const { t, i18n } = useTranslation();
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const [formData, setFormData] = useState({
    title: post?.title || '',
    slug: post?.slug || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    image_url: post?.image_url || '',
    category: post?.category || 'blog.category.technology',
    tags: post?.tags?.join(', ') || '',
    author_id: post?.author?.id || 'a52c1934-0c96-4c44-9567-97c36ce7e042',
    read_time: post?.read_time || t('blog.admin.default_read_time'),
    published: post?.published || false
  });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      .substring(0, 100);
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
        insertAtCursor(`<img src="${imageUrl}" alt="${t('blog.admin.blog_image_alt')}" class="w-full rounded-lg shadow-lg my-8" />`);
      }
    } catch (error) {
      console.error(t('blog.admin.image_upload_error_log'), error);
      setError(t('blog.admin.image_upload_error'));
    } finally {
      setUploading(false);
    }
  };

  const insertAtCursor = (text: string) => {
    if (contentRef.current) {
      const start = contentRef.current.selectionStart;
      const end = contentRef.current.selectionEnd;
      const currentContent = formData.content;
      const newContent = currentContent.substring(0, start) + text + currentContent.substring(end);
      setFormData(prev => ({ ...prev, content: newContent }));
      
      setTimeout(() => {
        contentRef.current?.focus();
        contentRef.current?.setSelectionRange(start + text.length, start + text.length);
      }, 0);
    }
  };

  const handleSubmit = async (e: React.FormEvent, shouldPublish: boolean) => {
    e.preventDefault();
    setError(null);

    try {
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);
      
      // Slug oluşturma
      let slugToUse = formData.slug.trim() 
        ? generateSlug(formData.slug) 
        : generateSlug(formData.title);

      // Eğer slug boşsa veya çakışma ihtimaline karşı timestamp ekle (yeni post ise)
      if (!post?.id && !formData.slug.trim()) {
        slugToUse = `${slugToUse}-${Date.now().toString(36)}`;
      }

      const postData = {
        title: formData.title,
        slug: slugToUse,
        excerpt: formData.excerpt,
        content: formData.content,
        image_url: formData.image_url,
        category: formData.category,
        tags: tagsArray,
        author_id: formData.author_id,
        read_time: formData.read_time,
        published: shouldPublish
      };

      if (post?.id) {
        await updateBlogPost(post.id, postData);
        alert(t('blog.admin.update_success'));
      } else {
        await createBlogPost(postData);
        alert(t('blog.admin.create_success'));
      }
      
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error(t('blog.admin.save_error_log'), error);
      setError(error.message || t('blog.admin.generic_error'));
    }
  };

  const ToolbarButton = ({ icon: Icon, label, action }: { icon: any, label: string, action: () => void }) => (
    <button
      type="button"
      onClick={action}
      className="p-2 text-slate-600 dark:text-gray-300 hover:text-primary hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors"
      title={label}
    >
      <Icon className="w-5 h-5" />
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-dark-light border-b border-slate-200 dark:border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={onCancel} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-slate-600 dark:text-gray-300" />
          </button>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            {post ? t('blog.admin.edit_post') : t('blog.admin.new_post')}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              previewMode 
                ? 'bg-primary/10 text-primary' 
                : 'text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5'
            }`}
          >
            <Eye className="w-5 h-5" />
            {previewMode ? t('blog.admin.back_to_edit') : t('blog.admin.preview')}
          </button>
          <button
            onClick={(e) => handleSubmit(e, false)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white rounded-lg font-medium hover:bg-slate-300 dark:hover:bg-white/20 transition-colors"
          >
            <Save className="w-5 h-5" />
            {t('blog.admin.save_draft')}
          </button>
          <button
            onClick={(e) => handleSubmit(e, true)}
            className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25"
          >
            <Upload className="w-5 h-5" />
            {t('blog.admin.publish')}
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Editor Section */}
        <div className={`flex-1 overflow-y-auto p-8 transition-all duration-300 ${previewMode ? 'hidden' : 'block'}`}>
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Cover Image Upload */}
            <div className="relative group aspect-video bg-slate-100 dark:bg-white/5 rounded-2xl border-2 border-dashed border-slate-300 dark:border-white/10 overflow-hidden hover:border-primary transition-colors">
              {formData.image_url ? (
                <>
                  <img src={formData.image_url} alt="Cover" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <label className="cursor-pointer px-6 py-3 bg-white text-slate-900 rounded-full font-bold hover:scale-105 transition-transform">
                      {t('blog.admin.change_image')}
                      <input type="file" name="coverImage" onChange={handleImageUpload} className="hidden" accept="image/*" />
                    </label>
                  </div>
                </>
              ) : (
                <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer">
                  <ImagePlus className="w-12 h-12 text-slate-400 mb-4" />
                  <span className="text-slate-500 font-medium">{t('blog.admin.upload_cover')}</span>
                  <span className="text-xs text-slate-400 mt-2">{t('blog.admin.image_format')}</span>
                  <input type="file" name="coverImage" onChange={handleImageUpload} className="hidden" accept="image/*" />
                </label>
              )}
              {uploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>

            {/* Meta Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-gray-300">{t('blog.admin.title')}</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder={t('blog.admin.title_placeholder')}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-gray-300">{t('blog.admin.slug')}</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-primary outline-none transition-all font-mono text-sm"
                  placeholder={t('blog.admin.slug_placeholder')}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-gray-300">{t('blog.admin.category')}</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-primary outline-none transition-all"
                >
                  <option value="blog.category.technology">{t('blog.category.technology')}</option>
                  <option value="blog.category.design">{t('blog.category.design')}</option>
                  <option value="blog.category.ai">{t('blog.category.ai')}</option>
                  <option value="blog.category.webDevelopment">{t('blog.category.webDevelopment')}</option>
                  <option value="blog.category.mobile">{t('blog.category.mobile')}</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-gray-300">{t('blog.admin.excerpt')}</label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                  placeholder={t('blog.admin.excerpt_placeholder')}
                />
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-gray-300">{t('blog.admin.tags')}</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-primary outline-none transition-all"
                    placeholder={t('blog.admin.tags_placeholder')}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-gray-300">{t('blog.admin.read_time')}</label>
                  <input
                    type="text"
                    value={formData.read_time}
                    onChange={(e) => setFormData({ ...formData, read_time: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-primary outline-none transition-all"
                    placeholder={t('blog.admin.read_time_placeholder')}
                  />
                </div>
              </div>
            </div>

            {/* Content Editor */}
            <div className="bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
              <div className="flex items-center gap-1 p-2 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 overflow-x-auto">
                <ToolbarButton icon={Heading2} label={t('blog.admin.toolbar.h2')} action={() => insertAtCursor(`<h2>${t('blog.admin.insert.h2')}</h2>`)} />
                <ToolbarButton icon={Bold} label={t('blog.admin.toolbar.bold')} action={() => insertAtCursor(`<strong>${t('blog.admin.insert.bold')}</strong>`)} />
                <ToolbarButton icon={Italic} label={t('blog.admin.toolbar.italic')} action={() => insertAtCursor(`<em>${t('blog.admin.insert.italic')}</em>`)} />
                <div className="w-px h-6 bg-slate-300 dark:bg-white/10 mx-2" />
                <ToolbarButton icon={List} label={t('blog.admin.toolbar.list')} action={() => insertAtCursor(`<ul>\n  <li>${t('blog.admin.insert.list')}</li>\n</ul>`)} />
                <ToolbarButton icon={ListOrdered} label={t('blog.admin.toolbar.ordered_list')} action={() => insertAtCursor(`<ol>\n  <li>${t('blog.admin.insert.ordered_list')}</li>\n</ol>`)} />
                <ToolbarButton icon={Quote} label={t('blog.admin.toolbar.quote')} action={() => insertAtCursor(`<blockquote>${t('blog.admin.insert.quote')}</blockquote>`)} />
                <ToolbarButton icon={Code} label={t('blog.admin.toolbar.code')} action={() => insertAtCursor(`<pre><code>${t('blog.admin.insert.code')}</code></pre>`)} />
                <div className="w-px h-6 bg-slate-300 dark:bg-white/10 mx-2" />
                <ToolbarButton icon={LinkIcon} label={t('blog.admin.toolbar.link')} action={() => insertAtCursor(`<a href="url">${t('blog.admin.insert.link')}</a>`)} />
                <label className="p-2 text-slate-600 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors cursor-pointer" title={t('blog.admin.toolbar.image')}>
                  <Image className="w-5 h-5" />
                  <input type="file" onChange={handleImageUpload} className="hidden" accept="image/*" />
                </label>
              </div>
              <textarea
                ref={contentRef}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full h-[600px] p-6 bg-transparent outline-none font-mono text-sm leading-relaxed resize-none text-slate-900 dark:text-white"
                placeholder={t('blog.admin.content_placeholder')}
              />
            </div>
          </div>
        </div>

        {/* Preview Section */}
        {previewMode && (
          <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-dark">
            <div className="relative h-[400px] w-full overflow-hidden">
              <img src={formData.image_url || 'https://via.placeholder.com/1920x1080'} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-slate-50 dark:to-dark" />
              <div className="absolute inset-0 flex flex-col justify-end pb-12 px-8 max-w-4xl mx-auto">
                <span className="inline-block px-4 py-1.5 bg-primary/90 text-white text-sm font-bold rounded-full backdrop-blur-sm w-fit mb-4">
                  {formData.category}
                </span>
                <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight drop-shadow-lg mb-4">
                  {formData.title || t('blog.admin.preview_title')}
                </h1>
                <div className="flex items-center gap-4 text-white/90">
                  <span>{formData.read_time}</span>
                  <span>•</span>
                  <span>{new Date().toLocaleDateString(i18n.language === 'tr' ? 'tr-TR' : 'en-US')}</span>
                </div>
              </div>
            </div>
            <div className="max-w-4xl mx-auto px-8 py-12">
              <div 
                className="prose prose-lg dark:prose-invert max-w-none
                  prose-headings:font-bold prose-headings:tracking-tight
                  prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
                  prose-p:text-slate-600 dark:prose-p:text-gray-300 prose-p:leading-relaxed
                  prose-img:rounded-2xl prose-img:shadow-lg"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(formData.content) }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogAdmin;