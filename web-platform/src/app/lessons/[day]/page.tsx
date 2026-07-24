import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import LessonActions from '@/components/LessonActions';
import Link from 'next/link';
import { Lock, ArrowLeft, BookOpen } from 'lucide-react';

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
      <div className="min-h-screen bg-[#070B13] p-8 text-slate-200 flex flex-col justify-center items-center">
        <div className="max-w-md w-full p-8 border border-slate-800 bg-[#0C1220] text-center space-y-6 rounded-xl shadow-lg">
          <div className="flex justify-center">
            <Lock className="w-16 h-16 text-rose-500 animate-pulse" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-white">Access Denied</h1>
            <p className="text-xs uppercase tracking-wider text-rose-500 font-bold">Lesson Currently Locked</p>
          </div>

          <p className="text-sm text-slate-400 leading-relaxed">
            Day {day} is currently under construction or locked. Complete your current daily labs in sequence and check back soon.
          </p>

          <div className="pt-4 border-t border-slate-800/60">
            <Link href="/" className="w-full">
              <button className="w-full btn-primary text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>Return to Dashboard</span>
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
    <div className="min-h-screen bg-[#070B13] p-8 text-slate-300 font-sans relative">
      <div className="max-w-3xl mx-auto space-y-8 relative">

        {/* Navigation & Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link href="/">
            <button className="flex items-center gap-2 text-xs border border-slate-800 hover:border-slate-700 hover:bg-slate-800/50 py-2 px-3.5 rounded-md transition-all text-slate-400 hover:text-white font-semibold">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>
          </Link>
          <span className="text-[10px] font-bold border border-emerald-500/30 px-2.5 py-1 uppercase rounded text-emerald-400 bg-emerald-500/5">
            Active Mission
          </span>
        </div>

        {/* Premium Header */}
        <header className="border-b border-slate-800/80 pb-6 space-y-4">
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Day {String(data.day).padStart(2, '0')} Lesson</span>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">{data.title}</h1>
          </div>

          <div className="flex flex-wrap gap-2.5 text-xs">
            <span className="bg-slate-900 border border-slate-800 text-slate-400 px-2.5 py-1 rounded-md font-medium">
              Phase: <strong className="text-slate-200">{data.phase}</strong>
            </span>
            <span className="bg-slate-900 border border-slate-800 text-slate-400 px-2.5 py-1 rounded-md font-medium">
              Topic: <strong className="text-slate-200">{data.topic}</strong>
            </span>
            <span className="bg-slate-900 border border-slate-800 text-slate-400 px-2.5 py-1 rounded-md font-medium">
              Difficulty: <strong className="text-slate-200">{data.difficulty}</strong>
            </span>
          </div>
        </header>

        {/* Custom SaaS MDX Renderer Content */}
        <article className="max-w-none text-slate-300 font-sans">
          <MarkdownRenderer content={content} />
        </article>

        {/* Dynamic Interactive Actions Block */}
        <LessonActions dayNumber={dayNumber} />
      </div>
    </div>
  );
}
