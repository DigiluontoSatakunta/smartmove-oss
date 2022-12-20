export const median = values => {
  try {
    const sorted = values.sort((a, b) => a - b);
    const half = Math.floor(sorted.length / 2);
    if (sorted.length % 2) return sorted[half];
    return (sorted[half - 1] + sorted[half]) / 2.0;
  } catch (error) {
    console.error(error);
    return 0;
  }
};
