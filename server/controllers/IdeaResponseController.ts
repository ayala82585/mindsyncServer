import { Request, Response } from "express";
import * as ideaResponseDal from "../dal/IdeaResponseDal";
import { IdeaResponse } from "../models/IdeaResponse";
// הוספת תגובה לרעיון
export const addResponse = async (req: Request, res: Response) => {
  try {
    const data: IdeaResponse = req.body;
    const response = await ideaResponseDal.addResponse(data);
    res.status(201).json(response);
  } catch (err) {
    console.error("Failed to add response:", err);
    res.status(400).json({ error: err || "Error adding response" });
  }
};

export const updateResponse = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const data = req.body;
    const updated = await ideaResponseDal.updateResponse(id, data);
    res.status(200).json(updated);
  } catch (err) {
    console.error("Failed to update response:", err);
    res.status(400).json({ error: err || "Error updating response" });
  }
};

// מחיקת תגובה לרעיון
export const deleteResponse = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await ideaResponseDal.deleteResponse(id);
    res.status(204).send();
  } catch (err) {
    console.error("Failed to delete response:", err);
    res.status(400).json({ error: err || "Error deleting response" });
  }
};

// קבלת כל התגובות לרעיון מסוים
export const getResponsesByIdea = async (req: Request, res: Response) => {
  try {
    const ideaId = Number(req.params.idea_id);
    const responses = await ideaResponseDal.getResponsesByIdea(ideaId);
    res.status(200).json(responses);
  } catch (err) {
    console.error("Failed to get responses:", err);
    res.status(400).json({ error: err || "Error getting responses" });
  }
};