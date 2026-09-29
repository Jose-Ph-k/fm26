export const config = { runtime: "edge" };

export default async function handler(req) {
  if (req.method !== "POST") return new Response(JSON.stringify({error:"POST only"}), {status:405});
  const key = process.env.OPENAI_API_KEY;
  if (!key) return new Response(JSON.stringify({error:"Vercel에 OPENAI_API_KEY를 등록해야 합니다."}), {status:500});
  try {
    const { image } = await req.json();
    if (!image?.startsWith("data:image/")) throw new Error("이미지가 없습니다.");
    const prompt = `너는 Football Manager 26 선수 스카우팅 분석기다. 첨부된 FM26 한국어 UI 스크린샷에서 보이는 정보만 읽어라.
절대로 보이지 않는 hidden CA/PA를 정확한 숫자로 꾸며내지 마라. 이름이 UI에서 잘렸으면 잘린 그대로 표시하거나 null.
GK와 필드 플레이어를 구분해 포지션별 핵심 능력치를 평가하라.
반드시 JSON 객체 하나만 출력하고 마크다운은 쓰지 마라.
형식:
{"player":{"name":string|null,"age":number|null,"nationality":string|null,"position":string|null,"club":string|null,"foot":string|null,"height":string|null,"personality":string|null,"current_level":string|null,"potential":string|null,"attributes":object},
"decision":string,"best_role":string,"strengths":[string],"weaknesses":[string],"recruitment":string,"price_view":string,
"ca_estimate":string,"confidence":string,"notes":string}
ca_estimate는 '140~150 추정' 같은 범위만 허용하며 근거가 부족하면 '추정 불가'라고 써라.
사용자 운영 성향: 어린 선수/잠재력 우선, 25세 이하 영입 선호, 16~17세 최고급 유망주는 적극 영입, 유망주는 임대 육성 가능, 원금 회수와 재판매 가치 중시.`;
    const r = await fetch("https://api.openai.com/v1/responses", {
      method:"POST",
      headers:{"Authorization":`Bearer ${key}`,"Content-Type":"application/json"},
      body:JSON.stringify({
        model:"gpt-5.6-luna",
        input:[{role:"user",content:[
          {type:"input_text",text:prompt},
          {type:"input_image",image_url:image,detail:"high"}
        ]}],
        max_output_tokens:2500
      })
    });
    const raw=await r.json();
    if(!r.ok) return new Response(JSON.stringify({error:raw?.error?.message||"OpenAI API 오류"}),{status:r.status});
    const text=(raw.output||[]).flatMap(o=>o.content||[]).find(c=>c.type==="output_text")?.text || raw.output_text;
    if(!text) throw new Error("AI 응답이 비어 있습니다.");
    const cleaned=text.replace(/^```json\s*/i,"").replace(/```$/,"").trim();
    return new Response(JSON.stringify(JSON.parse(cleaned)),{headers:{"content-type":"application/json; charset=utf-8"}});
  } catch(e) {
    return new Response(JSON.stringify({error:e.message}),{status:500,headers:{"content-type":"application/json; charset=utf-8"}});
  }
}
