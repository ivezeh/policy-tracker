import React from 'react';
import { Bar } from 'react-chartjs-2';

const ChartComponent = ({ data }) => {
    const chartData = {
        labels: ['Financial Impact', 'ESG Impact'],
        datasets: [
            {
                label: 'Impact Analysis',
                data: [data.financial_savings, data.esg_impact_value],
                backgroundColor: ['rgba(75,192,192,0.4)', 'rgba(255,99,132,0.4)'],
                borderColor: ['rgba(75,192,192,1)', 'rgba(255,99,132,1)'],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div>
            <Bar
                data={chartData}
                options={{
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Value ($)',
                            },
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Impact Category',
                            },
                        },
                    },
                }}
            />
        </div>
    );
};

export default ChartComponent;