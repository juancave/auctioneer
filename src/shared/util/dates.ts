export const isValidISODate = (isoDate: string): Date | null => {
  try {
    const convertedDate = new Date(isoDate);
    convertedDate.toISOString();

    return convertedDate;
  } catch (error) {
    return null;
  }
};
