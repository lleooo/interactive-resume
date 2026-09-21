import type { Bilingual } from '../i18n/types';

export interface ContactInfo {
  email: string;
  /** TODO: resume source has no real URL yet ("請補上連結") — replace with the actual GitHub profile URL. */
  github: string | null;
  /** TODO: resume source has no real URL yet ("請補上連結") — replace with the actual LinkedIn profile URL. */
  linkedin: string | null;
  location: Bilingual;
}

export interface ExperienceEntry {
  id: string;
  company: Bilingual;
  role: Bilingual;
  location: Bilingual;
  startDate: string;
  endDate: string | 'present';
  projectName?: Bilingual;
  stack: string[];
  bullets: Bilingual[];
}

export interface ProjectEntry {
  id: string;
  title: Bilingual;
  role: Bilingual;
  tech: string[];
  challenge: Bilingual;
  solution: Bilingual;
  outcome: Bilingual;
  highlight?: boolean;
}

export interface SkillCategory {
  id: string;
  categoryLabel: Bilingual;
  skills: string[];
}

export interface EducationEntry {
  school: Bilingual;
  degree: Bilingual;
  field: Bilingual;
  startDate: string;
  endDate: string;
}

export interface CareerStoryEntry {
  heading: Bilingual;
  text: Bilingual;
}

export interface ResumeData {
  name: Bilingual;
  title: Bilingual;
  tagline: Bilingual;
  summary: Bilingual;
  highlights: Bilingual[];
  contact: ContactInfo;
  experience: ExperienceEntry[];
  projects: ProjectEntry[];
  skills: SkillCategory[];
  education: EducationEntry[];
  certifications: Bilingual[];
  languages: Bilingual[];
  story: {
    intro: Bilingual;
    journey: CareerStoryEntry[];
    closing: Bilingual;
    outsideWork: Bilingual;
  };
}

