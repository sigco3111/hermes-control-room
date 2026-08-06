// Random office events that trigger periodically

export interface RandomOfficeEvent {
  id: string
  name: string
  slackAnnouncement: string
  duration: number // ms
  type: 'all-move' | 'single-agent' | 'visual-only' | 'slack-only'
  targetPosition?: { x: number; y: number }
  agentMessages?: string[]
  managerMessage?: string
  sound?: 'alarm' | 'celebration' | 'doorOpen' | 'error' | 'powerDown' | 'notification' | 'coffee'
}

export const RANDOM_EVENTS: RandomOfficeEvent[] = [
  {
    id: 'fire-drill',
    name: '소방 훈련',
    slackAnnouncement: '🚨 소방 훈련! 출구로 대피하세요!',
    duration: 6000,
    type: 'all-move',
    targetPosition: { x: 114, y: 105 },
    managerMessage: '소방 훈련! 어서 움직이세요!',
    agentMessages: ['또...?', '집중하고 있었는데!', '내 커피!', '코드베이스 저장!'],
    sound: 'alarm',
  },
  {
    id: 'pizza',
    name: '피자 배달',
    slackAnnouncement: '🍕 피자가 도착했습니다! 점심 무료!',
    duration: 5000,
    type: 'all-move',
    targetPosition: { x: 114, y: 105 },
    managerMessage: '로비에 피자 도착!',
    agentMessages: ['피자!', '드디어 좋은 소식', '파인애플?', '페퍼로니 내가 먼저'],
    sound: 'celebration',
  },
  {
    id: 'standup',
    name: '일일 스탠드업',
    slackAnnouncement: '📢 @here 일일 스탠드업 시작합니다',
    duration: 7000,
    type: 'all-move',
    targetPosition: { x: 411, y: 417 },
    managerMessage: '스탠드업! 오늘 뭐 했어요?',
    agentMessages: ['그냥 일 한 거요', '아직 디버깅 중', '리뷰에서 막혔어요', '스테이징 배포 완료', '버그 3개 수정, 5개 추가'],
    sound: 'notification',
  },
  {
    id: 'deploy',
    name: '프로덕션 배포',
    slackAnnouncement: '🚀 프로덕션 배포 중...',
    duration: 5000,
    type: 'slack-only',
    managerMessage: '숨 참고 있어요...',
    agentMessages: ['이런', '제발 안 깨져라', '테스트 안 돌렸는데', 'YOLO', '롤백 플랜 확인'],
    sound: 'notification',
  },
  {
    id: 'deploy-success',
    name: '배포 성공',
    slackAnnouncement: '✅ 배포 성공! 모든 시스템 정상 🎉',
    duration: 3000,
    type: 'slack-only',
    managerMessage: '해냈어요!',
    agentMessages: ['가보자고!', '출하!', '팀 잘했어요', '맥주 한 잔 해야지'],
    sound: 'celebration',
  },
  {
    id: 'deploy-fail',
    name: '배포 실패',
    slackAnnouncement: '💥 배포 실패 — 롤백 중',
    duration: 4000,
    type: 'slack-only',
    managerMessage: '누가 푸시한 거야?!',
    agentMessages: ['저 아닙니다', '이런 이런 이런', '로그 확인 중', '항상 DNS 문제', '롤백 중...'],
    sound: 'error',
  },
  {
    id: 'power-flicker',
    name: '정전 깜빡임',
    slackAnnouncement: '⚡ 정전 깜빡임 — 작업 저장하세요!',
    duration: 3000,
    type: 'visual-only',
    agentMessages: ['불이 깜빡였어?', 'Ctrl+S Ctrl+S', '내 저장 안 한 변경!', '지금 git commit!'],
    sound: 'powerDown',
  },
  {
    id: 'birthday',
    name: '생일',
    slackAnnouncement: '🎂 생일 축하합니다! 휴게실에 케이크!',
    duration: 4000,
    type: 'all-move',
    targetPosition: { x: 287, y: 129 },
    managerMessage: '생일 축하해요!',
    agentMessages: ['케이크!', '생일 축하해요!', '🎉🎉🎉', '글루텐 프리?', '소원 빌어요'],
    sound: 'celebration',
  },
  {
    id: 'who-broke-build',
    name: '빌드 깨짐',
    slackAnnouncement: '🔴 CI/CD 파이프라인 빨강. 누가 빌드 깼어요?',
    duration: 5000,
    type: 'slack-only',
    managerMessage: '이거 고칠 때까지 아무도 퇴근 불가.',
    agentMessages: ['git blame 확인 중...', '저 아닙니다', '머지 때문?', '불안정한 테스트?', '인턴 탓'],
    sound: 'error',
  },
  {
    id: 'friday',
    name: '금요일 분위기',
    slackAnnouncement: '🎉 금요일이에요! 거의 다 왔어요!',
    duration: 3000,
    type: 'slack-only',
    managerMessage: '금요일은 배포 안 합니다.',
    agentMessages: ['TGIF', '술집?', 'PR 하나만 더...', '5시에 칼퇴', '주말!'],
    sound: 'celebration',
  },
  {
    id: 'printer-jam',
    name: '프린터 걸림',
    slackAnnouncement: '🖨️ 프린터 또 걸렸습니다',
    duration: 4000,
    type: 'single-agent',
    targetPosition: { x: 424, y: 132 },
    agentMessages: ['왜 아직도 프린터가 있죠', 'PC LOAD LETTER?!', '누가 인쇄해요', '2026년인데...'],
    sound: 'error',
  },
  {
    id: 'slack-down',
    name: 'Slack 장애',
    slackAnnouncement: '💀 Slack 장애... 근데 이건 어떻게 게시하고 있지?',
    duration: 3000,
    type: 'slack-only',
    agentMessages: ['아이러니', '이메일 시대', '전서구 시대', '생각보다 평화로움'],
    sound: 'notification',
  },
]

