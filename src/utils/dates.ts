// TODO: check if I need this function
export const isSameDay = (otherDate: Date, todayDate: Date = new Date()) =>
  otherDate.getDate() === todayDate.getDate() &&
  otherDate.getMonth() === todayDate.getMonth() &&
  otherDate.getFullYear() === todayDate.getFullYear();
