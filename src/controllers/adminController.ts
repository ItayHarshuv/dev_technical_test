import { Request, Response } from "express";
import NetYieldSimulation from "../models/netYieldSimulation";

interface SimulationWithCalculations {
  propertyPurchasePrice: number;
  monthlyRentalAmount: number;
  annualRentalFee: number;
  prospectEmailAddress: string;
  createdAt: Date;
  threeYearMonthlyAverageNetIncome: number;
  monthlyNetReturnForThreeYears: number;
}

export const getAdmin = async (_req: Request, res: Response): Promise<void> => {
  try {
    const simulations = await NetYieldSimulation.find()
      .sort({ createdAt: -1 })
      .exec();

    const simulationsWithCalculations: SimulationWithCalculations[] =
      simulations.map((sim) => {
        const threeYearRent = sim.monthlyRentalAmount * 12 * 3;
        const threeYearFee = sim.annualRentalFee * 3;
        const threeYearCommission =
          sim.monthlyRentalAmount * 12 * (0.3 + 0.25 + 0.2);
        const threeYearMonthlyAverageNetIncome =
          (threeYearRent - threeYearFee - threeYearCommission) / 36;
        const monthlyNetReturnForThreeYears =
          (threeYearMonthlyAverageNetIncome / sim.propertyPurchasePrice) * 100;

        return {
          propertyPurchasePrice: sim.propertyPurchasePrice,
          monthlyRentalAmount: sim.monthlyRentalAmount,
          annualRentalFee: sim.annualRentalFee,
          prospectEmailAddress: sim.prospectEmailAddress,
          createdAt: sim.createdAt,
          threeYearMonthlyAverageNetIncome,
          monthlyNetReturnForThreeYears,
        };
      });

    res.render("pages/admin", {
      title: "Admin - Simulations",
      simulations: simulationsWithCalculations,
    });
  } catch (error) {
    console.error("Error fetching simulations:", error);
    res.status(500).render("pages/admin", {
      title: "Admin - Simulations",
      simulations: [],
      error: "Failed to load simulations",
    });
  }
};