// Office drama conversations
export const DRAMA_CONVERSATIONS = [
  {
    trigger: 'coffee-meet',
    messages: [
      { sender: 0, text: '새 PR 봤어요?' },
      { sender: 1, text: '2000줄짜리? 네...' },
      { sender: 0, text: '테스트도 없음' },
      { sender: 1, text: '💀' },
    ],
  },
  {
    trigger: 'who-pushed',
    messages: [
      { sender: 0, text: '누가 main에 바로 푸시한 거야?' },
      { sender: 1, text: '저 아니에요' },
      { sender: 0, text: 'git blame이 말해주는데' },
      { sender: 1, text: '...' },
    ],
  },
  {
    trigger: 'tabs-vs-spaces',
    messages: [
      { sender: 0, text: '탭 vs 스페이스?' },
      { sender: 1, text: '당연히 스페이스죠' },
      { sender: 0, text: '차단하고 리포트 보냈음' },
    ],
  },
  {
    trigger: 'meeting',
    messages: [
      { sender: 0, text: '이 회의는 슬랙 메시지로 충분했을 듯' },
      { sender: 1, text: '이 슬랙 메시지는 침묵으로 충분했을 듯' },
    ],
  },
  {
    trigger: 'framework',
    messages: [
      { sender: 0, text: 'Rust로 다시 쓰는 게 어때요?' },
      { sender: 1, text: '매주 같은 말 하잖아요' },
      { sender: 0, text: '매주 맞잖아요' },
    ],
  },
  {
    trigger: 'legacy',
    messages: [
      { sender: 0, text: '2019년 TODO 발견' },
      { sender: 1, text: '뭐라고 적혀있는데' },
      { sender: 0, text: '"나중에 고치기"' },
      { sender: 1, text: '나중이 지금인데' },
      { sender: 0, text: '아니. 나중은 나중.' },
    ],
  },
  {
    trigger: 'ai',
    messages: [
      { sender: 0, text: '오늘 AI가 나보다 더 잘 코딩했음' },
      { sender: 1, text: '기준이 낮긴 함' },
      { sender: 0, text: '무례하지만 사실' },
    ],
  },
  {
    trigger: 'standup-excuse',
    messages: [
      { sender: 0, text: '어제 뭐 했어요?' },
      { sender: 1, text: '복잡한 이슈 조사' },
      { sender: 0, text: '6시간 구글링했다는 뜻이죠' },
      { sender: 1, text: '"연구"라는 말이 더 좋아요' },
    ],
  },
]

// Slack reactions that randomly appear on messages
export const SLACK_REACTIONS = ['👍', '🔥', '💀', '😂', '🚀', '❤️', '👀', '💯', '🎉', '😅', '🤔', '⚡']

