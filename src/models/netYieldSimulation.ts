import mongoose, { Schema, Document } from "mongoose";

export interface NetYieldSimulation extends Document {
  propertyPurchasePrice: number;
  monthlyRentalAmount: number;
  annualRentalFee: number;
  prospectEmailAddress: string;
  createdAt: Date;
}

const NetYieldSimulationSchema = new Schema(
  {
    propertyPurchasePrice: {
      type: Number,
      required: true,
      min: 0,
    },
    monthlyRentalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    annualRentalFee: {
      type: Number,
      required: true,
      min: 0,
    },
    prospectEmailAddress: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "Net yield return simulations",
  },
);

export default mongoose.model<NetYieldSimulation>(
  "NetYieldSimulation",
  NetYieldSimulationSchema,
);
