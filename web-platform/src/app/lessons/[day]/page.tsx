import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Challenge from '@/components/Challenge';
import LessonActions from '@/components/LessonActions';
import Link from 'next/link';
import { Lock, Terminal } from 'lucide-react';

const components = {
  Challenge,
};

export async function generateStaticParams() {
  try {
    const lessonsDirectory = path.join(process.cwd(), 'src/content/lessons');
    if (!fs.existsSync(lessonsDirectory)) return [];
    const filenames = fs.readdirSync(lessonsDirectory);

    return filenames.map((filename) => ({
      day: filename.replace(/\.mdx$/, '').replace('day-', ''),
    }));
  } catch (e) {
    return [];
  }
}

export default async function LessonPage({ params }: { params: Promise<{ day: string }> }) {
  const resolvedParams = await params;
  const { day } = resolvedParams;
  const dayNumber = parseInt(day, 10);
  const formattedDay = day.padStart(2, '0');

  const filePath = path.join(process.cwd(), `src/content/lessons/day-${formattedDay}.mdx`);

  let exists = false;
  try {
    exists = fs.existsSync(filePath);
  } catch (e) {
    exists = false;
  }

  // Gracefully handle locked or unwritten lesson files
  if (!exists) {
    return (
      <div className="min-h-screen bg-cyber-dark p-8 text-cyber-green flex flex-col justify-center items-center font-mono">
        <div className="absolute inset-0 bg-cyber-grid bg-[size:40px_40px] opacity-[0.05] pointer-events-none" />

        <div className="max-w-md w-full p-8 cyber-border bg-black/60 backdrop-blur-sm text-center space-y-6">
          <div className="flex justify-center">
            <Lock className="w-16 h-16 text-red-500 animate-pulse" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold uppercase tracking-wider text-white">ACCESS DENIED</h1>
            <p className="text-[10px] uppercase tracking-widest text-red-500 font-bold">SYSTEM LOCK IN EFFECT</p>
          </div>

          <p className="text-xs opacity-70 leading-relaxed">
            Day {day} is currently locked or under active development. Complete all current daily labs in sequence and verify your credentials.
          </p>

          <div className="pt-4 border-t border-cyber-green/20 flex flex-col gap-2">
            <Link href="/" className="w-full">
              <button className="neon-button w-full text-xs font-bold flex items-center justify-center gap-2">
                <Terminal className="w-4 h-4" />
                <span>RETURN TO TERMINAL</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { content, data } = matter(fileContent);

  return (
    <div className="min-h-screen bg-cyber-dark p-8 text-cyber-green font-mono relative">
      <div className="absolute inset-0 bg-cyber-grid bg-[size:40px_40px] opacity-[0.05] pointer-events-none" />

      <div className="max-w-3xl mx-auto space-y-8 relative">
        <header className="border-b border-cyber-green/30 pb-4">
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-black uppercase tracking-widest text-white">{data.title}</h1>
            <span className="text-[10px] font-bold border border-cyber-green/40 px-2 py-1 uppercase text-cyber-green bg-cyber-green/10">
              MISSION STATUS: ACTIVE
            </span>
          </div>

          <div className="flex gap-4 text-[10px] opacity-60 mt-3 font-bold tracking-wider">
            <span>DAY: {String(data.day).padStart(2, '0')}</span>
            <span>PHASE: {data.phase}</span>
            <span>TOPIC: {data.topic}</span>
            <span>DIFFICULTY: {data.difficulty}</span>
          </div>
        </header>

        <article className="prose prose-invert prose-green max-w-none text-sm leading-relaxed opacity-90 border-b border-cyber-green/10 pb-8">
          <MDXRemote source={content} components={components} />
        </article>

        {/* Client side actions block */}
        <LessonActions dayNumber={dayNumber} />
      </div>
    </div>
  );
}
