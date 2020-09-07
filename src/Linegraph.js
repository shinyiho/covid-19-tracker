import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import numeral from "numeral";
const collectChartData = (data, casesType = "cases") => {
  let lastDayCases;
  let chartData = [];
  for (let date in data.cases) {
    if (lastDayCases) {
      let newDatapoint = {
        x: date,
        y: data[casesType][date] - lastDayCases,
      };
      chartData.push(newDatapoint);
    }
    lastDayCases = data[casesType][date];
  }
  return chartData;
};

const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          format: "MM/DD/YY",
          // tootipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          callback: function (value, index, values) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
};
const Linegraph = ({ casesType, className }) => {
  const [data, setdata] = useState({});

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=30")
      .then((response) => response.json())
      .then((data) => setdata(collectChartData(data, casesType)));
  }, [casesType]);
  return (
    <div className={className}>
      {data?.length > 0 && (
        <Line
          options={options}
          data={{
            datasets: [
              {
                backgroundColor: "rgba(204,15,42,0.5)",
                borderColor: "#CC1034",
                data: data,
              },
            ],
          }}
        />
      )}
    </div>
  );
};

export default Linegraph;
