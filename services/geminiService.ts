import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import type { EscapeRoom } from '../types';

const escapeRoomSchema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "방탈출 어드벤처를 위한 흥미로운 제목.",
    },
    story: {
      type: Type.STRING,
      description: "학생들을 위한 장면을 설정하는 이야기의 도입부.",
    },
    missions: {
      type: Type.ARRAY,
      description: "5개의 고유한 미션 또는 퍼즐의 배열.",
      items: {
        type: Type.OBJECT,
        properties: {
          id: {
            type: Type.INTEGER,
            description: "1부터 시작하는 미션의 고유 ID.",
          },
          title: {
            type: Type.STRING,
            description: "이 특정 미션의 제목.",
          },
          puzzle: {
            type: Type.STRING,
            description: "학생들을 위한 퍼즐 또는 챌린지의 전체 텍스트. 제공된 콘텐츠를 기반으로 흥미로워야 합니다.",
          },
          solution: {
            type: Type.STRING,
            description: "퍼즐에 대한 정답.",
          },
          placement: {
            type: Type.STRING,
            description: "교실의 흔한 장소(예: 칠판 뒤, 책상 밑, 사물함 안, 창가)에 이 미션 카드를 숨길 수 있는 방법에 대한 실용적이고 일반적인 조언. 특정 사물이 없어도 적용 가능하도록 여러 대안을 제시해주세요.",
          },
        },
        required: ["id", "title", "puzzle", "solution", "placement"],
      },
    },
    finalPuzzle: {
        type: Type.STRING,
        description: "모든 미션의 정답을 사용하여 푸는 최종 메타 퍼즐. 이 퍼즐은 모험의 절정을 이룹니다."
    },
    finalSolution: {
        type: Type.STRING,
        description: "최종 메타 퍼즐에 대한 정답."
    }
  },
  required: ["title", "story", "missions", "finalPuzzle", "finalSolution"],
};

export const generateEscapeRoom = async (apiKey: string, content: string, grade: string, theme:string): Promise<EscapeRoom> => {
  if (!apiKey) throw new Error("API 키가 제공되지 않았습니다.");
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    당신은 학생들을 위한 몰입형 방탈출 경험을 만드는 데 특화된 전문 교육용 게임 디자이너입니다. 주어진 교육 콘텐츠, 학년, 테마를 바탕으로 매력적인 스토리 중심의 방탈출 게임을 만드는 것이 당신의 임무입니다.

    **교육 콘텐츠:**
    """
    ${content}
    """

    **대상 학년:** ${grade}

    **테마:** ${theme}

    **지침:**
    1. 교육 콘텐츠를 이야기에 녹여낸 흥미롭고 **하나로 이어지는** 스토리를 만드세요. 스토리는 흥미진진해야 하며 학생들에게 명확한 목표를 설정해야 합니다.
    2. 학생들이 '탈출'하거나 이야기의 목표를 달성하기 위해 풀어야 할 5개의 독특한 미션을 디자인하세요. **미션들은 순차적으로 연결되어야 하며, 하나의 미션을 풀면 다음 미션으로 가는 단서나 위치를 알 수 있도록 구성해주세요.**
    3. 각 미션은 제공된 교육 콘텐츠의 개념과 직접적으로 관련되어야 합니다.
    4. 퍼즐은 지정된 학년 수준의 학생들이 풀 수 있으면서도 도전적이어야 합니다.
    5. 각 미션에 대해 명확한 제목, 퍼즐 내용, 정답, 그리고 일반적인 교실에서 미션 카드를 숨기거나 배치할 **실용적이고 적용 가능한** 장소 제안을 제공하세요. (예: '칠판 뒤에 붙이세요', '교과서 152페이지 사이에 끼워두세요').
    6. **마지막으로, 5개 미션의 정답을 모두 조합해야만 풀 수 있는 최종 '메타 퍼즐'을 만드세요. 이 퍼즐은 전체 이야기의 대미를 장식해야 합니다.**
    7. 스토리와 미션의 전체적인 분위기는 선택한 테마(${theme})와 일치해야 합니다.

    **출력 형식:**
    제공된 스키마를 준수하는 유효한 JSON 객체만 응답으로 보내주세요. JSON 객체 앞뒤에 어떤 텍스트, 설명, 마크다운 형식도 포함하지 마세요.
  `;

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: escapeRoomSchema,
    },
  });

  const jsonText = response.text.trim();
  return JSON.parse(jsonText) as EscapeRoom;
};

export const generateImage = async (apiKey: string, prompt: string): Promise<string> => {
  if (!apiKey) throw new Error("API 키가 제공되지 않았습니다.");
  const ai = new GoogleGenAI({ apiKey });

  const fullPrompt = `교실 활동에 적합한 시각적으로 매력적이고 스타일리시한 일러스트를 만들어 주세요. 이미지는 생생하고 명확하며 어린이 친화적이어야 하며, 다음 설명을 따라야 합니다: ${prompt}`;
  const response = await ai.models.generateImages({
    model: 'imagen-4.0-generate-001',
    prompt: fullPrompt,
    config: {
      numberOfImages: 1,
      outputMimeType: 'image/png',
      aspectRatio: '1:1',
    },
  });
  
  if (response.generatedImages && response.generatedImages.length > 0) {
    const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
    return `data:image/png;base64,${base64ImageBytes}`;
  }
  throw new Error("Image generation failed.");
};


export const generateStorybook = async (apiKey: string, escapeRoom: EscapeRoom, grade: string): Promise<string> => {
  if (!apiKey) throw new Error("API 키가 제공되지 않았습니다.");
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    당신은 재능 있는 동화 작가입니다. 다음 방탈출 모험을 짧고 흥미로운 스토리북 형식으로 요약하는 것이 당신의 임무입니다. 이야기는 ${grade} 학생에게 적합한 수준으로 작성되어야 합니다. 모험의 흥분, 퍼즐의 도전, 그리고 성공적인 결말을 담아내세요.

    **방탈출 제목:** ${escapeRoom.title}

    **스토리 배경:** ${escapeRoom.story}

    **완수한 미션:**
    ${escapeRoom.missions.map(m => `- ${m.title}: 학생들은 ${m.puzzle.substring(0, 50)}...에 대한 퍼즐을 풀고 정답이 ${m.solution}임을 발견했습니다.`).join('\n')}
    
    **최종 도전:** 학생들은 모든 단서를 모아 '${escapeRoom.finalPuzzle}' 라는 최종 수수께끼를 풀고 '${escapeRoom.finalSolution}' 이라는 답을 찾아냈습니다.

    **지침:**
    모든 것을 하나로 묶는 일관성 있고 따뜻한 이야기를 작성하세요. 처음부터 시작하여 미션을 통한 여정을 묘사하고, 경험을 요약하는 만족스러운 결말을 제공하세요. 톤은 긍정적이고 격려적이어야 합니다. 이야기는 3-4 문단 길이여야 합니다.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  return response.text;
};