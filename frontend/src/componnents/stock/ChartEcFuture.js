import React, { Component } from "react";
import CanvasJSReact from "../../assets/canvasjs.stock.react";
import { api } from '../api'
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSStockChart = CanvasJSReact.CanvasJSStockChart;

class ChartEc extends Component {
    constructor(props) {
        super(props);
        this.state = { dataPoints: [], isLoaded: false };
    }

    componentDidMount() {
        fetch(api + "ecavgfuture")
            .then((res) => res.json())
            .then((data) => {
                var dps = [];
                for (var i = 0; i < data.length; i++) {
                    // Number(parseFloat(data[i].fomular.avg_ec) + (parseFloat(data[i].fomular) / 1000)),
                    // console.log(parseFloat(data[i].avg_ec) + (parseFloat(data[i].fomular) / 1000))
                var date = new Date(data[i].date);
                date.setDate(date.getDate() - 1);
                    dps.push({
                        x: date,
                        // y: Number(parseFloat(data[i].avg_ec) + (parseFloat(data[i].fomular) / 1000)),
                        y: Number(parseFloat(data[i].fomular)),
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
                text: "กราฟ EC ในอนาคต 1วัน",
            },
            theme: "dark2",
            backgroundColor: "#222b45",
            subtitles: [
                {
                    text: "EC ( mS / cm )",
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
                        title: "EC ( mS / cm )",
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
                            name: "EC",

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
                <br />
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
                <br />
            </div>
        );
    }
}

export default ChartEc;
