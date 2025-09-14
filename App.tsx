import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import ConfigurationForm from './components/ConfigurationForm';
import EscapeRoomDisplay from './components/EscapeRoomDisplay';
import StorybookDisplay from './components/StorybookDisplay';
import Spinner from './components/Spinner';
import { generateEscapeRoom, generateImage, generateStorybook } from './services/geminiService';
import type { EscapeRoom, Mission } from './types';

function App() {
  const [apiKey, setApiKey] = useState<string>('');
  const [escapeRoomData, setEscapeRoomData] = useState<EscapeRoom | null>(null);
  const [storybookContent, setStorybookContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStorybookLoading, setIsStorybookLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [printSize, setPrintSize] = useState<'A4' | 'A5'>('A4');

  const handleGenerateEscapeRoom = useCallback(async (content: string, grade: string, theme: string) => {
    if (!apiKey) {
      setError("API 키를 입력해주세요.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setEscapeRoomData(null);
    setStorybookContent('');
    try {
      const data = await generateEscapeRoom(apiKey, content, grade, theme);
      setEscapeRoomData(data);
    } catch (e) {
      console.error(e);
      setError('방탈출 게임 생성에 실패했습니다. API 키를 확인하고 다시 시도해 주세요.');
    } finally {
      setIsLoading(false);
    }
  }, [apiKey]);

  const handleGenerateImage = useCallback(async (missionId: number, prompt: string) => {
    if (!apiKey) {
      setError("이미지를 생성하려면 API 키가 필요합니다.");
      return;
    }
    setEscapeRoomData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        missions: prev.missions.map(m => m.id === missionId ? { ...m, isGeneratingImage: true } : m)
      };
    });

    try {
      const imageUrl = await generateImage(apiKey, prompt);
      setEscapeRoomData(prev => {
        if (!prev) return null;
        return {
          ...prev,
          missions: prev.missions.map(m => m.id === missionId ? { ...m, imageUrl, isGeneratingImage: false } : m)
        };
      });
    } catch (e)
 {
      console.error(e);
      setError(`미션 ${missionId}의 이미지 생성에 실패했습니다. 다시 시도해 주세요.`);
      setEscapeRoomData(prev => {
        if (!prev) return null;
        return {
          ...prev,
          missions: prev.missions.map(m => m.id === missionId ? { ...m, isGeneratingImage: false } : m)
        };
      });
    }
  }, [apiKey]);

  const handleGenerateStorybook = useCallback(async () => {
    if (!escapeRoomData) return;
    if (!apiKey) {
      setError("스토리북을 생성하려면 API 키가 필요합니다.");
      return;
    }
    setIsStorybookLoading(true);
    setError(null);
    try {
      const grade = "학생"; // This could be dynamic in the future
      const story = await generateStorybook(apiKey, escapeRoomData, grade);
      setStorybookContent(story);
    } catch (e) {
      console.error(e);
      setError('스토리북 요약 생성에 실패했습니다.');
    } finally {
      setIsStorybookLoading(false);
    }
  }, [escapeRoomData, apiKey]);

  const handlePrintMission = (mission: Mission) => {
    const isA5 = printSize === 'A5';
    const content = `
      <div class="mission-card-print-wrapper">
        <div class="border-4 border-slate-800 p-8 rounded-2xl bg-amber-50 h-full flex flex-col justify-between font-sans">
          <div>
            <h2 class="text-4xl font-bold text-slate-900 mb-6 tracking-wide">${mission.title}</h2>
            <div class="text-xl text-slate-700 space-y-4 whitespace-pre-wrap">${mission.puzzle}</div>
            ${mission.imageUrl ? `<div class="text-center mt-8"><img src="${mission.imageUrl}" alt="Mission Image" class="mt-6 rounded-lg shadow-2xl max-w-full h-auto" /></div>` : ''}
          </div>
          <div class="text-center mt-10 text-md text-slate-500 font-mono">미션 #${mission.id}</div>
        </div>
      </div>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>미션 인쇄: ${mission.title}</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&display=swap" rel="stylesheet">
            <style>
              html, body {
                height: 100%;
                margin: 0;
                padding: 0;
                font-family: 'Noto Sans KR', sans-serif;
              }
              .mission-card-print-wrapper {
                width: 100%;
                height: 100%;
                padding: 2cm;
                box-sizing: border-box;
              }
              @media print {
                @page {
                  size: ${isA5 ? 'A5' : 'A4'};
                  margin: 0;
                }
                body {
                  -webkit-print-color-adjust: exact;
                  print-color-adjust: exact;
                }
              }
            </style>
          </head>
          <body>
            ${content}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    }
  };


  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <Header />
      <main>
        <ConfigurationForm 
          onGenerate={handleGenerateEscapeRoom} 
          isLoading={isLoading}
          apiKey={apiKey}
          onApiKeyChange={setApiKey} 
        />
        {error && (
          <div className="mt-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow" role="alert">
            <p className="font-bold">오류가 발생했습니다</p>
            <p>{error}</p>
          </div>
        )}
        {isLoading && <div className="mt-10"><Spinner message="몰입형 어드벤처를 만들고 있습니다... 잠시만 기다려 주세요."/></div>}
        {escapeRoomData && (
          <EscapeRoomDisplay 
            data={escapeRoomData} 
            onGenerateImage={handleGenerateImage}
            onPrintMission={handlePrintMission}
            onGenerateStorybook={handleGenerateStorybook}
            isStorybookLoading={isStorybookLoading}
            printSize={printSize}
            onPrintSizeChange={setPrintSize}
          />
        )}
        {storybookContent && <StorybookDisplay content={storybookContent} title={escapeRoomData?.title || "어드벤처 이야기"} />}
      </main>
    </div>
  );
}

export default App;