import dayjs from 'dayjs';

export const getCurrentUnixTimestamp = (): number => {
  return dayjs().unix();
};
