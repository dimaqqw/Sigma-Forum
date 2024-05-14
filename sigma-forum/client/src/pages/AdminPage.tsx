import { useEffect, useState } from 'react';
import Header from '../components/Header';
import { ITopic } from '../types/types';
import { instance } from '../api/axios.api';
import { toast } from 'react-toastify';

const AdminPage = () => {
  const [topics, setTopics] = useState<ITopic[]>([]);
  const [newTopic, setNewTopic] = useState('');

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      const response = await instance.get('https://localhost:3000/api/topic');
      setTopics(response.data);
    } catch (error) {
      console.error('Error fetching topics:', error);
    }
  };

  const handleAddTopic = async () => {
    try {
      const response = await instance.post('https://localhost:3000/api/topic', {
        title: newTopic,
      });
      setTopics([...topics, response.data]);

      if (response.status >= 200 && response.status < 300) {
        toast.success('You create topic: ' + newTopic);
      }
      setNewTopic('');
    } catch (error) {
      toast.error('Error adding topic');
      console.error('Error adding topic:', error);
    }
  };

  const handleDeleteTopic = async (id: number) => {
    try {
      const response = await instance.delete(
        `https://localhost:3000/api/topic/topic/${id}`,
      );
      setTopics(topics.filter((topic) => topic.id !== id));
      if (response.status >= 200 && response.status < 300) {
        toast.success('You delete topic with id: ' + id);
      }
    } catch (error) {
      toast.error('Error delete topic');
      console.error('Error deleting topic:', error);
    }
  };

  return (
    <>
      <Header onSearch={() => {}} isDisplay={false} />
      <div className="container m-auto mt-6 bg-zinc-600 p-4">
        <h1 className="text-xl">Topics</h1>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="New Topic"
            value={newTopic}
            onChange={(e) => setNewTopic(e.target.value)}
            className="input col-span-1 h-12 rounded border p-2"
          />
          <button
            onClick={handleAddTopic}
            className="col-span-1 h-12 rounded bg-blue-500 p-2 text-white"
          >
            Add
          </button>
        </div>
        <ul className="grid grid-cols-1 gap-4">
          {topics.map((topic) => (
            <li key={topic.id} className="flex items-center justify-between">
              <span className=" mr-2">{topic.title}</span>
              <button
                onClick={() => handleDeleteTopic(topic.id)}
                className="text-red-500"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default AdminPage;
