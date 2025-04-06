export interface LoginResponse {
  success: boolean
  jwt: string
}

export interface EventResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    size: number
  }
}

export interface PatchInfo {
  Description: string
  HotFixID: string
  InstalledBy: string
  InstalledOn: string
}

export interface ClientInfo {
  uuid: string;
  ip: string[]; // ✅ 添加缺失的 ip 字段
  SystemInfo: SystemInfo;
}

export interface SystemInfo {
  os_arch: string;
  os_name: string;
  os_version: string;
  patchs: PatchInfo[]; 
}

export interface GetClientsResponse {
  clients: ClientInfo[]
}

export interface LoginEvent {
  EventID: number
  EventTime: string
  MachineUUID: string
  LoginType: string
  Username: string
  SubjectDomain: string
  SourceIP: string
  SubjectUser: string
  ProcessName: string
}

export interface RDPEvent {
  ID: number
  UUID: string
  EventID: string
  LoginName: string
  Address: string
  Domain: string
  Description: string
}

export interface ServiceInfo {
  ID: number
  ServiceName: string
  ImagePath: string
  StartType: string
  Account: string
  Description: string
  UUID: string
  EventID: string
}

export interface ProcessEvent {
  ID: number
  UUID: string
  EventID: string
  Create_User: string
  Create_User_Domain: string
  NewProcessName: string
  ParentProcessName: string
  CommandLine: string
  Description: string
}

export interface PowerShellEvent {
  ID: number
  UUID: string
  EventID: string
  Command: string
  Description: string
}

export interface SystemEvent {
  ID: number
  UUID: string
  EventID: string
  LevelDisplayName: string
  Description: string
}

export interface ApplicationEvent {
  ID: number
  UUID: string
  CreateTime: string
  EventID: string
  LevelDisplayName: string
  Description: string
}

export interface SecurityEvent {
  ID: number
  UUID: string
  EventID: string
  LevelDisplayName: string
  Description: string
}

export interface SearchOptions {
  clientId?: string
  uuid?: string
  ip?: string
  eventId?: number
  [key: string]: any
}
