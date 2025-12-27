import { Request, Response } from 'express';
import NetYieldSimulation from '../models/netYieldSimulation';

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
        // Fetch all simulations from database
        const simulations = await NetYieldSimulation.find().sort({ createdAt: -1 }).exec();

        // Calculate additional fields for each simulation
        const simulationsWithCalculations: SimulationWithCalculations[] = simulations.map(sim => {
            // Calculate three year rent
            const threeYearRent = sim.monthlyRentalAmount * 12 * 3;
            
            // Calculate three year fee
            const threeYearFee = sim.annualRentalFee * 3;
            
            // Calculate three year commission (0.3 + 0.25 + 0.2 = 0.75 of annual rent)
            const threeYearCommission = (sim.monthlyRentalAmount * 12) * (0.3 + 0.25 + 0.2);
            
            // Calculate average monthly net income over 3 years
            const threeYearMonthlyAverageNetIncome = (threeYearRent - threeYearFee - threeYearCommission) / 36;
            
            // Calculate monthly net return percentage over 3 years
            const monthlyNetReturnForThreeYears = (threeYearMonthlyAverageNetIncome / sim.propertyPurchasePrice) * 100;

            return {
                propertyPurchasePrice: sim.propertyPurchasePrice,
                monthlyRentalAmount: sim.monthlyRentalAmount,
                annualRentalFee: sim.annualRentalFee,
                prospectEmailAddress: sim.prospectEmailAddress,
                createdAt: sim.createdAt,
                threeYearMonthlyAverageNetIncome,
                monthlyNetReturnForThreeYears
            };
        });

        res.render('pages/admin', {
            title: 'Admin - Simulations',
            simulations: simulationsWithCalculations
        });
    } catch (error) {
        console.error('Error fetching simulations:', error);
        res.status(500).render('pages/admin', {
            title: 'Admin - Simulations',
            simulations: [],
            error: 'Failed to load simulations'
        });
    }
};

