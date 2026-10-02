import type { Bilingual } from '../i18n/types';

export interface ContactInfo {
  email: string;
  phone: {
    /** E.164 form, used for the `tel:` link. */
    tel: string;
    display: Bilingual;
  };
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
  stack: Bilingual[];
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

export interface ResumeData {
  name: Bilingual;
  title: Bilingual;
  tagline: Bilingual;
  contact: ContactInfo;
  experience: ExperienceEntry[];
  projects: ProjectEntry[];
  skills: SkillCategory[];
  education: EducationEntry[];
}

export const resumeData: ResumeData = {
  name: { en: 'Leo Liu', zh: '劉楷珉' },
  title: { en: 'Frontend Engineer', zh: '前端工程師' },
  tagline: {
    en: 'Frontend engineer who takes products from architecture to production — with real-time systems and cloud deployment chops.',
    zh: '3～4 年前端開發經驗，熟悉 React 與前端工程實務，能獨立負責專案從架構規劃、功能開發至部署上線。具備良好的問題分析與解決能力，能快速理解需求，穩定交付產品功能。',
  },
  contact: {
    email: 'leo88728@gmail.com',
    phone: {
      tel: '+886971615306',
      display: { en: '+886 971 615 306', zh: '0971-615-306' },
    },
    location: { en: 'Taipei, Taiwan', zh: '台北市' },
  },
  experience: [
    {
      id: 'justxtor-2026',
      company: { en: 'JustXtar Technology', zh: '集星資通股份有限公司' },
      role: { en: 'Frontend Engineer', zh: '前端工程師' },
      location: { en: 'Neihu, Taipei', zh: '台北市內湖區' },
      startDate: '2026-01',
      endDate: '2026-09',
      projectName: {
        en: 'Community Property Management Admin System',
        zh: '社區物業管理後台系統',
      },
      stack: [
        { en: 'WebRTC Voice Calling', zh: 'WebRTC 語音通話' },
        { en: 'Token Refresh Concurrency', zh: 'Token Refresh 併發控制' },
        { en: 'Network Failure Recovery', zh: '斷線恢復' },
        { en: 'Containerized Deployment', zh: '容器化部署' },
      ],
      bullets: [
        {
          en: 'Developed and deployed the frontend system across 18 business modules, independently handling feature development, shared components, and state management through to production release.',
          zh: '負責前端系統開發與部署，涵蓋 18 個業務模組，從功能開發、共用元件與狀態管理至 Production 上線皆獨立完成。',
        },
        {
          en: 'Implemented a cloud intercom with WebSocket signaling + WebRTC voice calls, handling ICE candidate buffering and heartbeats.',
          zh: '實作雲端對講機：WebSocket 訊令 + WebRTC 語音通話，處理 ICE candidate 緩衝與心跳機制。',
        },
        {
          en: 'Implemented token refresh concurrency control and request replay to prevent duplicate refreshes when multiple requests hit 401 at once.',
          zh: '實作 token refresh 併發控制與請求重放，避免多請求同時 401 時重複刷新。',
        },
        {
          en: 'Handled network interruption scenarios by designing a disconnect error page and recovery flow, improving the user experience under failure conditions.',
          zh: '處理網路中斷情境，設計斷線錯誤頁面與恢復流程，提升異常狀況下的使用者體驗。',
        },
        {
          en: 'Decoupled per-environment API configuration with an Nginx reverse proxy, allowing Staging and Production to share the same Docker image.',
          zh: '使用 Nginx Reverse Proxy 解耦環境 API 設定，使 Staging / Production 共用同一 Docker Image。',
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
      projectName: {
        en: 'Dual-platform Sports Live Streaming Site',
        zh: '雙平台體育直播站',
      },
      stack: [
        { en: 'Server side Rendering', zh: 'SSR' },
        { en: 'Anti-blocking Domain Failover', zh: '抗封鎖域名切換' },
        { en: 'Cross-platform', zh: '跨平台開發' },
        { en: 'Mobile Compatibility', zh: '行動裝置相容性' },
        { en: 'PWA', zh: 'PWA' },
      ],
      bullets: [
        {
          en: 'Developed and maintained the web platform with Next.js 14, building real-time messaging, multi-language support, and form submission features.',
          zh: '使用 Next.js 14 開發與維護 Web 平台，負責即時通訊、多國語系、表單提交等功能開發。',
        },
        {
          en: 'Built the mobile SPA with React Router and Vite, and contributed to PWA feature development and maintenance.',
          zh: '使用 React Router、Vite 開發手機版 SPA，參與 PWA 功能開發與維護。',
        },
        {
          en: 'Diagnosed and fixed cross-device UI compatibility issues, applying CSS adjustments for specific devices and resolving layout shifts caused by iOS Safe Area and the on-screen keyboard.',
          zh: '排查並修正跨裝置 UI 相容性問題，針對特殊機型進行 CSS 調整，並處理 iOS Safe Area 與鍵盤彈出造成的畫面位移問題。',
        },
        {
          en: "Contributed to the project's dynamic domain-switching mechanism, preventing fixed domains from being blocked by the Great Firewall and improving site availability and survivability.",
          zh: '參與專案中的動態域名切換機制，避免固定域名被中國網路長城封鎖，提升網站可用性與存活率。',
        },
        {
          en: 'Set up the AWS Route 53, CloudFront, and S3 deployment architecture, covering DNS resolution, CDN, and static frontend asset hosting.',
          zh: '建置 AWS Route 53、CloudFront、S3 部署架構，完成網域解析、CDN 與前端靜態資源託管。',
        },
        {
          en: 'Built the gift-sending system with SignalR, syncing gift animations in real time across all connected clients.',
          zh: '使用 SignalR 開發送禮系統，達成禮物動畫在所有使用者端即時同步顯示。',
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
        { en: 'Browser-based Remote Access', zh: '瀏覽器遠端操作' },
        { en: 'Real-time Progress Streaming', zh: '即時進度回傳' },
        { en: 'Canvas Rendering', zh: 'Canvas 繪圖' },
        { en: 'Performance Optimization', zh: '效能優化' },
        { en: 'Full-stack Development', zh: '全端開發' },
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
        en: 'Calls kept failing to connect: ICE candidates often arrived over WebSocket before the remote description was set, so adding them failed.',
        zh: '通話一開始每次都連不上：ICE candidate 經由 WebSocket 傳來時，remote description 常常還沒設定好，直接加入就會失敗。',
      },
      solution: {
        en: 'Combined WebSocket signaling with WebRTC peer connections, buffering ICE candidates that arrive before the connection is ready, and adding a heartbeat to detect drops.',
        zh: '整合 WebSocket 訊令傳輸與 WebRTC peer connection，緩衝在連線就緒前到達的 ICE candidate，並加入心跳機制偵測斷線。',
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
};
