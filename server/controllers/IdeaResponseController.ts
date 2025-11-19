import { IdeaResponse } from "../models/IdeaResponse";
import database from '../database';
import { addResponseService, deleteResponseService, fetchResponsesForIdea, updateResponseService } from "../service/IdeaResponseService";

const pool = database.getPool();

export const addResponse = async (req: any, res: any) => {
  try {
        const userId = req.user?.uid;
    const { idea_id,  emoji, text } = req.body;
    if (!idea_id || !userId || (!emoji && !text)) {
      throw new Error("Missing required fields");
    }
    console.log({
      idea_id, userId, text
    });
    const result = await addResponseService(idea_id, userId, emoji, text);
    res.status(201).json(result);

  } catch (error) {
    console.error("Error in addResponse:", error);
    throw error;
  }
};

export const updateResponse = async (req: any, res: any) => {
  try {
    const  id  = Number(req.params.id);
    const data = req.body;
    if (!data.emoji && !data.text) {
      throw new Error("At least one of 'emoji' or 'text' must be provided");
    }
    const result = await updateResponseService(id,data);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in updateResponse:", error);
    throw error;
  }
};

export const deleteResponse = async (req: any, res: any) => {
  try {
    const id = Number(req.params.id);
    await deleteResponseService(id);
    res.status(204).send();
  } catch (error) {
    console.error("Error in deleteResponse:", error);
    throw error;
  }
};

export const getResponsesByIdeaController = async (req: any, res: any) => {
  try {
    const ideaId = Number(req.params.id);
    if (!Number.isInteger(ideaId)) {
      return res.status(400).json({ error: "Invalid idea ID" });
    }

    const responses = await fetchResponsesForIdea(ideaId);
    if (responses.length === 0) {
      return res.status(404).json({ message: "No responses found for this idea" });
    }

    res.status(200).json(responses);
  } catch (err) {
    console.error("Error fetching responses:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
