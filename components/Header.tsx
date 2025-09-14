import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center py-8 mb-8">
      <h1 className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 tracking-tight">
        교실 방탈출 제작 도우미
      </h1>
      <p className="mt-3 text-lg text-slate-600 max-w-3xl mx-auto">
        어떤 수업이든 잊을 수 없는 모험으로 바꿔보세요! 학습 자료를 붙여넣고 테마를 선택하면 학생들을 위한 인쇄 가능한 스토리 기반 방탈출 게임이 즉시 생성됩니다.
      </p>
    </header>
  );
};

export default Header;