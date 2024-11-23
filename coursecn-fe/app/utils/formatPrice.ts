export const formatPrice = (price: number): string => {
  if (!price) return "0 ₫";
  return price?.toLocaleString("vi-VN") + " ₫";
};
