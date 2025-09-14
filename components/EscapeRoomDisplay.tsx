import React, { useState } from 'react';
import type { EscapeRoom, Mission } from '../types';
import MissionCard from './MissionCard';
import { BookIcon } from './icons';

interface EscapeRoomDisplayProps {
  data: EscapeRoom;
  onGenerateImage: (missionId: number, prompt: string) => void;
  onPrintMission: (mission: Mission) => void;
  onGenerateStorybook: () => void;
  isStorybookLoading: boolean;
  printSize: 'A4' | 'A5';
  onPrintSizeChange: (size: 'A4' | 'A5') => void;
}

const EscapeRoomDisplay: React.FC<EscapeRoomDisplayProps> = ({ 
  data, 
  onGenerateImage, 
  onPrintMission, 
  onGenerateStorybook, 
  isStorybookLoading,
  printSize,
  onPrintSizeChange 
}) => {
  const [showFinalSolution, setShowFinalSolution] = useState(false);

  return (
    <div className="mt-10 space-y-8">
      <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
        <h2 className="text-4xl font-extrabold text-slate-800 text-center tracking-tight">{data.title}</h2>
        <p className="mt-4 text-lg text-slate-600 whitespace-pre-wrap">{data.story}</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
        <h3 className="text-xl font-bold text-slate-800 mb-3">인쇄 설정</h3>
        <div className="flex items-center space-x-4">
          <p className="text-slate-600 font-semibold">미션 카드 크기:</p>
          <div className="flex gap-4">
            <label className="flex items-center space-x-2 cursor-pointer p-2 rounded-md hover:bg-gray-100">
              <input type="radio" name="printSize" value="A4" checked={printSize === 'A4'} onChange={() => onPrintSizeChange('A4')} className="form-radio text-indigo-600 h-5 w-5 focus:ring-indigo-500"/>
              <span className="font-medium">A4</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer p-2 rounded-md hover:bg-gray-100">
              <input type="radio" name="printSize" value="A5" checked={printSize === 'A5'} onChange={() => onPrintSizeChange('A5')} className="form-radio text-indigo-600 h-5 w-5 focus:ring-indigo-500"/>
              <span className="font-medium">A4 절반 (A5)</span>
            </label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {data.missions.map((mission) => (
          <MissionCard
            key={mission.id}
            mission={mission}
            onGenerateImage={onGenerateImage}
            onPrint={onPrintMission}
          />
        ))}
      </div>
      
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white p-8 rounded-xl shadow-2xl border-4 border-amber-400">
        <h2 className="text-3xl font-extrabold text-center tracking-tight text-amber-300">최종 도전</h2>
        <p className="mt-4 text-lg text-slate-300 whitespace-pre-wrap text-center">{data.finalPuzzle}</p>
        <div className="mt-6 text-center">
            <button onClick={() => setShowFinalSolution(!showFinalSolution)} className="font-semibold text-amber-400 hover:text-amber-200 transition-colors duration-200">
                {showFinalSolution ? '정답 숨기기' : '최종 정답 보기'}
            </button>
            {showFinalSolution && (
                <p className="mt-2 p-3 bg-green-900/50 border-2 border-green-500 text-green-200 rounded-lg font-mono text-xl tracking-widest animate-pulse">
                {data.finalSolution}
                </p>
            )}
        </div>
      </div>

      <div className="text-center pt-6">
        <button
          onClick={onGenerateStorybook}
          disabled={isStorybookLoading}
          className="inline-flex items-center justify-center bg-purple-600 text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:shadow-xl hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-50 transition-all duration-300 disabled:bg-slate-400 disabled:cursor-not-allowed transform hover:-translate-y-1 disabled:transform-none"
        >
          <BookIcon />
          {isStorybookLoading ? '이야기 작성 중...' : '스토리북 요약 만들기'}
        </button>
      </div>
    </div>
  );
};

export default EscapeRoomDisplay;