export const resumeData: ResumeData = {
  name: { en: 'Leo Liu', zh: '劉楷珉' },
  title: { en: 'Frontend Engineer', zh: '前端工程師' },
  tagline: {
    en: 'Frontend engineer who takes products from architecture to production — with real-time systems and cloud deployment chops.',
    zh: '3～4 年前端開發經驗，熟悉 React 與前端工程實務，能獨立負責專案從架構規劃、功能開發至部署上線。具備良好的問題分析與解決能力，能快速理解需求，穩定交付產品功能。',
  },
  summary: {
    en: "I have 3–4 years of frontend experience centered on the React / TypeScript / Next.js ecosystem, working with React Query and Zustand for state and cache management. Beyond UI work, I build real-time features with WebSocket, WebRTC, and SignalR, and I'm comfortable owning deployment on AWS (Route53, CloudFront, S3, ALB) with Docker and Nginx. I like taking a project from architecture through to a stable production launch, and I pick up new requirements quickly.",
    zh: '我有 3–4 年前端開發經驗，專精於 React / TypeScript / Next.js 生態系，並使用 React Query、Zustand 進行狀態與快取管理。除了介面開發，我也負責過即時通訊功能，包含 WebSocket、WebRTC、SignalR，並具備 AWS（Route53、CloudFront、S3、ALB）搭配 Docker、Nginx 的部署經驗。我喜歡把一個專案從架構規劃一路做到穩定上線，也能快速理解並交付新的需求。',
  },
  highlights: [
    {
      en: 'Built a production WebRTC + WebSocket voice calling feature — handling ICE candidate buffering, heartbeats, and auto-reconnect on token expiry.',
      zh: '打造過正式上線的 WebRTC + WebSocket 語音通話功能，處理 ICE candidate 緩衝、心跳機制與 token 過期自動重連。',
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
  contact: {
    email: 'leo88728@gmail.com',
    github: null,
    linkedin: null,
    location: { en: 'Taipei, Taiwan', zh: '台北市' },
  },
  experience: [
    {
      id: 'justxtor-2026',
      company: { en: 'JustXtor Technology', zh: '集星資通股份有限公司' },
      role: { en: 'Frontend Engineer', zh: '前端工程師' },
      location: { en: 'Neihu, Taipei', zh: '台北市內湖區' },
      startDate: '2026-01',
      endDate: 'present',
      projectName: {
        en: 'Community Property Management Admin System',
        zh: '社區物業管理後台系統',
      },
      stack: [
        'React 18',
        'TypeScript',
        'MUI',
        'TanStack Query',
        'Zustand',
        'Vite',
      ],
      bullets: [
        {
          en: 'Owned frontend architecture end-to-end as the sole frontend engineer — from initial design through production deployment — shipping 18 business modules, a shared component library, and global state management.',
          zh: '以唯一前端工程師身份，獨立負責前端系統架構設計與部署，交付 18 個業務模組、共用元件庫與全域狀態管理，完整參與 Production 上線流程。',
        },
        {
          en: 'Designed and built a cloud intercom feature combining WebSocket signaling with WebRTC voice calls — handling ICE candidate buffering, a heartbeat mechanism, and automatic reconnection when tokens expire mid-call.',
          zh: '設計並實作雲端對講機功能，整合 WebSocket 訊令傳輸與 WebRTC 語音通話，處理 ICE candidate 緩衝、心跳機制與 token 過期自動重連，確保通話穩定性。',
        },
        {
          en: 'Fixed a concurrent-401 auth storm: when several requests hit an expired token at once, each triggered its own refresh. Implemented refresh-concurrency control plus request replay so only one refresh happens and pending requests retry safely.',
          zh: '解決多請求併發 401 問題：當多個請求同時遇到過期 token 時各自觸發刷新，實作 token refresh 併發控制與請求重放機制，避免重複刷新造成的認證衝突。',
        },
        {
          en: 'Designed a disconnect error page and automatic recovery flow to keep the experience graceful during network interruptions.',
          zh: '設計斷線錯誤頁面與自動恢復流程，改善網路中斷情境下的使用者體驗。',
        },
        {
          en: 'Used an Nginx reverse proxy to decouple per-environment API configuration, letting Staging and Production share the same Docker image and simplifying deployment.',
          zh: '使用 Nginx Reverse Proxy 解耦跨環境 API 設定，使 Staging / Production 共用同一 Docker Image，簡化部署流程。',
        },
      ],
    },
    {
      id: 'tianyu-2024',
      company: { en: 'Tianyu Software', zh: '天譽軟體有限公司' },
      role: { en: 'Frontend Engineer', zh: '前端工程師' },
      location: { en: 'Neihu, Taipei', zh: '台北市內湖區' },
      startDate: '2024-09',
      endDate: '2025-12',
      stack: ['Next.js 14', 'React Router', 'SignalR', 'AWS'],
      bullets: [
        {
          en: 'Built and maintained a Next.js 14 web platform covering real-time messaging, multi-language i18n, and form submission.',
          zh: '使用 Next.js 14 開發並維護 Web 平台產品，支援即時通訊、多國語系（i18n）與表單提交等核心功能。',
        },
        {
          en: 'Built the mobile-web interface with React Router for a consistent experience across devices.',
          zh: '使用 React Router 打造行動版介面，提供跨裝置一致的使用者體驗。',
        },
        {
          en: 'Set up a Route53 → CloudFront → S3 static-site architecture, and configured ALB path routing, target groups, and health checks.',
          zh: '建置 AWS Route53 → CloudFront → S3 靜態網站架構，並設定 ALB path routing、target group 與健康檢查。',
        },
        {
          en: 'Designed a dynamic domain-switching mechanism to reduce the risk of a fixed domain being blocked by the Great Firewall, improving availability.',
          zh: '設計動態域名切換機制，降低固定域名遭網路長城封鎖之風險，提升服務可用性與存活率。',
        },
        {
          en: 'Built a real-time gift-sending system with SignalR, synchronizing gift animations live across all connected clients.',
          zh: '使用 SignalR 開發即時送禮系統，達成禮物動畫跨使用者端即時同步顯示。',
        },
      ],
    },
    {
      id: 'horti-2022',
      company: { en: 'Horti Technology', zh: '和瑞科技股份有限公司' },
      role: { en: 'Frontend Engineer', zh: '前端工程師' },
      location: { en: 'Zhubei, Hsinchu', zh: '新竹縣竹北市' },
      startDate: '2022-06',
      endDate: '2024-03',
      stack: [
        'p5.js',
        'Canvas',
        'Bootstrap',
        'jQuery',
        'Python',
        'WebSocket',
        'noVNC',
      ],
      bullets: [
        {
          en: 'Wafer Map Generator — introduced p5.js to replace native canvas drawing, cutting roughly 500 lines of code, and delivered two custom client requirements within 3 weeks.',
          zh: 'Wafer Map Generator：導入 p5.js 繪製 Canvas 圖形取代原生實作，程式碼精簡約 500 行；3 週內交付兩項客製化需求。',
        },
        {
          en: 'Web FTP — built a browser-based FTP interface with Bootstrap + jQuery, backed by a Python ftplib API, streaming file-processing progress back to the browser over WebSocket.',
          zh: 'Web FTP：使用 Bootstrap + jQuery 打造前端操作介面，並以 Python ftplib 開發後端 API，透過 WebSocket 即時回傳檔案處理進度。',
        },
        {
          en: 'Web VNC — built a browser-based remote screen monitor with noVNC to cut down on physical lab visits, supporting multiple connections via periodic screenshot polling instead of persistent streams to keep the page light.',
          zh: 'Web VNC：使用 noVNC 開發瀏覽器端遠端監控介面，取代工程師實體進出實驗室之需求，支援多連線並以定時截圖取代持續連線，降低頁面負擔。',
        },
        {
          en: 'Web SSH — built a full browser-based terminal on the WebSSH API, supporting synchronized commands across multiple terminals with automatic stop-and-error-display on command failure.',
          zh: 'Web SSH：基於 WebSSH API 打造完整瀏覽器端 Terminal 應用，支援多終端同步下達指令，指令執行失敗時自動停止並顯示錯誤訊息。',
        },
        {
          en: 'Replaced backend loop-based lookups with SQL queries and added frontend lazy-loading, meaningfully speeding up search and load times for large data lists.',
          zh: '改用 SQL 查詢取代後端迴圈查找，並於前端新增 lazy load 機制，顯著提升大數據量列表的搜尋與載入速度。',
        },
      ],
    },
  ],
  projects: [
    {
      id: 'cloud-intercom',
      title: {
        en: 'Cloud Intercom (WebRTC Voice)',
        zh: '雲端對講機（WebRTC 語音通話）',
      },
      role: { en: 'Solo Frontend Developer', zh: '獨立前端開發' },
      tech: ['WebSocket', 'WebRTC', 'React', 'TypeScript'],
      challenge: {
        en: 'Voice calls needed to stay stable over flaky mobile networks, including surviving token expiry mid-call and slow ICE negotiation.',
        zh: '語音通話需要在不穩定的行動網路環境下維持穩定，包含通話中 token 過期以及 ICE 協商延遲的情境。',
      },
      solution: {
        en: 'Combined WebSocket signaling with WebRTC peer connections, buffering ICE candidates that arrive before the connection is ready, adding a heartbeat to detect drops, and auto-reconnecting when the auth token refreshes.',
        zh: '整合 WebSocket 訊令傳輸與 WebRTC peer connection，緩衝在連線就緒前到達的 ICE candidate，加入心跳機制偵測斷線，並在 token 刷新後自動重新連線。',
      },
      outcome: {
        en: 'A stable, production-grade cloud intercom feature shipped as part of the admin system.',
        zh: '成功交付穩定、可上線的雲端對講機功能，成為後台系統的核心功能之一。',
      },
      highlight: true,
    },
    {
      id: 'signalr-gifts',
      title: { en: 'Real-time Gift System', zh: '即時送禮系統' },
      role: { en: 'Frontend Engineer', zh: '前端工程師' },
      tech: ['SignalR', 'Next.js', 'React'],
      challenge: {
        en: 'Gift animations needed to appear at the same moment for every viewer in a live room, not just the sender.',
        zh: '禮物動畫需要讓直播間內所有觀眾同一時間看到，而不只是送禮者本人。',
      },
      solution: {
        en: 'Used SignalR to broadcast gift events over a persistent connection and synchronized animation playback across all connected clients.',
        zh: '使用 SignalR 透過持續連線廣播送禮事件，並同步所有連線用戶端的動畫播放時機。',
      },
      outcome: {
        en: 'Gift animations now play in sync across every connected client in real time.',
        zh: '達成禮物動畫在所有使用者端即時同步顯示的效果。',
      },
    },
    {
      id: 'wafer-map',
      title: { en: 'Wafer Map Generator', zh: 'Wafer Map Generator' },
      role: { en: 'Frontend Engineer', zh: '前端工程師' },
      tech: ['p5.js', 'Canvas', 'JavaScript'],
      challenge: {
        en: 'The existing native Canvas drawing code was verbose and hard to extend for new customization requests.',
        zh: '原生 Canvas 繪圖程式碼冗長，難以應付新的客製化需求。',
      },
      solution: {
        en: 'Introduced p5.js to simplify the drawing logic, cutting about 500 lines of code while keeping it easy to extend.',
        zh: '導入 p5.js 簡化繪圖邏輯，程式碼精簡約 500 行，同時維持良好的擴充性。',
      },
      outcome: {
        en: 'Delivered two customized client requirements within a 3-week window.',
        zh: '在 3 週內完成兩項客戶要求的客製化需求。',
      },
    },
    {
      id: 'web-ftp',
      title: { en: 'Web FTP', zh: 'Web FTP' },
      role: { en: 'Full-stack (Frontend-led)', zh: '前端主導、全端開發' },
      tech: ['Bootstrap', 'jQuery', 'Python', 'WebSocket'],
      challenge: {
        en: 'Clients needed to manage files on a remote server without installing a dedicated FTP client.',
        zh: '客戶需要在不安裝專用 FTP 軟體的情況下，管理遠端伺服器上的檔案。',
      },
      solution: {
        en: 'Built a browser-based FTP UI with Bootstrap + jQuery, a Python ftplib backend API, and WebSocket updates so users could watch file-transfer progress live.',
        zh: '使用 Bootstrap + jQuery 打造瀏覽器端 FTP 操作介面，搭配 Python ftplib 後端 API，並以 WebSocket 即時回傳檔案處理進度。',
      },
      outcome: {
        en: 'Gave clients a zero-install, browser-based way to manage remote files with live progress feedback.',
        zh: '讓客戶能免安裝、直接在瀏覽器中管理遠端檔案，並即時看到處理進度。',
      },
    },
    {
      id: 'web-vnc',
      title: { en: 'Web VNC', zh: 'Web VNC' },
      role: { en: 'Frontend Engineer', zh: '前端工程師' },
      tech: ['noVNC', 'JavaScript'],
      challenge: {
        en: "Engineers had to physically enter the lab just to check on a machine's screen, and persistent connections from many viewers would overload the page.",
        zh: '工程師常需實際進出實驗室查看機台畫面，且多個連線同時使用持續連線會造成頁面負擔過重。',
      },
      solution: {
        en: 'Built a browser-based remote screen monitor with noVNC, supporting multiple simultaneous connections via periodic screenshot polling instead of persistent video streams.',
        zh: '使用 noVNC 開發瀏覽器端遠端監控介面，以定時截圖輪詢取代持續影像串流，支援多個連線同時使用。',
      },
      outcome: {
        en: 'Cut down on physical lab visits while keeping the page responsive even with multiple concurrent viewers.',
        zh: '大幅減少工程師實體進出實驗室的次數，同時維持多連線下的頁面流暢度。',
      },
    },
    {
      id: 'web-ssh',
      title: { en: 'Web SSH', zh: 'Web SSH' },
      role: { en: 'Frontend Engineer', zh: '前端工程師' },
      tech: ['WebSSH API', 'JavaScript'],
      challenge: {
        en: 'Users needed to run commands on multiple remote servers at once, directly from the browser, without a native terminal client.',
        zh: '使用者需要不透過原生終端機軟體，直接在瀏覽器中對多台遠端伺服器下達指令。',
      },
      solution: {
        en: 'Built a full browser-based terminal on top of the WebSSH API, supporting synchronized command broadcast to multiple terminals and automatically stopping with a clear error when a command fails.',
        zh: '基於 WebSSH API 打造完整瀏覽器端 Terminal 應用，支援將指令同步下達至多個終端，指令執行失敗時自動停止並顯示錯誤訊息。',
      },
      outcome: {
        en: 'Gave users a fully browser-based multi-server terminal workflow with safe failure handling.',
        zh: '讓使用者能完全在瀏覽器中完成多台伺服器的終端操作，並具備安全的失敗處理機制。',
      },
    },
  ],
  skills: [
    {
      id: 'frontend',
      categoryLabel: { en: 'Frontend', zh: '前端' },
      skills: [
        'JavaScript (ES6+)',
        'TypeScript',
        'React 18',
        'Next.js 14',
        'React Router',
        'Zustand',
        'TanStack Query (React Query)',
        'Tailwind CSS',
        'MUI',
        'Bootstrap',
        'PWA',
        'Responsive Web Design',
        'Canvas',
        'p5.js',
      ],
    },
    {
      id: 'backend',
      categoryLabel: { en: 'Backend', zh: '後端' },
      skills: ['Python', 'SQL', 'ftplib', 'RESTful API'],
    },
    {
      id: 'infrastructure',
      categoryLabel: { en: 'Infrastructure / Cloud', zh: '基礎架構 / 雲端' },
      skills: [
        'AWS Route53',
        'AWS CloudFront',
        'AWS S3',
        'AWS ALB',
        'GCP',
        'Docker',
        'Nginx',
      ],
    },
    {
      id: 'tools',
      categoryLabel: { en: 'Tools', zh: '工具' },
      skills: ['Git', 'Vite', 'npm', 'Jira'],
    },
    {
      id: 'currently-deepening',
      categoryLabel: { en: 'Currently Deepening', zh: '持續精進中' },
      skills: ['WebRTC', 'Real-time Systems', 'WebSocket', 'SignalR'],
    },
  ],
  education: [
    {
      school: { en: 'Yuan Ze University', zh: '元智大學' },
      degree: { en: "Bachelor's Degree", zh: '學士' },
      field: { en: 'Information Communication', zh: '資訊傳播系' },
      startDate: '2017-09',
      endDate: '2021-06',
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
      en: "I like trying all kinds of new things. Recently, to improve my English, I went abroad for two months to attend a language school. I love taking on different challenges — these experiences have broadened my perspective and given me more diverse viewpoints and ideas, enriching who I am.",
      zh: '我喜歡嘗試各式各樣的新事物。前陣子為了增進英文能力，我出國念了兩個月的語言學校。我熱愛挑戰不同的事物，通過這些經歷，不僅擴展了我的眼界，也讓我獲得了更多元的觀點和想法，進而充實自己。',
    },
  },
};
