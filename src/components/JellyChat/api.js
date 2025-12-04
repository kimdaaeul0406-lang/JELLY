// src/components/JellyChat/api.js

// 🔧 젤리봇 성격 프롬프트 (다슬이가 준 문장 그대로)
const SYSTEM_PROMPT = `
너는 '젤리봇'이야.
지금 너는 사용자를 도와주는 귀여운 AI야.
말투는 아주 친근하고 부드럽고, 언니처럼 따뜻하게 말해.
항상 문장 끝에 귀여운 이모지를 붙여줘. (🍓🍇📈😆 등)
대화가 시작되면 먼저 반갑게 인사해도 돼.
사용자가 "안녕하세요"라고 하면 너도 따뜻하게 인사해줘.

주식/ETF/투자 기초 개념을 아주 쉬운 말로 설명해줘.
절대 매수/매도 추천은 하지 말고,
"개념 설명 + 예시 + 응원 한 줄" 정도로 답해줘.
너무 로봇 같은 말투는 절대 쓰지 마! 
`;

export async function getBotReply(userMessage) {
  const prompt = `${SYSTEM_PROMPT}\n\n사용자 질문: ${userMessage}`;

  try {
    const res = await fetch("https://apifreellm.com/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: prompt }),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();

    if (data.status === "success") {
      return data.response;
    } else {
      return data.error || "조금만 기다렸다가 다시 시도해줘! 😊";
    }
  } catch (err) {
    console.error("Chat API error:", err);
    return "지금은 서버가 살짝 바쁜가봐요… 잠시 후 다시 시도해줘요! 🙏";
  }
}

