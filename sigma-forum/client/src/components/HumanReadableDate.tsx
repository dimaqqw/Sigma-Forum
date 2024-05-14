import { FC } from 'react';

interface Props {
  dateString: string;
}

const HumanReadableDate: FC<Props> = (props: Props) => {
  const { dateString } = props;
  const date = new Date(dateString);
  const now = new Date();

  const diff = Math.abs(now.getTime() - date.getTime());
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  // 1день 2дня 3дня 4дня 5дней 6дней 7дней 8дней 9дней 10дней..
  let humanReadableDate = '';
  if (days > 0) {
    humanReadableDate = `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (hours > 0) {
    humanReadableDate = `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (minutes > 0) {
    humanReadableDate = `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else {
    humanReadableDate = `just now`;
  }

  return <div className=" text-sm text-neutral-300">{humanReadableDate}</div>;
};

export default HumanReadableDate;
