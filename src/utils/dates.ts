export const getDailyBalanceId = () => {
  const currentDate = new Date();
  return parseInt(
    `${currentDate.getDate()}${
      currentDate.getMonth() + 1
    }${currentDate.getFullYear()}`
  );
};
