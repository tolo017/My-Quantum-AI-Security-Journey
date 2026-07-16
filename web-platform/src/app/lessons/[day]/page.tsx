import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Challenge from '@/components/Challenge';

const components = {
  Challenge,
};

export async function generateStaticParams() {
  const lessonsDirectory = path.join(process.cwd(), 'src/content/lessons');
  const filenames = fs.readdirSync(lessonsDirectory);

  return filenames.map((filename) => ({
    day: filename.replace(/\.mdx$/, '').replace('day-', ''),
  }));
}

export default async function LessonPage({ params }: { params: Promise<{ day: string }> }) {
  const resolvedParams = await params;
  const { day } = resolvedParams;
  const filePath = path.join(process.cwd(), `src/content/lessons/day-${day.padStart(2, '0')}.mdx`);
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { content, data } = matter(fileContent);

  return (
    <div className="min-h-screen bg-cyber-dark p-8 text-cyber-green max-w-3xl mx-auto space-y-8">
      <header className="border-b border-cyber-green/30 pb-4">
        <h1 className="text-4xl font-bold uppercase tracking-widest">{data.title}</h1>
        <div className="flex gap-4 text-xs opacity-60 mt-2">
          <span>DAY: {data.day}</span>
          <span>PHASE: {data.phase}</span>
          <span>DIFFICULTY: {data.difficulty}</span>
        </div>
      </header>

      <article className="prose prose-invert prose-green max-w-none">
        <MDXRemote source={content} components={components} />
      </article>

      <footer className="pt-8 border-t border-cyber-green/20">
        <button className="neon-button w-full">COMPLETE & SUBMIT TO GITHUB</button>
      </footer>
    </div>
  );
}
