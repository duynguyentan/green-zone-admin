export const toVNDFormat = (value: number | string): string => {
  if (!value) return '';
  const numericValue = Number(
    value.toString().replace(/\./g, '').replace(/,/g, '')
  );

  if (isNaN(numericValue)) {
    throw new Error('Invalid number format');
  }

  const formatted = new Intl.NumberFormat('vi-VN').format(numericValue);

  return `₫${formatted}`;
};
