import { ObjectId } from "mongoose";

export interface Iagent {
  _id?: string;
  agency_name?: string;
  email: string;
  phone?: string;
  location: string;
  password: string;
  document?: Express.Multer.File;
  DocumentURL?: string;
  is_verified?: boolean;
  admin_verified?: string;
  is_block?: boolean;
  profile_picture?: string|null;
  refreshToken?: string;
}


export interface AgentRepository {
  getAllAgenciesData(
    query: object,
    page: number,
    limit: number,
    filterData:object
  ): Promise<Iagent[] | null>;
  changeAgentStatus(id: ObjectId, is_block: boolean): Promise<Iagent | null>;
  getAgent(id: string): Promise<Iagent | null>;
  adminVerifyAgent(id: string, admin_verified: string): Promise<Iagent | null>;
  countAgencies(query: object,filterData:object): Promise<number>;
  findAgentByEmail(email: string): Promise<Iagent | null>;
  verifyAgent(email: string): Promise<Iagent | null>;
  changePassword(email: string, password: string): Promise<Iagent | null>;
  getAgent(userId: string): Promise<Iagent | null>;
  createAgent(agent: Iagent): Promise<Iagent>;
  findAgentByEmail(email: string): Promise<Iagent | null>;
  addRefreshToken(id: string | undefined, refreshToken: string): Promise<void>;
  verifyAgent(email: string): Promise<Iagent | null>;
  getAgent(agentId: string): Promise<Iagent | null>;
  updateAgent(agentId: string, agentData: Iagent): Promise<Iagent | null>;
  updatePassword(id: string, newPassword: string): Promise<Iagent | null>;
}

