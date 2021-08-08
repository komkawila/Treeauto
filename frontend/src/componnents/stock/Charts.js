import React, { Component } from "react";
import CanvasJSReact from "../../assets/canvasjs.stock.react";
import {api} from '../api'
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSStockChart = CanvasJSReact.CanvasJSStockChart;

class Charts extends Component {
  constructor(props) {
    super(props);
    this.state = { dataPoints: [], isLoaded: false };
  }

  componentDidMount() {
    fetch(api+ "sensor")
      .then((res) => res.json())
      .then((data) => {
        var dps = [];
        var dpx = [];
        for (var i = 0; i < data.length; i++) {
          dps.push({
            x: new Date(data[i].log_times),
            y: Number(data[i].log_temp),
          });
          dpx.push({
            x: new Date(data[i].log_times),
            y: Number(data[i].log_light),
          });
        }
        this.setState({
          isLoaded: true,
          dataPoints: dps,
          dataPointx: dpx,
        });
      });
  }

  render() {
    const options = {
      title: {
        text: "กราฟแสดงข้อมูล sensor แสง และ อุณหภูมิ",
      },
      theme: "dark2",
      backgroundColor: "#222b45",
      subtitles: [
        {
          text: "__",
        },
      ],
      charts: [
        {
          axisX: {
            crosshair: {
              enabled: true,
              snapToDataPoint: true,
              valueFormatString: "MMM DD YYYY",
            },
          },
          axisY: {
            title: "อุณหภูมิ (°C) / แสง (%)",
            prefix: "",
            crosshair: {
              enabled: true,
              snapToDataPoint: true,
              valueFormatString: "#,###.##",
            },
          },
          toolTip: {
            shared: true,
          },
          data: [
            {
              type: "spline",
              name: "อุณหภูมิ",
              showInLegend: true,

              dataPoints: this.state.dataPoints,
            },
            {
              type: "spline",
              name: "แสง",
              showInLegend: true,
              dataPoints: this.state.dataPointx,
            },
          ],
        },
      ],
      navigator: {
        slider: {
          minimum: new Date("2017-05-01"),
          maximum: new Date("2018-05-01"),
        },
      },
    };
    const containerProps = {
      width: "100%",
      height: "450px",
      margin: "auto",
    };
    return (
      <div>
        <br/>
        <div>
          {
            // Reference: https://reactjs.org/docs/conditional-rendering.html#inline-if-with-logical--operator
            this.state.isLoaded && (
              <CanvasJSStockChart
                containerProps={containerProps}
                options={options}
                /* onRef = {ref => this.chart = ref} */
              />
            )
          }
        </div>
        <br/>
      </div>
    );
  }
}

export default Charts;
