import React, { useEffect, useState } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

function Analysis() {
  const [activities, setActivities] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('https://jubilant-cod-vr7xq6rjq73p7qv-8000.app.github.dev/api/activities/').then(res => res.json()),
      fetch('https://jubilant-cod-vr7xq6rjq73p7qv-8000.app.github.dev/api/leaderboard/').then(res => res.json()),
    ])
      .then(([activitiesData, leaderboardData]) => {
        setActivities(activitiesData);
        setLeaderboard(leaderboardData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  const activityChartData = {
    labels: activities.map(activity => activity.activity_type),
    datasets: [
      {
        label: 'Activity Duration (hours)',
        data: activities.map(activity => {
          const [hours, minutes, seconds] = activity.duration.split(':').map(Number);
          return hours + minutes / 60 + seconds / 3600;
        }),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const leaderboardChartData = {
    labels: leaderboard.map(entry => entry.user.username),
    datasets: [
      {
        label: 'Scores',
        data: leaderboard.map(entry => entry.score),
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <h1 className="text-center">Analysis</h1>
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="d-flex flex-row justify-content-center align-items-center">
          <div className="me-4" style={{ width: '40%' }}>
            <h2 className="text-center">Activity Distribution</h2>
            <Pie data={activityChartData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
          </div>
          <div style={{ width: '40%' }}>
            <h2 className="text-center">Leaderboard Scores</h2>
            <Bar data={leaderboardChartData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Analysis;
