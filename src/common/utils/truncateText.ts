export const extractAddress = (address: string | undefined) => {
  if (!address) return '';

  const parts = address.split(',').map((p) => p.trim()); // Tách & loại bỏ khoảng trắng thừa

  if (parts.length < 2) return address; // Nếu không có đủ dấu ',' thì giữ nguyên

  const firstPart = parts[0]; // Trước dấu ',' đầu tiên
  const lastPart = parts[parts.length - 1]; // Sau dấu ',' cuối cùng
  const beforeLastPart = parts[parts.length - 2]; // Trước dấu ',' cuối cùng

  return `${firstPart}, ${beforeLastPart}, ${lastPart}`;
};
