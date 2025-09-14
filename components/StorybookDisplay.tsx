import React from 'react';
import { PrintIcon } from './icons';

interface StorybookDisplayProps {
  content: string;
  title: string;
}

const StorybookDisplay: React.FC<StorybookDisplayProps> = ({ content, title }) => {
  
  const handlePrint = () => {
    const printContentHtml = `
      <div class="p-4 font-serif">
        <h1 class="text-4xl font-bold text-center mb-6">${title}</h1>
        <div class="text-lg leading-relaxed space-y-4 whitespace-pre-wrap">${content}</div>
      </div>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>스토리북: ${title}</title>
            <script src="https://cdn.tailwindcss.com"></script>
          </head>
          <body class="p-8">
            ${printContentHtml}
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
    <div className="mt-10 bg-white p-8 rounded-xl shadow-lg border border-slate-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold text-slate-800">당신의 모험 스토리북</h2>
        <button
          onClick={handlePrint}
          className="flex items-center bg-slate-200 text-slate-800 font-semibold py-2 px-4 rounded-lg hover:bg-slate-300 transition duration-300"
        >
          <PrintIcon />
          스토리북 인쇄
        </button>
      </div>
      <div className="prose prose-lg max-w-none text-slate-700 whitespace-pre-wrap bg-slate-50 p-6 rounded-lg">
        {content}
      </div>
    </div>
  );
};

export default StorybookDisplay;