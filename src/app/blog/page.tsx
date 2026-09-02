import Image from "next/image";
import Link from "next/link";
import { blogPosts } from "@/data/blog";

export default function BlogIndex() {
  return (
    <div className="pt-32 pb-24 w-full flex flex-col items-center min-h-screen">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        
        {/* Header */}
        <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <h3 className="text-accent font-sans tracking-widest text-xs uppercase mb-4 font-semibold">Tattoo Culture</h3>
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-primary uppercase tracking-wider mb-6">
            The Journal
          </h1>
          <div className="w-16 h-1 bg-accent mx-auto mb-6"></div>
          <p className="text-secondary font-sans font-light max-w-2xl mx-auto text-lg">
            Discover the inspiration, craftsmanship, and history behind authentic handpoke tattoos in Bali.
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {blogPosts.map((post) => (
            <Link 
              key={post.slug} 
              href={`/blog/${post.slug}`}
              className="group flex flex-col h-full bg-surface/50 border border-border hover:border-accent/50 transition-all duration-500 rounded-sm overflow-hidden"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image 
                  src={post.image} 
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute top-4 left-4 bg-primary/90 backdrop-blur px-3 py-1 text-[10px] font-sans tracking-widest uppercase text-accent border border-border">
                  {post.category}
                </div>
              </div>
              
              <div className="p-6 md:p-8 flex flex-col flex-grow">
                <span className="text-secondary/60 font-sans text-xs mb-3 block">{post.date}</span>
                <h2 className="font-heading text-2xl text-primary mb-4 group-hover:text-accent transition-colors">
                  {post.title}
                </h2>
                <p className="text-secondary font-sans font-light text-sm leading-relaxed mb-6 flex-grow">
                  {post.excerpt}
                </p>
                
                <div className="mt-auto inline-flex items-center gap-2 text-accent font-sans font-semibold tracking-widest uppercase text-xs">
                  Read Article
                  <svg className="w-4 h-4 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
