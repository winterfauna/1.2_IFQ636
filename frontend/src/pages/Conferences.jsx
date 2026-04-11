import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import ConferenceForm from '../components/ConferenceForm';
import ConferenceList from '../components/ConferenceList';
import { useAuth } from '../context/AuthContext';

const Conferences = () => {
  const { user } = useAuth();
  const [conferences, setConferences] = useState([]);
  const [editingConference, setEditingConference] = useState(null);

  useEffect(() => {
    const fetchConferences = async () => {
      try {
        const response = await axiosInstance.get('/api/conferences', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setConferences(response.data);
      } catch (error) {
        alert('Failed to fetch Conferences.');
      }
    };

    fetchConferences();
  }, [user]);

  return (
    <div className="container mx-auto p-6">
      <ConferenceForm
        conferences={conferences}
        setConferences={setConferences}
        editingConference={editingConference}
        setEditingConference={setEditingConference}
      />
      <ConferenceList conferences={conferences} setConferences={setConferences} setEditingConference={setEditingConference} />
    </div>
  );
};

export default Conferences;
