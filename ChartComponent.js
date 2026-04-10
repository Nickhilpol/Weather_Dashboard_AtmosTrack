import React from "react"; 
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Brush,
  Legend
} from "recharts";

const ChartComponent = ({ data, title, type = "line" }) => {
  const Chart = type === "bar" ? BarChart : LineChart;

  const isMulti = data.length > 0 && data[0].pm10 !== undefined;

  return (
    <div
      style={{
        width: "100%",
        height: 420,
        marginBottom: "60px",
        padding: "10px",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
      }}
    >
      <h3 style={{ marginBottom: "15px" }}>{title}</h3>

      <div style={{ overflowX: "auto" }}>
        <div style={{ width: Math.max(data.length * 20, 500) }}>
          <ResponsiveContainer width="100%" height={260}>
            <Chart data={data}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="time" tick={{ fontSize: 10 }} />
              <YAxis />
              <Tooltip />
              <Legend />

              {/* ✅ ZOOM */}
              <Brush dataKey="time" height={30} />

              {/* ✅ DYNAMIC GRAPH */}
              {isMulti ? (
                type === "bar" ? (
                  <>
                    <Bar dataKey="pm10" name="PM10" />
                    <Bar dataKey="pm25" name="PM2.5" />
                  </>
                ) : (
                  <>
                    <Line dataKey="pm10" name="PM10" dot={false} />
                    <Line dataKey="pm25" name="PM2.5" dot={false} />
                  </>
                )
              ) : type === "bar" ? (
                <Bar dataKey="value" />
              ) : (
                <Line dataKey="value" dot={false} />
              )}
            </Chart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ChartComponent);
