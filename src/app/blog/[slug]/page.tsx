import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts } from "@/data/blog";

// Add generateStaticParams so it statically generates these routes
export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post = blogPosts.find((p) => p.slug === resolvedParams.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="pt-32 pb-24 w-full flex flex-col items-center min-h-screen">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        
        <Link 
          href="/blog"
          className="inline-flex items-center gap-2 text-secondary hover:text-accent font-sans text-xs tracking-widest uppercase transition-colors mb-12"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Journal
        </Link>

        {/* Header */}
        <header className="mb-12 text-center">
          <div className="text-accent font-sans tracking-widest text-xs uppercase mb-4 font-semibold">
            {post.category} &bull; {post.date}
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-primary uppercase tracking-wide mb-8 leading-tight">
            {post.title}
          </h1>
        </header>

        {/* Hero Image */}
        <div className="relative aspect-video w-full overflow-hidden border border-border mb-16">
          <Image 
            src={post.image} 
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Content */}
        <div dangerouslySetInnerHTML={{ __html: post.content }} className="
          font-sans font-light leading-relaxed text-secondary text-lg space-y-6
          [&>h2]:font-heading [&>h2]:text-3xl [&>h2]:text-primary [&>h2]:uppercase [&>h2]:tracking-wide [&>h2]:mt-12 [&>h2]:mb-6
          [&>p]:mb-6
          [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6 [&>ul>li]:mb-2
          [&>ul>li>strong]:text-primary [&>ul>li>strong]:font-medium
          [&>p>strong]:text-primary [&>p>strong]:font-medium
        " />
      </div>
    </article>
  );
}
