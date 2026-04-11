import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const ConferenceForm = ({ conferences, setConferences, editingConference, setEditingConference }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ title: '', description: '', host: '', date: '' });

  useEffect(() => {
    if (editingConference) {
      setFormData({
        title: editingConference.title,
        description: editingConference.description,
        host: editingConference.host,
        date: editingConference.date,
      });
    } else {
      setFormData({ title: '', description: '', host: '', date: '' });
    }
  }, [editingConference]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingConference) {
        const response = await axiosInstance.put(`/api/conferences/${editingConference._id}`, formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setConferences(conferences.map((conference) => (conference._id === response.data._id ? response.data : conference)));
      } else {
        const response = await axiosInstance.post('/api/conferences', formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setConferences([...conferences, response.data]);
      }
      setEditingConference(null);
      setFormData({ title: '', description: '', host: '', date: '' });
    } catch (error) {
      alert('Failed to save conference.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
      <h1 className="text-2xl font-bold mb-4">{editingConference ? 'Edit Existing Conference' : 'Register New Conference'}</h1>
      <input
        type="text"
        placeholder="Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="text"
        placeholder="host"
        value={formData.host}
        onChange={(e) => setFormData({ ...formData, host: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="date"
        value={formData.date}
        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
        {editingConference ? 'Update Button' : 'Create Button'}
      </button>
    </form>
  );
};

export default ConferenceForm;
