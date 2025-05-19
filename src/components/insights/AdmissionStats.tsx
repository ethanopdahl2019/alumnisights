
import React from "react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  Tooltip,
  Legend
} from "recharts";

export type AdmissionStatsType = {
  acceptanceRate?: number | null;
  averageSAT?: number | null;
  averageACT?: number | null;
};

interface AdmissionStatsProps {
  stats: AdmissionStatsType;
}

const AdmissionStats: React.FC<AdmissionStatsProps> = ({ stats }) => {
  const { acceptanceRate, averageSAT, averageACT } = stats;
  
  // Check if we have any stats to display
  const hasStats = acceptanceRate !== null || averageSAT !== null || averageACT !== null;
  
  if (!hasStats) {
    return (
      <div className="text-center py-4 text-gray-500 italic">
        No admissions statistics available for this university.
      </div>
    );
  }

  // Data for acceptance rate pie chart
  const acceptanceRateData = acceptanceRate !== null && acceptanceRate !== undefined ? [
    { name: "Accepted", value: acceptanceRate },
    { name: "Rejected", value: 100 - acceptanceRate },
  ] : [];

  // Colors for the pie chart
  const COLORS = ["#4f46e5", "#e5e7eb"];

  // Data for SAT and ACT bar charts
  const testScoreData = [
    {
      name: "Average Scores",
      SAT: averageSAT || 0,
      ACT: averageACT || 0,
    },
  ];

  // Max values for context in bar charts
  const maxSAT = 1600;
  const maxACT = 36;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
      {/* Acceptance Rate Pie Chart */}
      {acceptanceRate !== null && acceptanceRate !== undefined && (
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <h3 className="text-lg font-medium mb-2 text-center">Acceptance Rate</h3>
          <div className="h-[200px] flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={acceptanceRateData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {acceptanceRateData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="text-2xl font-bold text-center mt-2">
              {acceptanceRate}%
            </div>
          </div>
        </div>
      )}

      {/* SAT Score Bar Chart */}
      {averageSAT !== null && averageSAT !== undefined && (
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <h3 className="text-lg font-medium mb-2 text-center">Average SAT Score</h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={testScoreData}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, maxSAT]} />
                <YAxis dataKey="name" type="category" hide />
                <Tooltip formatter={(value) => value} />
                <Legend />
                <Bar dataKey="SAT" fill="#4f46e5" name="SAT Score" radius={[0, 4, 4, 0]}>
                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-white font-medium"
                  >
                    {averageSAT}
                  </text>
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="text-2xl font-bold text-center mt-2">
              {averageSAT} / {maxSAT}
            </div>
          </div>
        </div>
      )}

      {/* ACT Score Bar Chart */}
      {averageACT !== null && averageACT !== undefined && (
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <h3 className="text-lg font-medium mb-2 text-center">Average ACT Score</h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={testScoreData}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, maxACT]} />
                <YAxis dataKey="name" type="category" hide />
                <Tooltip formatter={(value) => value} />
                <Legend />
                <Bar dataKey="ACT" fill="#0ea5e9" name="ACT Score" radius={[0, 4, 4, 0]}>
                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-white font-medium"
                  >
                    {averageACT}
                  </text>
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="text-2xl font-bold text-center mt-2">
              {averageACT} / {maxACT}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdmissionStats;
