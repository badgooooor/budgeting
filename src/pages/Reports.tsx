
import { useState } from 'react';
import Header from '@/components/layout/Header';
import PageContainer from '@/components/layout/PageContainer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, Printer } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';

const Reports = () => {
  const [activeTab, setActiveTab] = useState('budget');

  const budgetByQuarterData = [
    { name: 'Q1', planned: 25000000, actual: 22000000 },
    { name: 'Q2', planned: 30000000, actual: 27500000 },
    { name: 'Q3', planned: 35000000, actual: 22000000 },
    { name: 'Q4', planned: 30000000, actual: 0 },
  ];

  const budgetByCategoryData = [
    { name: 'โครงสร้างพื้นฐาน', value: 57500000, color: '#00acff' },
    { name: 'สาธารณูปโภค', value: 25000000, color: '#4ade80' },
    { name: 'การศึกษา', value: 18500000, color: '#f59e0b' },
    { name: 'สาธารณสุข', value: 12000000, color: '#8b5cf6' },
    { name: 'อื่นๆ', value: 7000000, color: '#94a3b8' },
  ];

  const projectStatusData = [
    { name: 'เสร็จสิ้น', value: 22, color: '#4ade80' },
    { name: 'กำลังดำเนินการ', value: 12, color: '#f59e0b' },
    { name: 'วางแผนแล้ว', value: 9, color: '#00acff' },
  ];

  const projectsByLocationData = [
    { name: 'อ.เมืองลำพูน', count: 15 },
    { name: 'อ.ลี้', count: 10 },
    { name: 'อ.ป่าซาง', count: 8 },
    { name: 'อ.บ้านโฮ่ง', count: 5 },
    { name: 'อ.บ้านธิ', count: 3 },
    { name: 'อ.เวียงหนองล่อง', count: 2 },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <>
      <Header />
      <PageContainer
        title="รายงาน"
        description="รายงานสรุปและการวิเคราะห์งบประมาณประจำปี 2568 (ข้อมูล Mockup อยู่)"
      >
        <div className="flex justify-end space-x-2 mb-4">
          <Button variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" />
            พิมพ์รายงาน
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            ดาวน์โหลด PDF
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="budget">รายงานงบประมาณ</TabsTrigger>
            <TabsTrigger value="projects">รายงานโครงการ</TabsTrigger>
            <TabsTrigger value="location">รายงานตามพื้นที่</TabsTrigger>
          </TabsList>
          
          <TabsContent value="budget" className="mt-0">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>งบประมาณตามไตรมาส</CardTitle>
                  <CardDescription>
                    เปรียบเทียบงบประมาณที่ตั้งไว้กับการเบิกจ่ายจริงในแต่ละไตรมาส
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={budgetByQuarterData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
                        <Tooltip 
                          formatter={(value: number) => formatCurrency(value)}
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Legend />
                        <Bar dataKey="planned" fill="#00acff" name="งบประมาณที่ตั้งไว้" />
                        <Bar dataKey="actual" fill="#4ade80" name="เบิกจ่ายแล้ว" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>งบประมาณตามหมวดหมู่</CardTitle>
                  <CardDescription>
                    การจัดสรรงบประมาณแยกตามประเภทของโครงการ
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={budgetByCategoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {budgetByCategoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: number) => formatCurrency(value)}
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="projects" className="mt-0">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>สถานะโครงการ</CardTitle>
                  <CardDescription>
                    จำนวนโครงการแยกตามสถานะการดำเนินงาน
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={projectStatusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="value"
                          nameKey="name"
                        >
                          {projectStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => `${value} โครงการ`}
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>ความคืบหน้าโครงการ</CardTitle>
                  <CardDescription>
                    สรุปความคืบหน้าของโครงการทั้งหมด
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">โครงการที่แล้วเสร็จ</span>
                        <span className="text-sm font-medium">51.16%</span>
                      </div>
                      <div className="w-full bg-secondary h-2.5 rounded-full">
                        <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '51.16%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">งบประมาณที่ใช้ไป</span>
                        <span className="text-sm font-medium">59.58%</span>
                      </div>
                      <div className="w-full bg-secondary h-2.5 rounded-full">
                        <div className="bg-primary h-2.5 rounded-full" style={{ width: '59.58%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">ระยะเวลาดำเนินการที่ผ่านไป</span>
                        <span className="text-sm font-medium">75.00%</span>
                      </div>
                      <div className="w-full bg-secondary h-2.5 rounded-full">
                        <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="location" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>โครงการตามพื้นที่</CardTitle>
                <CardDescription>
                  จำนวนโครงการแยกตามพื้นที่อำเภอ
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={projectsByLocationData}
                      layout="vertical"
                      margin={{
                        top: 20,
                        right: 30,
                        left: 80,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="name" />
                      <Tooltip
                        formatter={(value) => `${value} โครงการ`}
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0',
                          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Bar dataKey="count" fill="#00acff" name="จำนวนโครงการ" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </PageContainer>
    </>
  );
};

export default Reports;
