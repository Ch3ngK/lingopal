import { callOpenAI } from "./openaiAI.js";
import { callSambaThai } from "./sambaThaiAI.js";

function isFailure(r: any) {
  return !r || (!r.text && !r.correction && !r.followUp);
}

export async function getAIResponse(message: string, language: string) {
  let result;

  try {
    if (language === "thai") {
      console.log("🇹🇭 SambaLingo");
      result = await callSambaThai(message);
    } else {
      console.log("🌍 OpenAI");
      result = await callOpenAI(message, language);
    }
  } catch {}

  if (!isFailure(result)) return result;

  console.warn("⚠️ Falling back");

  return {
    text: "ขอโทษนะ ระบบขัดข้องเล็กน้อย",
    correction: "",
    followUp: "",
  };
}
