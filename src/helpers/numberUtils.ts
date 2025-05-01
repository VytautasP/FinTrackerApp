export const formatNumber = (number: number): string => {
    if (isNaN(number)) {
        return '0.00';
    }

  return number.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}