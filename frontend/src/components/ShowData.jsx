import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"
import axios from 'axios';

function ShowData() {
  const [selectedMonth, setSelectedMonth] = useState('March');
  const [searchText, setSearchText] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPerPage, setPerPage] = useState(10);
  // const navigate = useNavigate();

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

  const perPages = [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10
  ];

  useEffect(() => {
    const apiUrl = `/getproducts?month=March`;

    const fetchAndDisplayTransactions = async () => {
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAndDisplayTransactions();
  }, []);


  const url = '';
  const API = axios.create({ baseURL: url });
  const handleSearch = async () => {
    setCurrentPage(1)
    const response = await API.get(`/getproducts?month=${selectedMonth}&search=${searchText}&limit=${selectedPerPage}`);
    setTransactions(response.data);
  };

// previous page button
  const handlePrevious = async () => {
    setCurrentPage(currentPage => {
      currentPage = Math.max(currentPage - 1, 1)
      API.get(`/getproducts?month=${selectedMonth}&search=${searchText}&page=${currentPage}&limit=${selectedPerPage}`).then(response => {
        setTransactions(response.data);
      })
      return currentPage;
    });
  };

// next page button
  const handleNext = async () => {
    setCurrentPage(currentPage => {
      currentPage = currentPage + 1;
      API.get(`/getproducts?month=${selectedMonth}&search=${searchText}&page=${currentPage}&limit=${selectedPerPage}`).then(response => {
        setTransactions(response.data);
      })
      return currentPage;
    });
  };

  const handlePerPage = async (value) => {
    setCurrentPage(1)
    setPerPage(selectedPerPage => {

      selectedPerPage = value;
      API.get(`/getproducts?month=${selectedMonth}&search=${searchText}&limit=${selectedPerPage}`).then(response => {
        setTransactions(response.data)
      })
      return selectedPerPage;

    });
  }



  return (
    <>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <div className="flex justify-between h-12 p-4 items-center mb-6">
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
          <div className="flex">
            {/* <label
              htmlFor="searchBox"
              className="block text-sm font-semibold mt-4 mb-2"
            >
              Search Transaction:
            </label> */}
            <input
              type="text"
              id="searchBox"
              placeholder="Search by title, description, or price"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full border rounded mr-2"
            />
            <button
              onClick={handleSearch}
              className="bg-blue-500 text-white p-2 rounded"
            >
              Search
            </button>
          </div>
        </div>
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                ID
              </th>
              <th scope="col" className="px-6 py-3">
                Title
              </th>
              <th scope="col" className="px-6 py-3">
                Description
              </th>
              <th scope="col" className="px-6 py-3">
                Price
              </th>
              <th scope="col" className="px-6 py-3">
                Category
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Image
              </th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((transaction) => (
              <tr
                key={transaction.id}
                className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {transaction.id}
                </th>
                <td className="px-6 py-4">{transaction.title}</td>
                <td className="px-6 py-4">{transaction.description}</td>
                <td className="px-6 py-4">{transaction.price}</td>
                <td className="px-6 py-4">{transaction.category}</td>
                <td className="px-6 py-4">
                  {transaction.sold == true && (
                    <div className="bg-green-500 py-0.5 px-3 text-white rounded">
                      Sold
                    </div>
                  )}
                  {transaction.sold == false && (
                    <div className="bg-red-500 py-0.5 px-3 text-white rounded">
                      Unsold
                    </div>
                  )}
                </td>
                <td className="p-2 bg-white dark:bg-white rounded-md">
                  <div className="p-2 bg-white dark:bg-white rounded-md">
                    <img
                      src={transaction.image}
                      alt={transaction.title}
                      className="w-14 h-14  object-contain "
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="w-full flex items-center justify-between p-2">
          <div>
            Page No: {currentPage}
          </div>
          <div className="mt-4 flex space-x-2">
            <button
              onClick={handlePrevious}
              className="bg-gray-300 text-gray-700 p-2 rounded"
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              className="bg-gray-300 text-gray-700 p-2 rounded"
            >
              Next
            </button>
          </div>
          <div className="flex items-center">
            <label
              htmlFor="perPage"
              className="block text-sm font-semibold p-2 mb-2"
            >
              Per Page:
            </label>
            <select
              id="perPageSelect"
              value={selectedPerPage}
              
              onChange={(e) => {
                handlePerPage(e.target.value)
              }}
              className="w-full p-2 border rounded"
            >
              {perPages.map((perPage, index) => (
                <option key={index} value={perPages[index]}>
                  {perPage}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div >
      <div>
        <Link to="/get-graphs">
          <button
            className="bg-blue-500 text-white mt-4 p-2 rounded"
          >
            Get Charts
          </button>
        </Link>
      </div>
    </>
  );
};

export default ShowData;
