import { ObjectId } from "mongoose";
import { Iagent } from "../../domain/entities/agent/agent";
import agentModel from "../database/models/agentModel";

export class MongoAgentRepository {
  async createAgent(user: Iagent): Promise<Iagent> {
    const agentCreate = await agentModel.create(user);
    if (!agentCreate) {
      return agentCreate;
    }
    const agent: Iagent = {
      ...(agentCreate.toObject() as unknown as Iagent),
      _id: agentCreate._id as ObjectId,
    };
    return agent;
  }
  async findAgentByEmail(email: string): Promise<Iagent | null> {
    const agent: Iagent | null = await agentModel.findOne({ email });
    return agent;
  }
  async verifyAgent(email: string): Promise<Iagent | null> {
    const agent: Iagent | null = await agentModel.findOneAndUpdate(
      { email },
      { $set: { is_verified: true } },
      { new: true }
    );
    return agent;
  }
  async changePassword(
    email: string,
    password: string
  ): Promise<Iagent | null> {
    const agent: Iagent | null = await agentModel.findOneAndUpdate(
      { email },
      { $set: { password: password } },
      { new: true }
    );
    return agent;
  }
  async getAllAgenciesData(): Promise<Iagent[] | null> {
    const agencies: Iagent[] = await agentModel.find();
    return agencies;
  }
  async changeAgentStatus(
    id: ObjectId,
    is_block: boolean
  ): Promise<Iagent | null> {
    const updatedAgent: Iagent | null = await agentModel.findOneAndUpdate(
      { _id: id },
      { $set: { is_block } },
      { new: true }
    );
    return updatedAgent;
  }
  async getAgent(id: string): Promise<Iagent | null> {
    const agent: Iagent | null = await agentModel.findById(id);
    return agent;
  }
  async adminVerifyAgent(
    id: string,
    admin_verified: string
  ): Promise<Iagent | null> {
    const agent: Iagent | null = await agentModel.findOneAndUpdate(
      { _id: id },
      { $set: { admin_verified } },
      { new: true }
    );
    return agent;
  }
  async addRefreshToken(id: ObjectId, refreshToken: string): Promise<void> {
    const agent: Iagent | null = await agentModel.findOneAndUpdate(
      { _id: id },
      { $set: { refreshToken } },
      { new: true }
    );
  }
}
