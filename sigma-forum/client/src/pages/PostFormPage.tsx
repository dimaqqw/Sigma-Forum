import { FC, useEffect, useState } from 'react';
import Header from '../components/Header';
import { instance } from '../api/axios.api'; // Import Axios instance with base URL configured
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

interface Topic {
  id: string;
  title: string;
}

const PostFormPage: FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [topics, setTopics] = useState<Topic[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await instance.get('https://localhost:3000/api/topic');
        setTopics(response.data);
      } catch (error) {
        console.error('Error fetching topics:', error);
        toast.error('An error occurred while fetching topics.');
      }
    };

    fetchTopics();
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !selectedTopic) {
      toast.error('Please fill in all fields.');
      return;
    }

    try {
      const response = await instance.post('https://localhost:3000/api/post', {
        title,
        content,
        topic: selectedTopic,
      });

      if (response.status === 201) {
        toast.success('Post created successfully!');
        navigate('/');
      } else {
        toast.error('Failed to create post.');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('An error occurred while creating the post.');
    }
  };

  return (
    <>
      <Header onSearch={() => {}} isDisplay={false} />

      <div className="container m-auto mt-4 flex justify-center">
        <form
          className="w-full max-w-lg rounded-lg bg-zinc-600 p-8 shadow-md"
          onSubmit={handleFormSubmit}
        >
          <div className="mb-4 text-center text-xl font-bold">
            Create a New Post
          </div>
          <div className="mb-4">
            <label htmlFor="title" className="mb-2 block font-bold text-white">
              Title
            </label>
            <input
              type="text"
              className="input w-full rounded-md border-gray-300"
              id="title"
              placeholder="Culture"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="content"
              className="mb-2 block font-bold text-white"
            >
              Content
            </label>
            <textarea
              className="input w-full rounded-md border-gray-300"
              id="content"
              placeholder="I love culture, who too?"
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="topic" className="mb-2 block font-bold text-white">
              Topic
            </label>
            <select
              className="input w-full rounded-md border-gray-300"
              id="topic"
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
            >
              <option className="bg-black/80" value="">
                Select a topic
              </option>
              {topics.map((topic) => (
                <option
                  className=" bg-black/80"
                  key={topic.id}
                  value={topic.id}
                >
                  {topic.title}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="w-full rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          >
            Create Post
          </button>
        </form>
      </div>
    </>
  );
};

export default PostFormPage;
