import mongoose, { Schema, Document } from 'mongoose';

export interface IPlanet {
  name: string;
  sign: string;
  degree: number;
  house: number;
}

export interface IHouse {
  number: number;
  sign: string;
  degree: number;
}

export interface IBirthChart {
  planets: IPlanet[];
  houses: IHouse[];
  ascendant: string;
  moonSign: string;
}

export interface IKundali extends Document {
  userId: mongoose.Types.ObjectId;
  birthChart: IBirthChart;
  createdAt: Date;
  updatedAt: Date;
}

const PlanetSchema = new Schema<IPlanet>({
  name: { type: String, required: true },
  sign: { type: String, required: true },
  degree: { type: Number, required: true },
  house: { type: Number, required: true },
});

const HouseSchema = new Schema<IHouse>({
  number: { type: Number, required: true },
  sign: { type: String, required: true },
  degree: { type: Number, required: true },
});

const BirthChartSchema = new Schema<IBirthChart>({
  planets: [PlanetSchema],
  houses: [HouseSchema],
  ascendant: { type: String, required: true },
  moonSign: { type: String, required: true },
});

const KundaliSchema = new Schema<IKundali>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    birthChart: {
      type: BirthChartSchema,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Kundali = mongoose.model<IKundali>('Kundali', KundaliSchema);
