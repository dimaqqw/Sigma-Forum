import { FC, useEffect, useState } from 'react';
import { IPost, ITopic } from '../types/types';

const Home: FC = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [topics, setTopics] = useState<ITopic[]>([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/post')
      .then((response) => response.json())
      .then((data) => setPosts(data))
      .catch((error) => console.log(error));
    fetch('http://localhost:3000/api/topic')
      .then((response) => response.json())
      .then((data) => setTopics(data))
      .catch((error) => console.log(error));
  }, []);
  console.log(posts);
  console.log(topics);

  return (
    <>
      <div>Home</div>
      {/* {topics.map((topic) => (
        <div key={post.id}>
          <div>{post.topic.title}</div>
          <div>{post.title}</div>
          <div>{post.content}</div>
          <br />
        </div>
      ))} */}
      {posts.map((post) => (
        <div key={post.id}>
          <div>{post.topic.title}</div>
          <div>{post.title}</div>
          <div>{post.content}</div>
          <div>
            {post.comments.map((comm) => (
              <div>{comm.content}</div>
            ))}
          </div>
          <br />
        </div>
      ))}
    </>
  );
};

export default Home;
