import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts } from "@/lib/blog";
import { buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((p) => p.slug === params.slug);
  return buildMetadata({
    title: post?.title,
    description: post?.excerpt,
    path: `/blog/${params.slug}`,
  });
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((p) => p.slug === params.slug);
  if (!post) return notFound();

  return (
    <article className="mx-auto max-w-2xl px-6 py-16">
      <nav className="mb-8 text-xs text-gray-500">
        <Link href="/blog" className="hover:text-sky">Blog</Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{post.title}</span>
      </nav>

      <div className="mb-6 flex items-center gap-2 text-xs">
        <span className="rounded-full bg-sky-bg px-2.5 py-1 font-semibold text-sky">{post.category}</span>
        <span className="text-gray-400">{post.readTime}</span>
      </div>

      <h1 className="mb-8 font-display text-3xl font-medium text-ink md:text-4xl">{post.title}</h1>

      <div className="space-y-5">
        {post.body.map((paragraph, i) => (
          <p key={i} className="text-sm leading-relaxed text-gray-600">
            {paragraph}
          </p>
        ))}
      </div>

      <div className="mt-12 rounded-card border border-sky-light/40 bg-sky-bg p-6 text-center">
        <p className="mb-4 text-sm text-gray-600">Have a question this article didn&apos;t answer?</p>
        <Link href="/faq" className="inline-block rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white hover:bg-sky">
          Visit our FAQ
        </Link>
      </div>
    </article>
  );
}