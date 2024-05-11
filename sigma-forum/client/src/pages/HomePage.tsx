import { FC, useEffect, useState } from 'react';
import Header from '../components/Header';
import { IPost, ITopic, IComment } from '../types/types';
import HumanReadableDate from '../components/HumanReadableDate ';
import ProtectedRoute from '../components/ProtectedRoute';
import { instance } from '../api/axios.api';
// import socket from '../websocket/websocket';

const HomePage: FC = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [topics, setTopics] = useState<ITopic[]>([]);
  const [showAllComments, setShowAllComments] = useState<boolean>(false);
  const [newCommentContents, setNewCommentContents] = useState<{
    [postId: number]: string;
  }>({});

  const toggleComments = () => {
    setShowAllComments(!showAllComments);
  };

  const handleCommentSubmit = async (postId: number) => {
    const content = newCommentContents[postId];
    if (!content) return;

    try {
      const response = await instance.post(
        `http://localhost:3000/api/comment/`,
        {
          content: content,
          post: postId,
        },
      );

      const data: IComment = response.data;

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, comments: [...post.comments, data] }
            : post,
        ),
      );

      setNewCommentContents((prev) => ({
        ...prev,
        [postId]: '',
      }));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postsResponse = await instance.get(
          'http://localhost:3000/api/post',
        );
        const topicsResponse = await instance.get(
          'http://localhost:3000/api/topic',
        );

        setPosts(postsResponse.data);
        setTopics(topicsResponse.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);
  console.log(posts);

  return (
    <>
      <Header></Header>
      <div className="container mt-4">
        {posts.map((post) => (
          <div className=" rounde mb-2 mt-2 bg-black/30 p-4" key={post.id}>
            <div className="flex">
              <div className=" mr-2">{post.user.username}</div>
              <HumanReadableDate dateString={post.createdAt} />
            </div>
            <div>{post.topic.title}</div>
            <div>{post.title}</div>
            <div>{post.content}</div>
            <div className="border-t-2 border-black">
              {post.comments
                .slice(0, showAllComments ? post.comments.length : 2)
                .map((comm: IComment) => (
                  <div className=" ml-2 mt-2" key={comm.comment_id}>
                    <div className="flex">
                      <div className=" mr-2">{comm.user?.username}</div>
                      <HumanReadableDate dateString={comm.createdAt} />
                    </div>
                    <div>{comm.content}</div>
                  </div>
                ))}
            </div>
            {post.comments.length > 2 && (
              <button
                onClick={toggleComments}
                className="text-black/60 hover:text-black"
              >
                {showAllComments
                  ? 'Скрыть комментарии'
                  : 'Показать все комментарии'}
              </button>
            )}
            <div className="mt-4">
              <input
                type="text"
                placeholder="Введите комментарий..."
                value={newCommentContents[post.id] || ''}
                onChange={(e) =>
                  setNewCommentContents((prev) => ({
                    ...prev,
                    [post.id]: e.target.value,
                  }))
                }
                className="rounded border p-2"
              />
              <button
                onClick={() => handleCommentSubmit(post.id)}
                className="ml-2 rounded bg-blue-500 p-2 text-white"
              >
                Отправить комментарий
              </button>
            </div>
            <br />
          </div>
        ))}
      </div>
    </>
  );
};

export default HomePage;
