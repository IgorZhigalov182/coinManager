import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { getCountOperationByMounth } from '../../store/operations/operations.slice';
import { useSelector } from 'react-redux';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LineChart = ({ title }) => {
  const countOperationByMounth = useSelector(getCountOperationByMounth(title));

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
        text: 'Даты',
      },
    },
  };

  const labels = [
    'Январь',
    'Ферваль',
    'Март',
    'Апрель',
    'Maй',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
  ];

  const data = {
    labels,
    datasets: [
      {
        label: title,
        data: [...countOperationByMounth],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };
  return (
    <div style={{ width: '39rem', height: '20rem' }}>
      <Line options={options} data={data} />
    </div>
  );
};

export default LineChart;
