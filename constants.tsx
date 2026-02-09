import { Participant } from './types';

export const MOCK_PARTICIPANTS: Participant[] = [
  {
    id: 'me',
    name: 'شما (میزبان)',
    isHost: true,
    isMe: true,
    videoOn: true,
    audioOn: true,
    isSpeaking: false,
    isScreenSharing: false,
    connectionQuality: 'good',
    avatarUrl: 'https://picsum.photos/200/200',
  },
  {
    id: 'p1',
    name: 'سارا احمدی',
    isHost: false,
    isMe: false,
    videoOn: true,
    audioOn: false,
    isSpeaking: false,
    isScreenSharing: false,
    connectionQuality: 'good',
    avatarUrl: 'https://picsum.photos/201/200',
  },
  {
    id: 'p2',
    name: 'علی رضایی',
    isHost: false,
    isMe: false,
    videoOn: false,
    audioOn: true,
    isSpeaking: true,
    isScreenSharing: false,
    connectionQuality: 'fair',
    avatarUrl: 'https://picsum.photos/202/200',
  },
  {
    id: 'p3',
    name: 'مریم کمالی',
    isHost: false,
    isMe: false,
    videoOn: true,
    audioOn: false,
    isSpeaking: false,
    isScreenSharing: false,
    connectionQuality: 'poor',
    avatarUrl: 'https://picsum.photos/203/200',
  },
  {
    id: 'p4',
    name: 'حسین محمدی',
    isHost: false,
    isMe: false,
    videoOn: true,
    audioOn: false,
    isSpeaking: false,
    isScreenSharing: false,
    connectionQuality: 'good',
    avatarUrl: 'https://picsum.photos/204/200',
  }
];

export const INITIAL_CHAT_MESSAGES = [
  {
    id: '1',
    senderId: 'p1',
    senderName: 'سارا احمدی',
    text: 'سلام به همگی، صدای من رو دارید؟',
    timestamp: '۱۰:۰۲',
  },
  {
    id: '2',
    senderId: 'me',
    senderName: 'شما',
    text: 'بله سارا جان، صدا عالیه.',
    timestamp: '۱۰:۰۳',
  }
];
