// TODO: check if I need this function
export const isSameDay = (otherDate: Date, todayDate: Date = new Date()) =>
  otherDate.getDate() === todayDate.getDate() &&
  otherDate.getMonth() === todayDate.getMonth() &&
  otherDate.getFullYear() === todayDate.getFullYear();

export const getDailyBalanceId = () => {
  const currentDate = new Date();
  return parseInt(
    `${currentDate.getDate()}${currentDate.getMonth()+1}${currentDate.getFullYear()}`
  );
}