import { IBirthChart, IPlanet, IHouse } from '../models/Kundali';

/**
 * Simplified Kundali calculation based on birth data
 * This is a basic implementation for MVP purposes
 * In production, you would use a proper astronomical library
 */

const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

const PLANETS = [
  'Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'
];

const HOUSES = Array.from({ length: 12 }, (_, i) => i + 1);

/**
 * Calculate zodiac sign from birth date
 */
export const calculateZodiacSign = (dateOfBirth: Date): string => {
  const month = dateOfBirth.getMonth() + 1;
  const day = dateOfBirth.getDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricorn';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius';
  return 'Pisces';
};

/**
 * Calculate ascendant (Lagna) from birth time
 * Simplified calculation based on birth hour
 */
export const calculateAscendant = (_dateOfBirth: Date, timeOfBirth: string): string => {
  const [hours] = timeOfBirth.split(':').map(Number);
  const signIndex = (hours % 12) % 12;
  return ZODIAC_SIGNS[signIndex];
};

/**
 * Calculate moon sign from birth date and time
 * Simplified calculation
 */
export const calculateMoonSign = (dateOfBirth: Date, timeOfBirth: string): string => {
  const dayOfMonth = dateOfBirth.getDate();
  const [hours] = timeOfBirth.split(':').map(Number);
  const signIndex = (dayOfMonth + hours) % 12;
  return ZODIAC_SIGNS[signIndex];
};

/**
 * Generate planetary positions
 * Simplified calculation for MVP
 */
export const generatePlanetaryPositions = (
  _dateOfBirth: Date,
  timeOfBirth: string
): IPlanet[] => {
  const [hours, minutes] = timeOfBirth.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes;

  return PLANETS.map((planet, index) => {
    const degree = (totalMinutes + index * 30) % 360;
    const signIndex = Math.floor(degree / 30) % 12;
    const house = ((index + Math.floor(totalMinutes / 120)) % 12) + 1;

    return {
      name: planet,
      sign: ZODIAC_SIGNS[signIndex],
      degree: degree % 30,
      house,
    };
  });
};

/**
 * Generate house positions
 */
export const generateHousePositions = (
  _dateOfBirth: Date,
  timeOfBirth: string
): IHouse[] => {
  const [hours, minutes] = timeOfBirth.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes;

  return HOUSES.map((houseNumber) => {
    const degree = (totalMinutes + houseNumber * 30) % 360;
    const signIndex = Math.floor(degree / 30) % 12;

    return {
      number: houseNumber,
      sign: ZODIAC_SIGNS[signIndex],
      degree: degree % 30,
    };
  });
};

/**
 * Calculate complete birth chart
 */
export const calculateBirthChart = (
  dateOfBirth: Date,
  timeOfBirth: string
): IBirthChart => {
  return {
    planets: generatePlanetaryPositions(dateOfBirth, timeOfBirth),
    houses: generateHousePositions(dateOfBirth, timeOfBirth),
    ascendant: calculateAscendant(dateOfBirth, timeOfBirth),
    moonSign: calculateMoonSign(dateOfBirth, timeOfBirth),
  };
};
