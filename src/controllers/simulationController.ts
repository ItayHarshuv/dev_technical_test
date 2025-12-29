import { Request, Response } from "express";
import NetYieldSimulation from "../models/netYieldSimulation";

interface SimulationRequestBody {
  propertyPurchasePrice: number;
  monthlyRentalAmount: number;
  annualRentalFee: number;
  prospectEmailAddress: string;
}

export const createSimulation = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const {
      propertyPurchasePrice,
      monthlyRentalAmount,
      annualRentalFee,
      prospectEmailAddress,
    }: SimulationRequestBody = req.body;

    if (
      !propertyPurchasePrice ||
      !monthlyRentalAmount ||
      !annualRentalFee ||
      !prospectEmailAddress
    ) {
      res.status(400).json({
        error: "Missing required fields",
        message:
          "All fields (propertyPurchasePrice, monthlyRentalAmount, annualRentalFee, prospectEmailAddress) are required",
      });
      return;
    }

    if (
      propertyPurchasePrice <= 0 ||
      monthlyRentalAmount <= 0 ||
      annualRentalFee <= 0
    ) {
      res.status(400).json({
        error: "Invalid input values",
        message:
          "Purchase price, monthly rent, and annual fee must be greater than zero",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(prospectEmailAddress)) {
      res.status(400).json({
        error: "Invalid email format",
        message: "Please provide a valid email address",
      });
      return;
    }

    const simulation = new NetYieldSimulation({
      propertyPurchasePrice,
      monthlyRentalAmount,
      annualRentalFee,
      prospectEmailAddress,
    });

    const savedSimulation = await simulation.save();

    res.status(201).json({
      success: true,
      data: savedSimulation,
    });
  } catch (error) {
    console.error("Error creating simulation:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to save simulation",
    });
  }
};
