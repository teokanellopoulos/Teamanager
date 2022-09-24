import { useEffect, useState } from 'react';
import { Line } from "react-chartjs-2";
import axios from "axios";
import "../../css/admin/LineChart.css";
import { useSelector } from "react-redux";
import { CategoryScale, LinearScale, Chart as ChartJS, PointElement, LineElement, Title, Tooltip, Legend, LineController, Filler } from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    LineController,
    Title,
    Tooltip,
    Legend,
    Filler
)

export const LineChart = () => {
    const [data, setData] = useState([]);
    const [haveData, setHaveData] = useState(false);
    const token = useSelector(state => state.token);

    useEffect(() => {
        const getPaymentsByYear = async () => {
            try {
                const results = await axios.get("/payment/paymentsByYear", {
                    headers: { Authorization: token }
                });
                setData(results.data);
                setHaveData(true);
            } catch (error) {
                window.location.href = "/";
                setHaveData(false);
            }

        }
        getPaymentsByYear();
        // eslint-disable-next-line
    }, []);
    if (!haveData) {
        return (<div>Loading...</div>)
    } else {
        return (
            <div id="wrapper">
                <Line
                    data={{
                        labels: data.map(year => year._id),
                        datasets: [{
                            label: "Income by year",
                            data: data.map((year => year.total)),
                            fill: true,
                            backgroundColor: "#4D558ca5",
                            pointBorderColor: "#558ca5"
                        }]
                    }}
                    height={400}
                    width={600}
                    options={{
                        legend: {
                            color: "red"
                        },
                        maintainAspectRatio: false,
                            tension: 0.4,
                            scales: {
                                y: {
                                    title: {
                                        color: "#558ca5",
                                        display: true,
                                        text: 'Year total'
                                    },
                                    grid: {
                                        color: '#558ca5',
                                        borderColor: '#558ca5'
                                    },
                                    beginAtZero: true,
                                    ticks: { color: "#558ca5" }
                                },
                                x: {
                                    title: {
                                        color: "#558ca5",
                                        display: true,
                                        text: 'Year'
                                    },
                                    grid: {
                                        color: '#558ca5',
                                        borderColor: '#558ca5'
                                    },
                                    ticks: { color: "#558ca5" }
                                }
                            }
                        }
                    }
                        />
            </div>
        )
    }

}
