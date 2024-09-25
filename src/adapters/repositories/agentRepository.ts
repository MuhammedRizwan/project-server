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
    const agent = await agentModel.findOne({ email });
    if (!agent) {
      return agent;
    }
    const agentData: Iagent = {
      ...(agent.toObject() as unknown as Iagent),
      _id: agent._id as ObjectId,
    };
    return agentData;
  }
  async verifyAgent(email: string): Promise<Iagent | null> {
    const updatedAgent = await agentModel.findOneAndUpdate(
      { email },
      { $set: { is_verified: true } },
      { new: true }
    );
    if (!updatedAgent) {
      return null;
    }
    const agentData: Iagent = {
      ...(updatedAgent.toObject() as unknown as Iagent),
      _id: updatedAgent._id as ObjectId,
    };
    return agentData;
  }
  async changePassword(email: string, password: string) {
    const updatedAgent = await agentModel.findOneAndUpdate(
      { email },
      { $set: { password: password } },
      { new: true }
    );
    if (!updatedAgent) {
      return null;
    }
    const agentData: Iagent = {
      ...(updatedAgent.toObject() as unknown as Iagent),
      _id: updatedAgent._id as ObjectId,
    };
    return agentData;
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
  async getAgent(id:string):Promise<Iagent|null>{
    const agent:Iagent|null=await agentModel.findById(id)
    return agent
  }
  async adminVerifyAgent(id:string,admin_verified:string):Promise<Iagent|null>{
    const agent:Iagent|null=await agentModel.findOneAndUpdate({_id:id}, { $set: { admin_verified }},{new:true})    
    return agent
  }
}
