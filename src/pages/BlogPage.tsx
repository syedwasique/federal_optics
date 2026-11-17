import React from 'react';
import { SEO } from '../components/SEO';
import { useNavigation } from '../context/NavigationContext';
import { ArrowRight } from 'lucide-react';

export const BlogPage: React.FC = () => {
  const { openCategory } = useNavigation();

  const BLOG_POSTS = [
    {
      id: 'post-1',
      title: 'How to Choose the Right Eyeglass Frame for South Asian Facial Features',
      excerpt:
        'A comprehensive guide from our master opticians on bridge width, pantoscopic tilt, and temple length for optimal balance and zero bridge slipping.',
      date: 'February 2025',
      readTime: '4 min read',
      category: 'Fitting Guide',
      image: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 'post-2',
      title: 'Digital Eye Strain & 420nm Blue Light: What Medical Research Actually Shows',
      excerpt:
        'Why long hours in front of screens cause ciliary muscle spasm, and how computerized blue-shield lenses protect contrast sensitivity.',
      date: 'January 2025',
      readTime: '6 min read',
      category: 'Optical Health',
      image: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 'post-3',
      title: 'Adapting to Progressive Lenses: 5 Tips for First-Time Multi-Focal Wearers',
      excerpt:
        'Understanding intermediate corridors, turning your head instead of your eyes, and why customized German digital surfacing makes adaptation instantaneous.',
      date: 'December 2024',
      readTime: '5 min read',
      category: 'Vision Care',
      image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800&auto=format&fit=crop'
    }
  ];

  return (
    <div className="site-container py-10 md:py-16 space-y-12">
      <SEO
        title="Optical Journal — Eyewear Style & Vision Care Articles"
        description="Read optical guides, eyewear fitting advice, and medical eyecare insights from Federal Optical’s master opticians and clinical staff in Karachi."
        canonical="/blog"
      />
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-[#8C7048]">
          The Federal Optical Journal
        </span>
        <h1 className="font-heading text-3xl sm:text-5xl font-semibold text-stone-900">
          Vision, Style & Eyecare Insights
        </h1>
        <p className="text-stone-600 text-xs sm:text-sm">
          Articles, optical care advice, and styling tips from our Karachi family opticians and clinical staff.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {BLOG_POSTS.map(post => (
          <article
            key={post.id}
            className="bg-white rounded-3xl overflow-hidden border border-[#E8E3D8] hover:border-[#C5A880]/60 hover:shadow-xl transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="aspect-16/10 overflow-hidden bg-stone-100">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between text-[11px] text-stone-500">
                  <span className="font-bold text-[#8C7048] uppercase tracking-wider">
                    {post.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>
                </div>

                <h3 className="font-heading text-lg font-semibold text-stone-900 group-hover:text-[#8C7048] transition-colors leading-snug">
                  {post.title}
                </h3>

                <p className="text-xs text-stone-600 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
            </div>

            <div className="p-6 pt-0 border-t border-[#E8E3D8]/60 mt-4">
              <button
                onClick={() => openCategory('eyeglasses')}
                className="text-xs font-bold text-[#8C7048] group-hover:text-stone-900 transition-colors inline-flex items-center gap-1 mt-3"
              >
                <span>Explore Related Frames</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
