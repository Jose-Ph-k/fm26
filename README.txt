FM26 Scout V3 — iPad 2732×2048 Fixed Coordinate Edition

핵심
- 유료 API 없음 / API 키 없음.
- 이미지 자체는 외부 AI 서버로 전송하지 않음.
- Tesseract.js OCR 엔진은 CDN에서 로드되며 OCR 계산은 브라우저 기기 안에서 수행.
- FM26 선수 보고서 > 개요 스크린샷 2732×2048을 기준으로 좌표 고정.
- 필드 선수와 GK 템플릿 분리.
- 능력치 이름을 OCR하지 않고, 고정된 숫자 위치만 OCR.
- 판독 후 모든 능력치는 직접 수정 가능.
- 숨겨진 CA/PA 정확값은 산출하지 않음.

GitHub/Vercel 교체
1. 이 ZIP을 압축 해제.
2. 저장소 루트의 index.html, manifest.webmanifest, sw.js, icon-*.png를 이 파일로 덮어쓰기.
3. 예전 api 폴더와 vercel.json은 삭제 가능.
4. Vercel OPENAI_API_KEY 환경변수도 더 이상 필요 없음.
5. main 커밋 후 GitHub Pages/Vercel에서 자동 재배포.

권장 캡처
- iPad 원본 스크린샷 2732×2048
- 선수 보고서 > 개요
- 화면 확대/축소 없이 원본 UI
