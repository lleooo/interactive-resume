// Chatbot-only knowledge: content the AI assistant can draw on that is not
// rendered anywhere in the resume UI. Kept server-side so it stays out of the
// client bundle. Visible resume content lives in src/shared/data/resume-data.ts.
import type { Bilingual } from '../../src/shared/i18n/types';

export interface CareerStoryEntry {
  heading: Bilingual;
  text: Bilingual;
}

export interface DeepDive {
  topic: Bilingual;
  detail: Bilingual;
}

export interface ChatbotKnowledge {
  summary: Bilingual;
  highlights: Bilingual[];
  certifications: Bilingual[];
  languages: Bilingual[];
  story: {
    intro: Bilingual;
    journey: CareerStoryEntry[];
    closing: Bilingual;
    outsideWork: Bilingual;
  };
  motivation: Bilingual;
  strengths: Bilingual[];
  growthArea: Bilingual;
  deepDives: DeepDive[];
}

export const knowledge: ChatbotKnowledge = {
  summary: {
    en: "I have 3–4 years of frontend experience centered on the React / TypeScript / Next.js ecosystem, working with React Query and Zustand for state and cache management. Beyond UI work, I build real-time features with WebSocket, WebRTC, and SignalR, and I'm comfortable owning deployment on AWS (Route53, CloudFront, S3, ALB) with Docker and Nginx. I like taking a project from architecture through to a stable production launch, and I pick up new requirements quickly.",
    zh: '我有 3–4 年前端開發經驗，專精於 React / TypeScript / Next.js 生態系，並使用 React Query、Zustand 進行狀態與快取管理。除了介面開發，我也負責過即時通訊功能，包含 WebSocket、WebRTC、SignalR，並具備 AWS（Route53、CloudFront、S3、ALB）搭配 Docker、Nginx 的部署經驗。我喜歡把一個專案從架構規劃一路做到穩定上線，也能快速理解並交付新的需求。',
  },
  highlights: [
    {
      en: 'Built a production WebRTC + WebSocket voice calling feature — handling ICE candidate buffering and heartbeats.',
      zh: '打造過正式上線的 WebRTC + WebSocket 語音通話功能，處理 ICE candidate 緩衝與心跳機制。',
    },
    {
      en: 'Solo-owned an 18-module admin system end to end, from architecture design through production deployment.',
      zh: '獨立負責一套涵蓋 18 個業務模組的後台系統，從架構設計到 Production 上線全程獨立完成。',
    },
    {
      en: 'Real AWS infrastructure experience for a frontend engineer — Route53, CloudFront, S3, and ALB routing/health checks.',
      zh: '身為前端工程師，也具備扎實的 AWS 基礎架構經驗，包含 Route53、CloudFront、S3 與 ALB 路由/健康檢查設定。',
    },
    {
      en: 'Built browser-based remote-access tools from scratch — Web FTP, Web VNC, and Web SSH — turning the browser into a systems console.',
      zh: '從零打造多個瀏覽器端遠端操作工具 — Web FTP、Web VNC、Web SSH — 讓瀏覽器變成系統操作主控台。',
    },
    {
      en: 'Diagnosed and fixed a concurrent-401 authentication storm with a refresh-concurrency-control and request-replay mechanism.',
      zh: '診斷並修復多請求併發 401 的認證風暴問題，實作 token refresh 併發控制與請求重放機制解決。',
    },
  ],
  certifications: [
    { en: 'TOEIC — 550 (ETS)', zh: 'TOEIC 多益測驗 — 550 分（ETS）' },
  ],
  languages: [
    {
      en: 'English — Intermediate listening, speaking & reading; basic writing',
      zh: '英文 — 聽力/口說/閱讀中等，寫作略懂',
    },
  ],
  story: {
    intro: {
      en: "I'm Leo Liu (劉楷珉), a graduate of Yuan Ze University's Department of Information Communication. I built my programming foundation through coursework there, then used my free time to self-teach frontend development on Udemy and build a portfolio, which gradually opened the door to a career as a frontend engineer.",
      zh: '我是劉楷珉 Leo，畢業於元智大學資訊傳播學系，透過系上課程累積程式設計基礎，並利用課外時間透過 Udemy 自學前端技術、累積作品，逐步開啟前端工程師的職涯。',
    },
    journey: [
      {
        heading: {
          en: 'First job — Application Engineer in the tech industry',
          zh: '第一份工作 - 科技業的應用工程師',
        },
        text: {
          en: 'My first job after graduating was at Horti Technology, where I worked on internal system UI and backend APIs (about 90% frontend, 10% backend). This is where I built my foundational understanding of frontend and backend concepts for web products, and started to see how frontend work connects to real business needs — helping the company solve everyday operational problems. It was my first exposure to a complete product development process.',
          zh: '畢業後的第一份工作，在和瑞科技負責內部系統的畫面與後端 api 的開發（前端90%,後端10%)，在這裡建立起網頁產品前後端的基本概念，也開始理解前端如何配合實際業務需求，協助企業解決日常問題，首次接觸完整的產品開發流程。',
        },
      },
      {
        heading: {
          en: 'Second job — a high-traffic, dual-platform livestreaming site',
          zh: '第二份工作 - 流量高的雙平台直播站',
        },
        text: {
          en: 'At my second job at Tianyu Software, I worked on frontend development, contributed to SEO optimization for the platform, built both the desktop and mobile-web versions, and handled connectivity issues for overseas users. Through this experience I came to understand how much SEO, site performance, and user experience matter for traffic, and gained hands-on experience with Next.js, PWA, and AWS.',
          zh: '第二份工作於天譽軟體負責前端開發，參與平台 SEO 優化，同時開發電腦版與手機版平台，並處理海外使用者的連線問題。在這段經驗中，我開始理解 SEO、網站效能與使用者體驗對流量的重要性，也累積了 Next.js、PWA 與 AWS 等技術的實務經驗。',
        },
      },
      {
        heading: {
          en: 'Third job — Frontend Engineer at an agency/contract-work company',
          zh: '第三份工作 - 接案公司的前端工程師',
        },
        text: {
          en: 'In my third job, I started independently owning the frontend for a project end to end — from requirements discussions, feature evaluation, and feasibility analysis, through implementation and production deployment — gradually building out a complete development workflow. This was also the first time I had to independently think through the full range of frontend concerns, moving beyond just building screens to considering user needs and how to implement the project as a whole.',
          zh: '第三份工作開始獨立負責專案前端，從需求討論、功能評估與可行性分析，到功能實作及部署上線，逐步建立完整的開發流程。這也是我第一次需要獨立考慮前端開發中的各種問題，從單純完成畫面，進一步思考使用者需求與整體專案的實作方式。',
        },
      },
    ],
    closing: {
      en: "I now have close to four years of frontend experience, mainly working with React and TypeScript (I'm also comfortable with Vue). With AI rapidly reshaping how software gets built, I'm continuing to expand into full-stack skills, so my scope isn't limited to frontend and I can take part in more complete product development.",
      zh: '目前的我有接近四年的前端工作經歷，主要使用 React、TypeScript 等技術（Vue 也可以），面對 AI 快速改變軟體開發模式，目前正持續拓展全端相關能力，希望讓自己的技術範圍不只停留在前端，而能參與更完整的產品開發。',
    },
    outsideWork: {
      en: 'I like trying all kinds of new things. Recently, to improve my English, I went abroad for two months to attend a language school. I love taking on different challenges — these experiences have broadened my perspective and given me more diverse viewpoints and ideas, enriching who I am.',
      zh: '我喜歡嘗試各式各樣的新事物。前陣子為了增進英文能力，我出國念了兩個月的語言學校。我熱愛挑戰不同的事物，通過這些經歷，不僅擴展了我的眼界，也讓我獲得了更多元的觀點和想法，進而充實自己。',
    },
  },
  motivation: {
    en: "My most recent role ended in a layoff due to the company's operational restructuring, not individual performance. That experience made it clearer what I want next: a stable team with its own product, where I can invest in one product long term and grow with it through iteration. I'm open on the product domain, and I'd love a team with a culture of code review and technical discussion.",
    zh: '上一份工作因為公司營運調整而被資遣，並非個人表現的問題。這段經歷讓我更確定，下一份工作想找營運穩定、有自有產品的團隊，能長期投入同一個產品，跟著它成長與迭代。產品類型沒有特別限制，也希望團隊有 code review 與技術討論的文化。',
  },
  strengths: [
    {
      en: 'Owning a project end to end: at JustXtar I single-handedly built an admin system spanning 18 business modules — architecture, shared components, and state management through Docker deployment to production. I clarify requirements and feasibility before writing code rather than just building screens.',
      zh: '能獨立把專案從零做到上線：在集星資通一個人負責涵蓋 18 個業務模組的後台系統，從架構規劃、共用元件、狀態管理到 Docker 部署上線皆獨立完成，習慣先釐清需求與可行性再動手，而不只是照著畫面做。',
    },
    {
      en: "Chasing cross-layer problems to the root cause: issues like concurrent 401s triggering duplicate token refreshes, WebRTC calls failing because of ICE timing, and domain failover for blocked users all reach into the backend, network, or infrastructure. I dig down to the real cause instead of working around it in the frontend, and I have hands-on AWS (Route 53, CloudFront, S3, ALB) and Nginx experience.",
      zh: '遇到跨層問題會追到根本原因：例如多請求同時 401 造成重複刷新 token、WebRTC 通話因 ICE 時序問題連不上、使用者連線被封鎖時的域名切換，這些問題牽涉後端、網路或基礎架構，我會往下追到根因，而不是只在前端繞過去；也具備 AWS（Route 53、CloudFront、S3、ALB）與 Nginx 的實作經驗。',
    },
  ],
  growthArea: {
    en: "Backend development. My experience is mostly frontend; my backend work so far is the Python APIs I wrote at my first job (about 10% of that role). As AI blurs the line between frontend and backend work, I don't want to stop at the frontend — I'm actively building my backend skills, aiming to own a feature across both frontend and backend on my own.",
    zh: '目前在加強後端能力。我的經歷以前端為主，後端只有第一份工作時以 Python 開發 API（約佔一成）。隨著 AI 讓前後端的分工界線越來越模糊，我希望自己不只停留在前端，正在持續加強後端能力，目標是能獨立負責一個功能的前後端。',
  },
  deepDives: [
    {
      topic: {
        en: 'Cloud intercom (WebRTC): why calls failed to connect at first, and the fix',
        zh: '雲端對講機（WebRTC）：為什麼一開始連不上、怎麼解決',
      },
      detail: {
        en: 'At first, calls failed to connect every time. Tracing it down, ICE candidates were arriving over WebSocket before the remote description had been set, so calling addIceCandidate failed. The fix was to buffer early candidates and add them all once setRemoteDescription completed. A WebSocket heartbeat monitors connection state. The feature has no automatic reconnection.',
        zh: '通話一開始每次都連不上。追查後發現，ICE candidate 透過 WebSocket 傳來時，remote description 常常還沒設定好，此時呼叫 addIceCandidate 會失敗。解法是先把提早到達的 candidate 暫存起來，等 setRemoteDescription 完成後再一次加入；另外透過 WebSocket 心跳偵測連線狀態。此功能沒有實作自動重新連線機制。',
      },
    },
    {
      topic: {
        en: 'Concurrent 401s and token refresh',
        zh: '多個請求同時 401 時的 token refresh 處理',
      },
      detail: {
        en: "Users kept getting logged out. The cause: when the token expired, several in-flight requests all got 401 and each triggered its own refresh; the duplicate refreshes invalidated the token and logged the user out. The fix, in an axios interceptor, lets only the first 401 trigger a refresh while the other requests queue and are replayed once the new token arrives. A proactive timer-based refresh alone isn't enough because timers are unreliable in sleeping or background tabs, so the 401 handling stays as the safety net.",
        zh: '使用者一直被登出。追查後發現 token 過期時，同時發出的多個請求都拿到 401 並各自觸發 refresh，重複刷新導致 token 失效而被登出。解法是在 axios interceptor 中只讓第一個 401 觸發 refresh，其餘請求排隊等待，取得新 token 後再重送。之所以不只靠過期前用計時器主動刷新，是因為分頁休眠或在背景執行時計時器不可靠，仍需要 401 的處理機制作為保險。',
      },
    },
    {
      topic: {
        en: 'Dynamic domain failover to avoid blocking',
        zh: '動態域名切換如何避免被封鎖',
      },
      detail: {
        en: "The project kept a set of backup domains. The current domain was health-checked periodically, and when it became unreachable (e.g. blocked by China's Great Firewall), the site switched automatically to the next available backup domain, so users never had to hunt for a new URL. Leo took part in building this mechanism rather than designing the whole thing alone.",
        zh: '專案中準備了多組備用域名，定時對目前使用的域名做 health check，一旦打不通（例如被中國網路長城封鎖），就自動切換到下一個可用的備用域名，讓使用者不必自行尋找新網址。Leo 參與此機制的開發，並非獨立設計整套機制。',
      },
    },
  ],
};
