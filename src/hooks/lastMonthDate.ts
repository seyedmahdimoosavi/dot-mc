export function getOneMonthDateRange() {
  const today = new Date();

  const oneMonthAgo = new Date(today);
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  return {
    from: todayToDateString(oneMonthAgo),
    to: todayToDateString(today),
  };
}

function todayToDateString(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
  });
}