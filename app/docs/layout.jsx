export const metadata = {
  title: 'Documentation - Cod3Black Agency',
};

export default function DocsLayout({ children }) {
  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 bg-white border-b border-gray-200 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <a href="/" className="text-blue-600 hover:underline text-sm">
            ← Back to Home
          </a>
        </div>
      </nav>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <article className="prose prose-sm md:prose max-w-none">
          {children}
        </article>
      </div>
    </div>
  );
}
