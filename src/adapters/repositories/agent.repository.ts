import { FilterQuery, ObjectId, Types } from "mongoose";
import { Iagent } from "../../domain/entities/agent/agent";
import agentModel from "../database/models/agent.model";

export class AgentRepository {
  async createAgent(user: Iagent): Promise<Iagent> {
    const agentCreate = await agentModel.create(user);
    if (!agentCreate) {
      return agentCreate;
    }
    const agent: Iagent = {
      ...(agentCreate.toObject() as unknown as Iagent),
      _id: agentCreate._id as string,
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
  async getAllAgenciesData(
    query: FilterQuery<Iagent>,
    page: number,
    limit: number,
    filterData: object
  ): Promise<Iagent[] | null> {
    const completedQuery = { ...query, ...filterData };
    const agencies = await agentModel
      .find(completedQuery)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()
      .sort({ createdAt: -1 });
    if (agencies) {
      return agencies.map((agency) => ({
        ...agency,
        _id: agency._id as string,
      }));
    }
    return null;
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
  async addRefreshToken(id: string, refreshToken: string): Promise<void> {
    const agent: Iagent | null = await agentModel.findOneAndUpdate(
      { _id: id },
      { $set: { refreshToken } },
      { new: true }
    );
  }
  async countAgencies(
    query: FilterQuery<Iagent>,
    filterData: object
  ): Promise<number> {
    const completedQuery = { ...query, ...filterData };
    return await agentModel.countDocuments(completedQuery);
  }
  async updateAgent(id: string, agent: Iagent): Promise<Iagent | null> {
    const updatedAgent: Iagent | null = await agentModel.findOneAndUpdate(
      { _id: id },
      { $set: agent },
      { new: true }
    );
    return updatedAgent;
  }
  async updatePassword(
    id: string,
    newPassword: string
  ): Promise<Iagent | null> {
    const updatedAgent: Iagent | null = await agentModel.findOneAndUpdate(
      { _id: id },
      { $set: { password: newPassword } },
      { new: true }
    );
    return updatedAgent;
  }
  async getAllAgentCount(): Promise<{
    agentcount: number;
    unblockedagent: number;
  }> {
    try {
      const agentcount = await agentModel.countDocuments();
      const unblockedagent = await agentModel.countDocuments({
        is_block: false,
      });
      return { agentcount, unblockedagent };
    } catch (error) {
      throw error;
    }
  }
  async unconfirmedagent(): Promise<Iagent[] | null> {
    try {
      const agent = await agentModel.find({ admin_verified: "pending",is_block:false },{_id:1,agency_name:1,profile_picture:1,createdAt:1}).limit(5);
      return agent as unknown as Iagent[]
    } catch (error) {
      throw error;
    }
  }
  async getAllagent(): Promise<Iagent[] | null> {
    try {
      const agent = await agentModel.find({is_block:false},{_id:1,agency_name:1})
      return agent as unknown as Iagent[]
    } catch (error) {
      throw error;
    }
  }
}
