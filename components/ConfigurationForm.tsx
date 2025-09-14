import React, { useState } from 'react';
import { MagicWandIcon } from './icons';

interface ConfigurationFormProps {
  onGenerate: (content: string, grade: string, theme: string) => void;
  isLoading: boolean;
  apiKey: string;
  onApiKeyChange: (key: string) => void;
}

const ConfigurationForm: React.FC<ConfigurationFormProps> = ({ onGenerate, isLoading, apiKey, onApiKeyChange }) => {
  const [content, setContent] = useState('');
  const [grade, setGrade] = useState('5학년');
  const [theme, setTheme] = useState('미스터리');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() && apiKey.trim()) {
      onGenerate(content, grade, theme);
    }
  };

  const themes = ['미스터리', 'SF 어드벤처', '판타지 퀘스트', '공포', '감동적인 이야기', '유머 & 코미디'];
  const grades = Array.from({ length: 12 }, (_, i) => `${i + 1}학년`);

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="api-key" className="block text-lg font-semibold text-slate-800 mb-2">
            1. Gemini API 키 입력
          </label>
           <input
            id="api-key"
            type="password"
            value={apiKey}
            onChange={(e) => onApiKeyChange(e.target.value)}
            placeholder="여기에 API 키를 붙여넣으세요"
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
            required
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-lg font-semibold text-slate-800 mb-2">
            2. 학습 자료 붙여넣기
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="이야기, 단어 목록, 수학 문제, 역사적 사실 등 수업 내용을 여기에 붙여넣으세요..."
            className="w-full h-48 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="grade" className="block text-lg font-semibold text-slate-800 mb-2">
              3. 학년 선택
            </label>
            <select
              id="grade"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
            >
              {grades.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="theme" className="block text-lg font-semibold text-slate-800 mb-2">
              4. 테마 선택
            </label>
            <select
              id="theme"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
            >
              {themes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading || !content.trim() || !apiKey.trim()}
            className="w-full flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transition-all duration-300 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed transform hover:-translate-y-1 disabled:transform-none"
          >
            <MagicWandIcon />
            {isLoading ? '어드벤처 생성 중...' : '방탈출 게임 생성하기'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConfigurationForm;