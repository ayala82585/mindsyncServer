import * as dal from "../dal/IdeaResponseDal";
import { IdeaResponse } from "../models/IdeaResponse";

export const createResponse = async (data: IdeaResponse) => {
  return dal.addResponse(data);
};
export const editResponse = async (id: number, data: Partial<IdeaResponse>) => {
  return dal.updateResponse(id, data);
};
export const removeResponse = async (id: number) => {
  await dal.deleteResponse(id);
};
export const getResponses = async (ideaId: number) => {
  return dal.getResponsesByIdea(ideaId);
};