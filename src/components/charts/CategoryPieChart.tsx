import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface CategoryPieChartProps {
  data: Record<string, number>;
  title: string;
  type: 'income' | 'expense';
}

// Todo: Investigate if mui has chart component that is better than this.
const CategoryPieChart: React.FC<CategoryPieChartProps> = ({ data, title, type }) => {
  const categories = Object.keys(data);
  const values = Object.values(data);

  if (categories.length === 0) {
    return (
      <div className="chart-empty">
        <p>No {type} data to display</p>
      </div>
    );
  }


  const baseColors = type === 'income'
    ? [
        'rgba(16, 185, 129, 0.8)',   
        'rgba(5, 150, 105, 0.8)',
        'rgba(4, 120, 87, 0.8)',
        'rgba(6, 95, 70, 0.8)',
        'rgba(6, 78, 59, 0.8)',
      ]
    : [
        'rgba(239, 68, 68, 0.8)',    
        'rgba(220, 38, 38, 0.8)',
        'rgba(185, 28, 28, 0.8)',
        'rgba(153, 27, 27, 0.8)',
        'rgba(127, 29, 29, 0.8)',
      ];

  const borderColors = type === 'income'
    ? [
        'rgba(16, 185, 129, 1)',
        'rgba(5, 150, 105, 1)',
        'rgba(4, 120, 87, 1)',
        'rgba(6, 95, 70, 1)',
        'rgba(6, 78, 59, 1)',
      ]
    : [
        'rgba(239, 68, 68, 1)',
        'rgba(220, 38, 38, 1)',
        'rgba(185, 28, 28, 1)',
        'rgba(153, 27, 27, 1)',
        'rgba(127, 29, 29, 1)',
      ];

  const chartData = {
    labels: categories,
    datasets: [
      {
        label: title,
        data: values,
        backgroundColor: baseColors.slice(0, categories.length),
        borderColor: borderColors.slice(0, categories.length),
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value.toFixed(2)} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="chart-container">
      <h3 className="chart-title">{title}</h3>
      <div className="chart-wrapper">
        <Pie data={chartData} options={options} />
      </div>
    </div>
  );
};

export default CategoryPieChart;

