import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';

export default function Home() {
    const [businessData, setBusinessData] = useState({
        industry: '',
        revenue: '',
        esg_goals: ''
    });
    const [policies, setPolicies] = useState([]);
    const [selectedPolicy, setSelectedPolicy] = useState('');
    const [recommendations, setRecommendations] = useState(null);

    useEffect(() => {
        // Fetch available tax policies from the backend when the component loads
        axios.get('http://localhost:5000/api/policies')
            .then(response => {
                setPolicies(response.data);
            })
            .catch(error => {
                console.error('Error fetching policies:', error);
            });
    }, []);

    const handleInputChange = (e) => {
        setBusinessData({
            ...businessData,
            [e.target.name]: e.target.value,
        });
    };

    const handlePolicyChange = (e) => {
        setSelectedPolicy(e.target.value);
    };

    // Define the handleSubmit function
    const handleSubmit = async () => {
        try {
            const recResponse = await axios.post('http://localhost:5000/api/recommendations', {
                ...businessData,
                selectedPolicy
            });
            setRecommendations(recResponse.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const chartData = recommendations ? {
        labels: ['Revenue Impact', 'ESG Impact', 'Overall Impact'],
        datasets: [
            {
                label: 'Impact Analysis',
                data: [
                    recommendations.revenueImpact ? parseFloat(recommendations.revenueImpact.replace(/[^0-9.-]+/g, "")) : 0,
                    recommendations.esgImpact ? parseFloat(recommendations.esgImpact.replace(/[^0-9.-]+/g, "")) : 0,
                    recommendations.overallImpact ? parseFloat(recommendations.overallImpact.replace(/[^0-9.-]+/g, "")) : 0
                ],
                backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)'],
                borderColor: ['rgba(75, 192, 192, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
                borderWidth: 1
            }
        ]
    } : null;

    return (
        <div className="container">
            <h1 className="title">Predictive Tax Policy Impact Simulator</h1>
            <div className="form-container">
                <select name="industry" value={businessData.industry} onChange={handleInputChange}>
                    <option value="">Select Industry</option>
                    <option value="Technology">Technology</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Finance">Finance</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Retail">Retail</option>
                    <option value="Energy">Energy</option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="Transportation">Transportation</option>
                </select>

                <input
                    type="number"
                    name="revenue"
                    placeholder="Annual Revenue"
                    value={businessData.revenue}
                    onChange={handleInputChange}
                />

                <select name="esg_goals" value={businessData.esg_goals} onChange={handleInputChange}>
                    <option value="">Select ESG Goal</option>
                    <option value="Reduce Carbon Emissions">Reduce Carbon Emissions</option>
                    <option value="Improve Energy Efficiency">Improve Energy Efficiency</option>
                    <option value="Promote Diversity and Inclusion">Promote Diversity and Inclusion</option>
                    <option value="Enhance Community Engagement">Enhance Community Engagement</option>
                    <option value="Increase Transparency">Increase Transparency</option>
                    <option value="Sustainable Sourcing">Sustainable Sourcing</option>
                </select>

                <select name="selectedPolicy" value={selectedPolicy} onChange={handlePolicyChange}>
                    <option value="">Select Tax Policy</option>
                    {policies.map(policy => (
                        <option key={policy.id} value={policy.id}>{policy.title}</option>
                    ))}
                </select>

                <button onClick={handleSubmit}>Simulate Impact</button>
            </div>

            {recommendations && (
                <div className="results-grid">
                    <div className="card">
                        <h2>Impact Analysis</h2>
                        {chartData && (
                            <div className="chart-container">
                                <Bar 
                                    data={chartData} 
                                    options={{
                                        scales: {
                                            y: {
                                                beginAtZero: true,
                                                title: {
                                                    display: true,
                                                    text: 'Impact Value ($)',
                                                    color: '#333'
                                                }
                                            },
                                            x: {
                                                title: {
                                                    display: true,
                                                    text: 'Impact Type',
                                                    color: '#333'
                                                }
                                            }
                                        }
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    <div className="card">
                        <h2>Predicted Revenue Impact</h2>
                        <p>{recommendations.revenueImpact || 'No data available'}</p>
                    </div>

                    <div className="card">
                        <h2>Predicted ESG Impact</h2>
                        <p>{recommendations.esgImpact || 'No data available'}</p>
                    </div>

                    <div className="card">
                        <h2>Overall Business Impact</h2>
                        <p>{recommendations.overallImpact || 'No data available'}</p>
                    </div>
                </div>
            )}
        </div>
    );
}