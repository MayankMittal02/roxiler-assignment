import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ShowData from "./components/ShowData";
import GetGraphs from "./components/GetGraphs"

const App = () => {
  return (
    <>
      <div>
        <Router>
          <Routes>
            <Route
              path="/get-graphs"
              element={
                <div className=" flex justify-center items-center">
                  <div className="w-2/5 p-4">
                    <GetGraphs />
                  </div>
                </div>
              }
            />
            <Route
              path="/"
              element={
                <div className=" flex justify-center items-center">
                  <div className="w-5/6 p-4">
                    <ShowData />
                  </div>
                </div>
              }
            />
            <Route
              path="/getproducts"
              element={
                <div className=" flex justify-center items-center">
                  <div className="w-5/6 p-4">
                    <ShowData />
                  </div>
                </div>
              }
            />
            <Route
              path="/getgraphs"
              element={
                <div className=" flex justify-center items-center">
                  <div className="w-5/6 p-4">
                    <GetGraphs />
                  </div>
                </div>
              }
            />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App