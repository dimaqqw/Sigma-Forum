import { FC, useEffect, useState } from 'react';
import Header from '../components/Header';
import { IPost, ITopic, IComment, ReplyInfo } from '../types/types';
import HumanReadableDate from '../components/HumanReadableDate';
import { toast } from 'react-toastify';
import { instance } from '../api/axios.api';
import { AiOutlineDelete, AiOutlineEdit, AiOutlineSend } from 'react-icons/ai';
import { FaRegSave, FaReply } from 'react-icons/fa';
import io from 'socket.io-client';
// import socket from '../websocket/websocket';

const HomePage: FC = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [topics, setTopics] = useState<ITopic[]>([]);
  const [showAllComments, setShowAllComments] = useState<boolean>(false);
  const [newCommentContents, setNewCommentContents] = useState<{
    [postId: number]: string;
  }>({});
  const [editingComment, setEditingComment] = useState<{
    postId: number | null;
    commentId: number | null;
    content: string;
  }>({
    postId: null,
    commentId: null,
    content: '',
  });
  const [, setSearchQuery] = useState<string>('');
  const [searchResultMessage, setSearchResultMessage] = useState<string>('');
  const [editingPost, setEditingPost] = useState<{
    postId: number | null;
    title: string;
    content: string;
  }>({
    postId: null,
    title: '',
    content: '',
  });
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<ReplyInfo | null>(null);
  const [replyingToUser, setReplyingToUser] = useState<string | null>(null);
  const [selectedComment, setSelectedComment] = useState<{
    postId: number;
    parentId: number;
  } | null>(null);

  const handleReplyClick = (
    postId: number,
    parentId: number,
    username: string,
  ) => {
    setReplyingTo({ postId, parentId });
    setReplyingToUser(username ?? null);
    setSelectedComment({ postId, parentId });
  };

  const handleTopicSelect = async (topicTitle: string) => {
    // Если топик уже был выбран, сбрасываем его выбор и показываем все посты
    if (selectedTopic === topicTitle) {
      setSelectedTopic(null);
      setSearchQuery(''); // Сбрасываем также поиск
      try {
        const postsResponse = await instance.get(
          'https://localhost:3000/api/post',
        );
        setPosts(postsResponse.data);
      } catch (error) {
        console.log(error);
      }
    } else {
      // В противном случае фильтруем посты по выбранному топику
      setSelectedTopic(topicTitle);
      setSearchQuery('');
      try {
        let postsResponse;
        if (topicTitle) {
          postsResponse = await instance.get(
            `https://localhost:3000/api/post/topic/${encodeURIComponent(topicTitle)}`,
          );
        } else {
          postsResponse = await instance.get('https://localhost:3000/api/post');
        }

        setPosts(postsResponse.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleSearch = async (query: string) => {
    try {
      const response = await instance.get(
        `https://localhost:3000/api/post/${query}`,
      );

      if (response.data.length === 0) {
        setSearchResultMessage('No posts found.');
      } else {
        setSearchResultMessage('');
      }

      setPosts(response.data);
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while searching.');
    }
  };

  const handleEditPost = (postId: number, title: string, content: string) => {
    setEditingPost({ postId, title, content });
  };

  const toggleComments = () => {
    setShowAllComments(!showAllComments);
  };

  const handleCommentSubmit = async (
    postId: number,
    parentId = replyingTo?.parentId ?? null,
  ) => {
    const content = newCommentContents[postId];
    if (!content) {
      toast.info('Комментарий не может быть пустым');
      return;
    }

    try {
      const response = await instance.post(
        `https://localhost:3000/api/comment/`,
        {
          content: content,
          post: postId,
          parent: parentId,
        },
      );

      const data: IComment = response.data;
      console.log(data);

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
      if (response.status >= 200 && response.status < 300) {
        toast.success('Вы создали комментарий');
      }
    } catch (error) {
      console.log(error);
      toast.error('Вы неавторизованы');
    }
  };

  const handleDeleteComment = async (postId: number, commentId: number) => {
    try {
      const response = await instance.delete(
        `https://localhost:3000/api/comment/comment/${commentId}`,
      );

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: post.comments.filter(
                  (comment) => comment.comment_id !== commentId,
                ),
              }
            : post,
        ),
      );
      if (response.status >= 200 && response.status < 300) {
        toast.success('Вы удалили комментарий');
      }
    } catch (error) {
      toast.error('Вы неавторизованы или у вас недостаточно прав');
    }
  };

  const handleUpdateComment = async (
    postId: number,
    commentId: number,
    updatedContent: string,
  ) => {
    try {
      const response = await instance.patch(
        `https://localhost:3000/api/comment/comment/${commentId}`,
        {
          content: updatedContent,
        },
      );

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: post.comments.map((comment) =>
                  comment.comment_id === commentId
                    ? { ...comment, content: updatedContent }
                    : comment,
                ),
              }
            : post,
        ),
      );

      setEditingComment({ postId: null, commentId: null, content: '' });
      if (response.status >= 200 && response.status < 300) {
        toast.success('Вы обновили комментарий');
      }
    } catch (error) {
      console.log(error);
      toast.error('Вы неавторизованы или у вас недостаточно прав');
    }
  };

  const handleDeletePost = async (postId: number) => {
    try {
      const response = await instance.delete(
        `https://localhost:3000/api/post/post/${postId}`,
      );

      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));

      if (response.status >= 200 && response.status < 300) {
        toast.success('Вы удалили пост');
      }
    } catch (error) {
      console.error(error);
      toast.error('Ошибка при удалении поста');
    }
  };

  const handleUpdatePost = async () => {
    try {
      const response = await instance.patch(
        `https://localhost:3000/api/post/post/${editingPost.postId}`,
        {
          title: editingPost.title,
          content: editingPost.content,
        },
      );

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === editingPost.postId
            ? {
                ...post,
                title: editingPost.title,
                content: editingPost.content,
              }
            : post,
        ),
      );

      setEditingPost({ postId: null, title: '', content: '' });
      if (response.status >= 200 && response.status < 300) {
        toast.success('Пост успешно обновлен');
      }
    } catch (error) {
      console.error(error);
      toast.error('Ошибка при обновлении поста');
    }
  };

  useEffect(() => {
    const socket = io('wss://localhost:3000');
    socket.on('postUpdate', async () => {
      console.log('заебись');
      const postsResponse = await instance.get(
        'https://localhost:3000/api/post',
      );
      // Обновляем список постов при получении обновления
      setPosts(postsResponse.data);
    });

    socket.on('connect', () => {
      console.log('connected to ws');
    });

    const fetchData = async () => {
      try {
        const postsResponse = await instance.get(
          'https://localhost:3000/api/post',
        );
        const topicsResponse = await instance.get(
          'https://localhost:3000/api/topic',
        );

        setPosts(postsResponse.data);
        setTopics(topicsResponse.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();

    return () => {
      socket.disconnect(); // Отключаемся от сервера WebSocket при размонтировании компонента
    };
  }, []);

  return (
    <>
      <Header onSearch={handleSearch} isDisplay={true} />
      <div className="container mt-4">
        {/* TOPICS */}
        <div className="float-left mb-2 mr-4 mt-2 flex w-2/12 flex-col items-center rounded-md bg-zinc-600 pb-6 pt-6">
          {topics.map((topic) => (
            <div
              className={`mt-4 ${selectedTopic === topic.title ? 'font-bold' : ''}`}
              key={topic.id}
              onClick={() => handleTopicSelect(topic.title)}
            >
              {topic.title}
            </div>
          ))}
        </div>
        {/* POSTS */}
        {searchResultMessage ? (
          <div className="mb-2 mt-2 w-10/12 rounded-md bg-zinc-600 p-4">
            <div className="text-center">{searchResultMessage}</div>
          </div>
        ) : (
          <div className="posts w-10/12">
            {posts.map((post) => (
              <div
                className="mb-2 mt-2 rounded-md bg-zinc-600 p-4"
                key={post.id}
              >
                <div className="flex justify-between">
                  <div className="flex">
                    <div className="mr-2">{post.user.username}</div>
                    <div className="mr-2 text-sm">{post.topic.title}</div>
                    <HumanReadableDate dateString={post.createdAt} />
                  </div>
                  <div>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="ml-1 rounded text-lg text-red-400"
                    >
                      <AiOutlineDelete />
                    </button>
                    <button
                      onClick={() =>
                        handleEditPost(post.id, post.title, post.content)
                      }
                      className="ml-1 mr-4 rounded text-lg text-white"
                    >
                      <AiOutlineEdit />
                    </button>
                  </div>
                </div>
                {editingPost.postId === post.id && (
                  <div className="mt-4 flex ">
                    <input
                      type="text"
                      placeholder="Новый заголовок"
                      value={editingPost.title}
                      onChange={(e) =>
                        setEditingPost({
                          ...editingPost,
                          title: e.target.value,
                        })
                      }
                      className="input mr-2 rounded border p-2"
                    />
                    <textarea
                      placeholder="Новое содержание"
                      value={editingPost.content}
                      onChange={(e) =>
                        setEditingPost({
                          ...editingPost,
                          content: e.target.value,
                        })
                      }
                      className="input mr-2 rounded border p-2"
                    />
                    <button
                      onClick={handleUpdatePost}
                      disabled={!editingPost.title || !editingPost.content} // Отключаем кнопку сохранения, если поля не заполнены
                      className={`ml-2 flex items-center rounded p-2 text-white ${
                        editingPost.title && editingPost.content
                          ? 'bg-blue-500 hover:bg-blue-700'
                          : 'bg-gray-500'
                      }`}
                    >
                      Сохранить
                    </button>
                    <button
                      onClick={() => {
                        setEditingPost({
                          postId: null,
                          title: '',
                          content: '',
                        });
                      }}
                      className="ml-2 flex items-center rounded bg-gray-500 p-2 text-white hover:bg-gray-700"
                    >
                      Отмена
                    </button>
                  </div>
                )}
                <div className="text-xl">{post.title}</div>
                <div>{post.content}</div>
                {/* COMMENTS */}
                <div>
                  {post.comments
                    .slice(0, showAllComments ? post.comments.length : 2)
                    .map((comm: IComment) => (
                      <div
                        className="mt-2 bg-black/20 pb-2 pl-2 pt-2"
                        key={comm.comment_id}
                      >
                        {/* EDIT COMMENTS INPUT*/}
                        {editingComment.postId === post.id &&
                        editingComment.commentId === comm.comment_id ? (
                          <div className="flex">
                            <input
                              type="text"
                              value={editingComment.content}
                              className="input"
                              onChange={(e) =>
                                setEditingComment((prev) => ({
                                  ...prev,
                                  content: e.target.value,
                                }))
                              }
                            />
                            <div className="flex">
                              <button
                                className="ml-2 mr-2"
                                disabled={!editingComment.content} // Отключаем кнопку сохранения, если поля не заполнены
                                onClick={() =>
                                  handleUpdateComment(
                                    post.id,
                                    comm.comment_id,
                                    editingComment.content,
                                  )
                                }
                              >
                                <div className=" rounded-md bg-slate-400 hover:bg-green-600">
                                  <FaRegSave size={36} color="white" />
                                </div>
                              </button>
                              <button
                                onClick={() => {
                                  setEditingComment({
                                    postId: null,
                                    commentId: null,
                                    content: '',
                                  });
                                }}
                                className="ml-2 flex items-center rounded bg-gray-500 p-2 text-white hover:bg-gray-700"
                              >
                                Отмена
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center justify-between">
                              {' '}
                              <div className="flex">
                                <div className="mr-2">
                                  {comm.user?.username}
                                </div>
                                {comm.parent ? (
                                  <div className=" mr-2">
                                    replies to {comm.parent?.user?.username}
                                  </div>
                                ) : (
                                  ''
                                )}
                                <HumanReadableDate
                                  dateString={comm.createdAt}
                                />
                              </div>
                              <div className="flex">
                                {' '}
                                <button
                                  onClick={() =>
                                    handleReplyClick(
                                      post.id,
                                      comm.comment_id,
                                      comm.user?.username,
                                    )
                                  }
                                  className="ml-1 mr-1 rounded text-sm text-blue-500"
                                >
                                  <FaReply />
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteComment(
                                      post.id,
                                      comm.comment_id,
                                    )
                                  }
                                  className="ml-1 rounded text-lg text-red-400"
                                >
                                  <AiOutlineDelete />
                                </button>
                                <button
                                  onClick={() =>
                                    setEditingComment({
                                      postId: post.id,
                                      commentId: comm.comment_id,
                                      content: comm.content,
                                    })
                                  }
                                  className="ml-1 mr-4 rounded text-lg text-white"
                                >
                                  <AiOutlineEdit />
                                </button>
                              </div>
                            </div>

                            <div>{comm.content}</div>
                          </>
                        )}
                      </div>
                    ))}
                </div>
                {/* SEE MORE */}
                {post.comments.length > 2 && (
                  <button
                    onClick={toggleComments}
                    className="text-white/90 hover:text-white"
                  >
                    {showAllComments
                      ? 'Скрыть комментарии'
                      : 'Показать все комментарии'}
                  </button>
                )}
                {/* ADD COMMENT */}
                {/* <div className="mt-4 flex">
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
                    className="input mr-2 rounded border p-2"
                  />
                  <button
                    onClick={() => handleCommentSubmit(post.id)}
                    className="ml-2 flex items-center rounded bg-blue-500 p-2 text-white"
                  >
                    <AiOutlineSend className="mr-2" />
                  </button>
                </div> */}
                <div className="mt-4 flex">
                  {/* {replyingToUser && (
                    <span className="mr-2">Ответ для {replyingToUser}: </span>
                  )} */}
                  <input
                    type="text"
                    placeholder={`${
                      selectedComment && selectedComment.postId === post.id
                        ? `Reply to ${replyingToUser}: `
                        : 'Введите комментарий...'
                    }`}
                    value={newCommentContents[post.id] || ''}
                    onChange={(e) =>
                      setNewCommentContents((prev) => ({
                        ...prev,
                        [post.id]: e.target.value,
                      }))
                    }
                    className="input mr-2 rounded border p-2"
                  />
                  <button
                    onClick={() =>
                      handleCommentSubmit(post.id, replyingTo?.parentId)
                    }
                    className="ml-2 flex items-center rounded bg-blue-500 p-2 text-white"
                  >
                    <AiOutlineSend className="mr-2" />
                  </button>
                </div>
                <br />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default HomePage;
