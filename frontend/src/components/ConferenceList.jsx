import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const ConferenceList = ({ conferences, setConferences, setEditingConference }) => {
  const { user } = useAuth();

  const handleDelete = async (conferenceId) => {
    try {
      await axiosInstance.delete(`/api/conferences/${conferenceId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setConferences(conferences.filter((conference) => conference._id !== conferenceId));
    } catch (error) {
      alert('Failed to delete conference.');
    }
  };

  return (
    <div>
      {conferences.map((conference) => (
        <div key={conference._id} className="bg-gray-100 p-4 mb-4 rounded shadow">
          <h2 className="font-bold">{conference.title}</h2>
          <p>{conference.description}</p>
          <p>Hosted by: {conference.host}</p>
          <p className="text-sm text-gray-500">Event date: {new Date(conference.date).toLocaleDateString()}</p>
          <div className="mt-2">
            <button
              onClick={() => setEditingConference(conference)}
              className="mr-2 bg-yellow-500 text-white px-4 py-2 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(conference._id)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ConferenceList;
