import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface BudgetAllocationProps {
  data: {
    name: string;
    value: number;
    color: string;
  }[];
}

const BudgetAllocationChart = ({ data }: BudgetAllocationProps) => {
  const formatTooltip = (value: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 16,
            left: 140,
            bottom: 5,
          }}
          layout="vertical"
          barSize={20}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis 
            type="number" 
            tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
            domain={[0, 'dataMax']}
          />
          <YAxis 
            type="category" 
            dataKey="name" 
            width={6}
            tick={{ 
              fontSize: 12,
              textAnchor: 'end',
              fill: '#666'
            }}
            tickLine={false}
          />
          <Tooltip 
            formatter={(value: number) => formatTooltip(value)}
            contentStyle={{ 
              backgroundColor: 'white', 
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Bar 
            dataKey="value"
            fill="#00acff"
            radius={[0, 4, 4, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BudgetAllocationChart;