// Dunder Mifflin themed events — used when Office theme is active
export const OFFICE_EVENTS: RandomOfficeEvent[] = [
  {
    id: 'fire-alarm-stress-relief',
    name: '불! 불! 불!',
    slackAnnouncement: '🔥 불! 불! 불! (Dwight가 소방 훈련 중)',
    duration: 6000,
    type: 'all-move',
    targetPosition: { x: 114, y: 105 },
    managerMessage: '불이 우리한테 날아온다!',
    agentMessages: ['불!', '이런 젠장', 'Bandit 살려!', '파산을 선언한다!', '제세동기 가져와!'],
    sound: 'alarm',
  },
  {
    id: 'cpr-training',
    name: 'Stayin Alive',
    slackAnnouncement: '🫀 CPR 훈련 — Stayin Alive 비트에 맞춰 압박',
    duration: 5000,
    type: 'slack-only',
    managerMessage: '아 아 아 아, 살아있어, 살아있어',
    agentMessages: ['...죽은 거야?', 'Dwight가 얼굴을 자르는 중', '나는 ER에서 배웠음', '아 아 아 아'],
    sound: 'notification',
  },
  {
    id: 'golden-ticket',
    name: '골든 티켓',
    slackAnnouncement: '🎫 종이뭉치에 5개의 골든 티켓 — 10% 할인!',
    duration: 4000,
    type: 'slack-only',
    managerMessage: '다 내 아이디어. 다 나였어.',
    agentMessages: ['Kevin 탓', '윌리 웡카 타임', '그거 다 Michael', '누가 승인한 거야'],
    sound: 'celebration',
  },
  {
    id: 'jim-prank',
    name: 'Jim이 Dwight 장난',
    slackAnnouncement: '🥤 누가 Dwight의 스테이플러를 또 젤리에 넣었음',
    duration: 3500,
    type: 'slack-only',
    managerMessage: 'JIM!',
    agentMessages: ['또', '항상 Jim', '신원 도용은 농담 아니야', 'Pam, 도와줘'],
    sound: 'notification',
  },
  {
    id: 'parkour',
    name: '주쿠!',
    slackAnnouncement: '🏃 주쿠! 주쿠! 주쿠!',
    duration: 4000,
    type: 'visual-only',
    managerMessage: '주쿠!',
    agentMessages: ['주쿠!', '주-쿠', 'Michael 안 돼', '이거 결말 좋지 않음'],
    sound: 'celebration',
  },
  {
    id: 'schrute-bucks',
    name: 'Schrute Buck',
    slackAnnouncement: '💵 Dwight가 Schrute Buck 발행. 1센트의 1000분의 1.',
    duration: 3000,
    type: 'slack-only',
    agentMessages: ['환율은요?', '인센티브 없어도 충분', 'Stanley 니켈이 더 나음', '인상 어디?'],
    sound: 'notification',
  },
  {
    id: 'kevins-chili',
    name: 'Kevin의 칠리',
    slackAnnouncement: '🫘 Kevin이 칠리 쏟음. 또.',
    duration: 4000,
    type: 'slack-only',
    managerMessage: '남은 건 퍼서 옮기는 거다...',
    agentMessages: ['싫어', '아침 내내 걸렸는데', '카펫 끝남', '냄비 둘 쓰라고 했는데'],
    sound: 'error',
  },
  {
    id: 'printer-jam-dm',
    name: 'Sabre 프린터',
    slackAnnouncement: '🖨️ 프린터에 불남. 진짜.',
    duration: 4000,
    type: 'single-agent',
    targetPosition: { x: 424, y: 132 },
    agentMessages: ['Sabre 프린터 또', '말했잖아', 'Nellie 부르자', '보증 만료'],
    sound: 'error',
  },
  {
    id: 'dundies',
    name: '더 던디스',
    slackAnnouncement: '🏆 오늘 밤 더 던디스!',
    duration: 4000,
    type: 'slack-only',
    managerMessage: '여러분은 웃게 될 거예요, 울게 될 거예요...',
    agentMessages: ['수염이 가장 빽빽한 사람 시상', '제발 안 다시', '최고의 아빠는 내 거', 'Pam이랑 Chili\'s 갈래'],
    sound: 'celebration',
  },
  {
    id: 'pretzel-day',
    name: '프레첼 데이',
    slackAnnouncement: '🥨 오늘은 프레첼 데이',
    duration: 5000,
    type: 'all-move',
    targetPosition: { x: 287, y: 129 },
    managerMessage: '모르시겠지만, 오늘은 프레첼 데이입니다.',
    agentMessages: ['올해 최고의 날', '모든 칼로리 값어치', 'Stanley가 일년 내내 기다렸음', '토핑 다 넣음'],
    sound: 'celebration',
  },
  {
    id: 'bears-beets',
    name: '곰. 사탕무우. 캍스타 갈락티카.',
    slackAnnouncement: '📋 질문: 어떤 곰이 최고?',
    duration: 3000,
    type: 'slack-only',
    agentMessages: ['아니. 검은 곰.', '곰, 사탕무우, 캍스타 갈락티카', '신원 도용은 농담 아니야, Jim', '사실: 곰은 사탕무우 먹음'],
    sound: 'notification',
  },
]

import { getTheme } from './theme'

export function pickEvent(): RandomOfficeEvent {
  const isOffice = getTheme() === 'office'

  // Deploy events chain together (kept for both themes)
  if (Math.random() < 0.15) {
    return Math.random() < 0.7
      ? RANDOM_EVENTS.find(e => e.id === 'deploy-success')!
      : RANDOM_EVENTS.find(e => e.id === 'deploy-fail')!
  }

  if (isOffice) {
    // 70% Office-themed, 30% default — keeps things varied
    const useOffice = Math.random() < 0.7
    const pool = useOffice
      ? OFFICE_EVENTS
      : RANDOM_EVENTS.filter(e => e.id !== 'deploy-success' && e.id !== 'deploy-fail')
    return pool[Math.floor(Math.random() * pool.length)]
  }

  const pool = RANDOM_EVENTS.filter(e => e.id !== 'deploy-success' && e.id !== 'deploy-fail')
  return pool[Math.floor(Math.random() * pool.length)]
}
