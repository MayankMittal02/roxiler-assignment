import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Pie } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS } from "chart.js/auto"



const GetGraphs = () => {
  const [loadingBar, setLoadingBar] = useState(true)
  const [loadingPie, setLoadingPie] = useState(true)
  const [loadingStats, setLoadingStats] = useState(true)


  const [selectedChart, setSelectedChart] = useState("Statistics");
  const [selectedMonth, setSelectedMonth] = useState("March");
  const [chartData, setChartData] = useState({});
  const navigate = useNavigate();

  const charts = ["Statistics", "Bar Chart", "Pie Chart", "All above"];

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    const apiUrl = `http://localhost:5000/getgraphs/getbargraph?month=March`;

    const fetchAndDisplayChart = async () => {
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        setChartData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAndDisplayChart();
  }, []);

  const url = "http://localhost:5000/";
  const API = axios.create({ baseURL: url });
  const handleSearch = async () => {
    let API_URI = `/getgraphs`
    if (selectedChart === "Statistics") {
      API_URI = `getgraphs/getStatistics`
    }
    if (selectedChart === "Bar Chart") {
      API_URI = `getgraphs/getbargraph`
    }
    if (selectedChart === "Pie Chart") {
      API_URI = `getgraphs/getpiegraph`
    }
    if (selectedChart === "All above") {
      API_URI = `getgraphs/getallgraph`
    }


    const response = await API.get(
      `${API_URI}?month=${selectedMonth}`
    );

    // console.log(response.data)
    // const data = await response.json();

    setLoadingBar(true)
    setLoadingPie(true)
    setLoadingStats(true)

    setChartData(response.data);
    if (selectedChart === "Bar Chart") {
      setLoadingBar(false)
    }
    if (selectedChart === "Pie Chart") {
      setLoadingPie(false)

    }
    if (selectedChart === "Statistics") {
      setLoadingStats(false)
    }
    if (selectedChart === "All above") {
      setLoadingBar(false)
      setLoadingPie(false)
      setLoadingStats(false)
    }



    // navigate(`/getgraphs?month=${selectedMonth}&graph=${selectedChart}`);
  };
  const handleSelect = (e) => {

    setSelectedChart(e.target.value)
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <label
            htmlFor="monthSelect"
            className="block text-sm font-semibold p-2 mb-2"
          >
            Select Month:
          </label>
          <select
            id="monthSelect"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full p-2 border rounded"
          >
            {months.map((month, index) => (
              <option key={index} value={months[index]}>
                {month}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center">
          <label
            htmlFor="chartSelect"
            className="block text-sm font-semibold p-2 mb-2"
          >
            Charts:
          </label>
          <select
            id="chartSelect"
            value={selectedChart}
            onChange={handleSelect}
            className="w-full p-2 border rounded"
          >
            {charts?.map((chart, index) => (
              <option key={index} value={charts[index]}>
                {chart}
              </option>
            ))}
          </select>
        </div>
        <div>
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Search
          </button>
        </div>
      </div>
      {loadingStats == false ? <div>
        <div>
          {`Total Sale : ${chartData.stats.Total_sale}`}

        </div>
        <div>
          {`Total Sold Item : ${chartData.stats.Total_sold_item}`}

        </div>
        <div>
          {`Total Not Sold Item : ${chartData.stats.Total_not_sold_item}`}

        </div>


      </div> : null}
      {loadingBar == false ? <div>
        <Bar data={chartData.bar} />

      </div> : null}
      {loadingPie == false ? <div>
        <Pie data={chartData.pie} />

      </div> : null}

      




    </>
  );
};

export default GetGraphs;