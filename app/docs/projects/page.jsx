import fs from 'fs';
import path from 'path';

export const metadata = {
  title: 'Case Studies - Cod3Black Agency',
  description: 'Real projects with problem, solution, and actual results',
};

export default function ProjectsPage() {
  const filePath = path.join(process.cwd(), 'docs/PROJECTS_DEEP_DIVE.md');
  const markdown = fs.readFileSync(filePath, 'utf8');

  return (
    <div className="prose prose-sm md:prose max-w-none">
      <h1>Case Studies & Deep Dives</h1>
      <div className="whitespace-pre-wrap text-gray-700">
        {markdown.split('\n').map((line, i) => {
          if (line.startsWith('# ')) {
            return <h1 key={i} className="text-4xl font-bold mt-6 mb-4">{line.slice(2)}</h1>;
          }
          if (line.startsWith('## ')) {
            return <h2 key={i} className="text-2xl font-bold mt-4 mb-2">{line.slice(3)}</h2>;
          }
          if (line.startsWith('### ')) {
            return <h3 key={i} className="text-xl font-semibold mt-3 mb-2">{line.slice(4)}</h3>;
          }
          if (line.startsWith('- ')) {
            return <li key={i} className="ml-4 mb-1">{line.slice(2)}</li>;
          }
          if (line.trim() === '') {
            return <br key={i} />;
          }
          return <p key={i} className="mb-2">{line}</p>;
        })}
      </div>
    </div>
  );
}
