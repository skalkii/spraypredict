// Stull 2011 wet-bulb approximation (Bull. Amer. Meteor. Soc.).
// Accurate within ~0.3°C for RH 5-99% and T -20 to 50°C at sea level.
export function wetBulbC(tempC: number, relHumidity: number): number {
  const T = tempC;
  const RH = Math.max(1, Math.min(100, relHumidity));
  return (
    T * Math.atan(0.151977 * Math.sqrt(RH + 8.313659)) +
    Math.atan(T + RH) -
    Math.atan(RH - 1.676331) +
    0.00391838 * Math.pow(RH, 1.5) * Math.atan(0.023101 * RH) -
    4.686035
  );
}

export function deltaT(tempC: number, relHumidity: number): number {
  return tempC - wetBulbC(tempC, relHumidity);
}
