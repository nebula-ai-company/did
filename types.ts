export enum AppView {
  HOME = 'HOME',
  LOBBY = 'LOBBY',
  MEETING = 'MEETING',
  SETTINGS = 'SETTINGS',
  SUMMARY = 'SUMMARY',
  LOGIN = 'LOGIN',
  SIGNUP = 'SIGNUP'
}

export interface Participant {
  id: string;
  name: string;
  isHost: boolean;
  isMe: boolean;
  videoOn: boolean;
  audioOn: boolean;
  isSpeaking: boolean;
  isScreenSharing: boolean;
  isHandRaised?: boolean;
  connectionQuality: 'good' | 'fair' | 'poor';
  avatarUrl?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isSystem?: boolean;
}

export interface MeetingState {
  id: string;
  title: string;
  durationSeconds: number;
  participants: Participant[];
  chatMessages: ChatMessage[];
  isScreenSharing: boolean;
  isRecording: boolean;
  sidebarMode: 'none' | 'chat' | 'participants' | 'notes';
}

export interface UserSettings {
  displayName: string;
  videoDeviceId: string;
  audioDeviceId: string;
  audioOutputId: string;
  videoEnabled: boolean;
  audioEnabled: boolean;
  theme: 'light' | 'dark';
  lowDataMode: boolean;
}