import React, { useState } from 'react';
import type { Mission } from '../types';
import { PrintIcon, ImageIcon } from './icons';
import Spinner from './Spinner';

interface MissionCardProps {
  mission: Mission;
  onGenerateImage: (missionId: number, prompt: string) => void;
  onPrint: (mission: Mission) => void;
}

const MissionCard: React.FC<MissionCardProps> = ({ mission, onGenerateImage, onPrint }) => {
  const [showSolution, setShowSolution] = useState(false);
  const [imagePrompt, setImagePrompt] = useState('');

  const handleImageGeneration = () => {
    if (imagePrompt.trim()) {
      onGenerateImage(mission.id, imagePrompt);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 transition-shadow hover:shadow-2xl">
      <div className="flex justify-between items-start">
        <h3 className="text-2xl font-bold text-indigo-800 mb-3">{mission.id}. {mission.title}</h3>
        <button
          onClick={() => onPrint(mission)}
          className="flex items-center bg-slate-200 text-slate-800 font-semibold py-2 px-4 rounded-lg hover:bg-slate-300 transition duration-300"
        >
          <PrintIcon />
          미션 카드 인쇄
        </button>
      </div>

      <p className="text-slate-700 mb-4 whitespace-pre-wrap">{mission.puzzle}</p>

      <div className="space-y-4 mt-6">
        <div>
          <button onClick={() => setShowSolution(!showSolution)} className="font-semibold text-indigo-600 hover:text-indigo-800">
            {showSolution ? '숨기기' : '정답 보기'}
          </button>
          {showSolution && (
            <p className="mt-2 p-3 bg-green-100 border-l-4 border-green-500 text-green-800 rounded-r-lg">
              {mission.solution}
            </p>
          )}
        </div>
        <p className="p-3 bg-amber-100 border-l-4 border-amber-500 text-amber-800 rounded-r-lg">
          <strong>배치 팁:</strong> {mission.placement}
        </p>
      </div>

      <div className="mt-6 border-t pt-4">
        <label htmlFor={`image-prompt-${mission.id}`} className="block text-md font-semibold text-slate-700 mb-2">
          이 미션을 위한 이미지 생성 (선택 사항)
        </label>
        <div className="flex gap-2">
          <input
            id={`image-prompt-${mission.id}`}
            type="text"
            value={imagePrompt}
            onChange={(e) => setImagePrompt(e.target.value)}
            placeholder="예: 수학 문제를 푸는 만화 로봇"
            className="flex-grow p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            disabled={mission.isGeneratingImage}
          />
          <button
            onClick={handleImageGeneration}
            disabled={!imagePrompt.trim() || mission.isGeneratingImage}
            className="flex items-center bg-teal-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-600 transition disabled:bg-slate-400"
          >
            <ImageIcon />
            생성
          </button>
        </div>
        {mission.isGeneratingImage && <Spinner message="이미지 생성 중..." />}
        {mission.imageUrl && (
          <div className="mt-4 text-center">
             <img src={mission.imageUrl} alt="Generated for mission" className="rounded-lg shadow-md inline-block" />
          </div>
        )}
      </div>
    </div>
  );
};

export default MissionCard;