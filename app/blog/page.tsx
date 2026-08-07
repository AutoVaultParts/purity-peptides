import Link from "next/link";
import Reveal from "@/components/Reveal";
import { blogPosts } from "@/lib/blog";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Blog",
  description: "Educational articles on peptide fundamentals, storage, and quality, written in plain language.",
  path: "/blog",
});

export default function BlogPage() {
  return (
    <div>
      <div className="bg-ink px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-4 font-display text-3xl font-medium text-white sm:text-4xl">
            The <span className="text-sky">Blog</span>
          </h1>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-gray-400">
            Plain-language articles on peptide fundamentals, storage, and how to evaluate quality, updated regularly.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-14">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {blogPosts.map((post, i) => (
            <Reveal key={post.slug} delay={i * 60}>
              <Link
                href={`/blog/${post.slug}`}
                className="block h-full rounded-card border border-gray-200 p-6 transition-all hover:-translate-y-1 hover:border-sky hover:shadow-lg"
              >
                <div className="mb-3 flex items-center gap-2 text-xs">
                  <span className="rounded-full bg-sky-bg px-2.5 py-1 font-semibold text-sky">{post.category}</span>
                  <span className="text-gray-400">{post.readTime}</span>
                </div>
                <h2 className="mb-2 font-heading text-lg font-semibold text-ink">{post.title}</h2>
                <p className="text-sm leading-relaxed text-gray-500">{post.excerpt}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}