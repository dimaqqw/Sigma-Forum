import { FC, useEffect, useState } from 'react';
import { Form, useLoaderData } from 'react-router-dom';
import { instance } from '../api/axios.api';
import { IPost, ITopic } from '../types/types';

export const postLoader = async () => {
  const { data } = await instance.get<IPost[]>('/post');
  return data;
};

const Posts: FC = () => {
  const posts = useLoaderData() as IPost[];
  console.log(posts);

  return (
    <>
      <h1>Your posts</h1>
      <br />
      {posts.map((post) => (
        <div key={post.id}>
          <div>{post.topic.title}</div>
          <div>{post.title}</div>
          <div>{post.content}</div>
          <br />
        </div>
      ))}
    </>
  );
};

export default Posts;
