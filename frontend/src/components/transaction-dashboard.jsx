import React, { useState, useEffect } from "react";

const App = () => {
  const [selectedMonth, setSelectedMonth] = useState(3);
  const [searchText, setSearchText] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  useEffect(() => {
    const apiUrl = "/getData";

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
  }, [selectedMonth, currentPage]);

  // Search functionality
  const handleSearch = () => {
    // Add logic to filter and display transactions based on search input
  };

  // Previous and Next buttons
  const handlePrevious = () => {
    // Add logic to load previous page data from API
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNext = () => {
    // Add logic to load next page data from API
    setCurrentPage((prevPage) => prevPage + 1);
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center min-w-screen bg-red-500">
        <div className="p-6">
          <table className="border-collapse border  w-9/12 border-yellow-300 bg-green-500">
            <thead className="bg-yellow-300 font-bold">
              {/* <tr> */}
              <th className="p-2">ID</th>
              <th className="p-2">Title</th>
              <th className="p-2">Description</th>
              <th className="p-2">Price</th>
              <th className="p-2">Category</th>
              <th className="p-2">Sold</th>
              <th className="p-2">Image</th>
              {/* </tr> */}
            </thead>
            {/* <div className="w-full mr-0 cursor-pointer p-2 flex justify-center items-center">
            <input
              type="button"
              className="cursor-pointer border-2 border-black p-2 rounded-md"
              value="Next Page"
            />
          </div> */}
            <div className="w-full flex bg-slate-700 items-center justify-between">
              <div>
                <div>
                  <label
                    htmlFor="monthSelect"
                    className="block text-sm font-semibold mb-2"
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
                      <option key={index} value={index + 1}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>
                <label
                  htmlFor="searchBox"
                  className="block text-sm font-semibold mt-4 mb-2"
                >
                  Search Transaction:
                </label>
                <div className="flex">
                  <input
                    type="text"
                    id="searchBox"
                    placeholder="Search by title, description, or price"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="w-full p-2 border rounded mr-2"
                  />
                  <button
                    onClick={handleSearch}
                    className="bg-blue-500 text-white p-2 rounded"
                  >
                    Search
                  </button>
                </div>
              </div>
              <div className="mt-4 flex space-x-2">
                <button
                  // onClick={handlePrevious}
                  className="bg-gray-300 text-gray-700 p-2 rounded"
                >
                  Previous
                </button>
                <button
                  // onClick={handleNext}
                  className="bg-gray-300 text-gray-700 p-2 rounded"
                >
                  Next
                </button>
              </div>
            </div>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="border-t border-yellow-300">
                  <td className="p-2 text-center">{transaction.id}</td>
                  <td className="p-2 font-bold">{transaction.title}</td>
                  <td className="p-2 text-justify">
                    {transaction.description}
                  </td>
                  <td className="p-2 items-center text-center">
                    {transaction.price}
                  </td>
                  <td className="p-2">{transaction.category}</td>
                  <td className="p-2">
                    {transaction.sold == true && (
                      <div className="bg-green-500 py-0.5 px-3 rounded">
                        True
                      </div>
                    )}
                    {transaction.sold == false && (
                      <div className="bg-red-500 py-0.5 px-3 text-white rounded">
                        False
                      </div>
                    )}
                  </td>
                  <td className="p-2">
                    <div className="p-2 bg-white rounded-md">
                      <img
                        src={transaction.image}
                        alt={transaction.title}
                        className="w-12 h-12 object-contain "
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      // <div className="font-bold">Hello</div>
    </>
  );
};

export default App;
