export const getTimeAgo = (postedAtTime: string) => {
	const postedAt = new Date(postedAtTime);
	const now = new Date();
	const prevSeconds = postedAt.getSeconds();
	const prevMinutes = postedAt.getMinutes();
	const prevHours = postedAt.getHours();
	const prevMonth = postedAt.getMonth();
	const prevDate = postedAt.getDate();
	const prevYear = postedAt.getFullYear();
	const nowSeconds = now.getSeconds();
	const nowMinutes = now.getMinutes();
	const nowHours = now.getHours();
	const nowMonth = now.getMonth();
	const nowDate = now.getDate();
	const nowYear = now.getFullYear();
	if (
		prevYear === nowYear &&
		prevMonth === nowMonth &&
		prevDate === nowDate &&
		prevHours === nowHours &&
		prevMinutes === nowMinutes
	) {
		return `${nowSeconds - prevSeconds} seconds ago`;
	} else if (
		prevYear === nowYear &&
		prevMonth === nowMonth &&
		prevDate === nowDate &&
		prevHours === nowHours
	) {
		return `${nowMinutes - prevMinutes} minutes ago`;
	} else if (
		prevYear === nowYear &&
		prevMonth === nowMonth &&
		prevDate === nowDate
	) {
		return `${nowHours - prevHours} hours ago`;
	} else if (prevYear === nowYear && prevMonth === nowMonth) {
		return `${nowMonth - prevMonth} days ago`;
	} else if (prevYear === nowYear) {
		return `${nowHours - prevHours} months ago`;
	} else {
		return `${nowYear - prevYear} years ago`;
	}
};
