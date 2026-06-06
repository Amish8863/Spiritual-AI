import mongoose, { Schema, Document } from 'mongoose';

export interface IHoroscope extends Document {
  zodiacSign: string;
  date: Date;
  timeframe: 'today' | 'tomorrow' | 'weekly';
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const HoroscopeSchema = new Schema<IHoroscope>(
  {
    zodiacSign: {
      type: String,
      required: true,
      enum: [
        'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
        'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
      ],
    },
    date: {
      type: Date,
      required: true,
    },
    timeframe: {
      type: String,
      required: true,
      enum: ['today', 'tomorrow', 'weekly'],
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create compound index for efficient querying
HoroscopeSchema.index({ zodiacSign: 1, date: 1, timeframe: 1 });

export const Horoscope = mongoose.model<IHoroscope>('Horoscope', HoroscopeSchema);
