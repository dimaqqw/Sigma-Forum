import { FC } from 'react';
import { instance } from '../api/axios.api';
import { useLoaderData } from 'react-router-dom';
import { ITopic } from '../types/types';

export const topicLoader = async () => {
  const { data } = await instance.get<ITopic[]>('/topic');
  return data;
};

const Topics: FC = () => {
  const topics = useLoaderData() as ITopic[];
  console.log(topics);
  return (
    <>
      <div>Topics</div>
      {topics.map((topic) => (
        <div key={topic.id}>
          <p>{topic.title}</p>
        </div>
      ))}
    </>
  );
};

export default Topics;
