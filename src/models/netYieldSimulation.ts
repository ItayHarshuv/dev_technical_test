import mongoose, { Schema, Document } from "mongoose";

export interface INetYieldSimulation extends Document {
  propertyPurchasePrice: number;
  monthlyRentalAmount: number;
  annualRentalFee: number;
  prospectEmailAddress: string;
  createdAt: Date;
}

const NetYieldSimulationSchema: Schema = new Schema(
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

export default mongoose.model<INetYieldSimulation>(
  "NetYieldSimulation",
  NetYieldSimulationSchema,
);
