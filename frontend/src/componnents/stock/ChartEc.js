import React, { Component } from "react";
import CanvasJSReact from "../../assets/canvasjs.stock.react";
import {api} from '../api'
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSStockChart = CanvasJSReact.CanvasJSStockChart;

class ChartEc extends Component {
  constructor(props) {
    super(props);
    this.state = { dataPoints: [], isLoaded: false };
  }

  componentDidMount() {
    fetch(api+ "ecavg")
      .then((res) => res.json())
      .then((data) => {
        var dps = [];
        for (var i = 0; i < data.length; i++) {
          dps.push({
            x: new Date(data[i].date),
            y: Number(data[i].avg_ec),
          });
        }
        this.setState({
          isLoaded: true,
          dataPoints: dps,
        });
      });
  }

  render() {
    const options = {
      title: {
        text: "กราฟแสดงข้อมูล EC เฉลี่ย",
      },
      theme: "dark2",
      backgroundColor: "#222b45",
      subtitles: [
        {
          text: "EC sensor ( mS / cm )",
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
            title: "EC sensor ( mS / cm )",
            crosshair: {
              enabled: true,
              snapToDataPoint: true,
            },
          },
          toolTip: {
            shared: true,
          },
          data: [
            {
              // name: "Price (in USD)",
              // type: "splineArea",
              // color: "#3576a8",
              // yValueFormatString: "$#,###.##",
              // xValueFormatString: "MMM DD YYYY",
              type: "spline",
              name: "EC senser",
              
              // color: "rgb(212, 128, 88)",
              showInLegend: true,

              dataPoints: this.state.dataPoints,
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

export default ChartEc;
