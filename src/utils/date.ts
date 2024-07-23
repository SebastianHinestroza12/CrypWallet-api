import dayjs from 'dayjs';

export const getCurrentUnixTimestamp = (): number => {
  return dayjs().unix();
};

export const generateAleatorNumber = (): number => {
  return Math.floor(Math.random() * 10000000000);
};