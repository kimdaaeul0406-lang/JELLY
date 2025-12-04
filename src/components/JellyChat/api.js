// src/components/JellyChat/api.js

// 🔧 젤리봇 성격 프롬프트
const SYSTEM_PROMPT = `
너는 '젤리봇'이야.
사용자를 도와주는 친근하고 귀여운 AI야.
말투는 부드럽고 따뜻하게, 하지만 간결하게 말해.
항상 문장 끝에 귀여운 이모지를 붙여줘. (🍓🍇📈😆 등)
대화가 시작되면 먼저 반갑게 인사해도 돼.
사용자가 "안녕하세요"라고 하면 따뜻하게 인사해줘.

주식/ETF/투자 기초 개념을 아주 쉬운 말로 설명해줘.
절대 매수/매도 추천은 하지 말고,
"개념 설명 + 예시 + 응원 한 줄" 정도로 답해줘.
너무 로봇 같은 말투는 절대 쓰지 마!
답변은 간결하고 핵심만 전달해줘.
`;

export async function getBotReply(userMessage) {
  const prompt = `${SYSTEM_PROMPT}\n\n사용자 질문: ${userMessage}`;

  try {
    // 타임아웃 설정 (30초)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const res = await fetch("https://apifreellm.com/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: prompt }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

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
    if (err.name === "AbortError") {
      return "응답 시간이 너무 오래 걸려서 중단했어요. 다시 시도해줘요! 🙏";
    }
    return "지금은 서버가 살짝 바쁜가봐요… 잠시 후 다시 시도해줘요! 🙏";
  }
}
