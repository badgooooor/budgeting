import { useMemo, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageContainer from '@/components/layout/PageContainer';
import Header from '@/components/layout/Header';
import StatCard from '@/components/dashboard/StatCard';
import BudgetAllocationChart from '@/components/dashboard/BudgetAllocationChart';
import BudgetProgressChart from '@/components/dashboard/BudgetProgressChart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ProjectsTable from '@/components/projects/ProjectsTable';
import { ArrowUpRight, ArrowDownRight, Layers, Building, Landmark, ArrowRight } from 'lucide-react';
import { formatNumber, formatCurrency, formatPercentage } from '@/lib/utils';

interface PublicDataSummary {
  total: {
    approved: number;
    disbursed: number;
    committed: number;
    remaining: number;
  };
  metadata: {
    total_projects: number;
  };
}
interface Project {
  id: string;
  name: string;
  category: string;
  budget: number;
  spent: number;
  location: string;
  status: 'completed' | 'in-progress';
  hasLocation: boolean;
  disbursed: number;
  remaining: number;
  increase: number;
  decrease: number;
  committed: number;
}

interface BudgetData {
  by_category_1: {
    [key: string]: {
      approved: number;
      increase: number;
      decrease: number;
      committed: number;
      disbursed: number;
      remaining: number;
      project_count: number;
    };
  };
  total: {
    disbursed: number;
    committed: number;
    remaining: number;
    approved: number;
  };
  metadata: {
    date: string;
  };
}

interface BudgetDataItem {
  category_1: string;
  project: string;
  approved: number;
  disbursed: number;
  remaining: number;
  increase: number;
  decrease: number;
  committed: number;
  coordinates: { lat: number; lng: number } | null;
}

const Index = () => {
  const [budgetData, setBudgetData] = useState<BudgetData | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [amountProject, setAmountProject] = useState<number>(0);
  const [completedProjectCount, setCompletedProjectCount] = useState<number>(0);
  const [topProjects, setTopProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // const [publicProjects, setPublicProjects] = useState<Project[]>([]);
  const [publicDataSummary, setPublicDataSummary] = useState<{
    total: {
      approved: number;
      disbursed: number;
      committed: number;
      remaining: number;
    };
  } | null>(null);
  const [publicProjectsLoading, setPublicProjectsLoading] = useState(true);
  const [publicProjectsDate, setPublicProjectsDate] = useState<string | null>(null);
  const [publicProjectsCount, setPublicProjectsCount] = useState<number>(0);

  const fetchPublicProjects = async () => {
    try {
      const response = await fetch('/20250519-eplan.json');
      const data = await response.json();
      // setPublicProjects(data.budget_data);
      setPublicProjectsDate(data.metadata.date);
      setPublicDataSummary(data.summary);
      setPublicProjectsCount(data.metadata.total_projects);
    } catch (error) {
      console.error('Error fetching public projects:', error);
    } finally {
      setPublicProjectsLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicProjects();
  }, []);

  useEffect(() => {
    const fetchBudgetData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/20250121-lpao-budgeting.json');
        const data = await response.json();
        setBudgetData(data.summary);
        setDate(data.metadata.date);
        setAmountProject(data.budget_data.length);

        // คำนวณจำนวนโครงการที่เบิกจ่ายครบ (remaining === 0)
        const completed = data.budget_data.filter(item => item.remaining === 0).length;
        setCompletedProjectCount(completed);

        // แปลงข้อมูลและเรียงลำดับตามงบประมาณสูงสุด
        const transformedProjects = data.budget_data
          .filter((item: BudgetDataItem) => item.category_1 === "ค่าที่ดินและสิ่งก่อสร้าง")
          .map((item: BudgetDataItem, index) => ({
            id: (index + 1).toString(),
            name: item.project,
            category: item.category_1,
            budget: item.approved,
            spent: item.disbursed,
            location: '-',
            status: item.remaining === 0 ? 'completed' as const : 'in-progress' as const,
            hasLocation: false,
            disbursed: item.disbursed,
            remaining: item.remaining,
            increase: item.increase,
            decrease: item.decrease,
            committed: item.committed,
            coordinates: item.coordinates || null,
          }))
          .sort((a, b) => b.budget - a.budget)
          .slice(0, 5);

        setTopProjects(transformedProjects);
      } catch (error) {
        console.error('Error fetching budget data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBudgetData();
  }, []);

  const budgetAllocationData = useMemo(() => {
    if (!budgetData?.by_category_1) return [];

    return Object.entries(budgetData.by_category_1)
      .map(([name, data]) => ({
        name,
        value: data.approved,
        color: '#00acff'
      }))
      .sort((a, b) => b.value - a.value);
  }, [budgetData]);

  const publicBudgetProgressData = useMemo(() => {
    if (!publicDataSummary) return [];

    return [
      { name: 'เบิกจ่าย', value: publicDataSummary?.total.disbursed, color: '#4ade80' },
      { name: 'งบประมาณคงเหลือ', value: publicDataSummary.total.remaining, color: '#94a3b8' },
    ];
  }, [publicDataSummary]);

  const completedProjects = useMemo(() => {
    return completedProjectCount;
  }, [completedProjectCount]);

  const inProgressProjects = useMemo(() => {
    return amountProject - completedProjectCount;
  }, [amountProject, completedProjectCount]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <PageContainer
        title="ภาพรวมงบประมาณ"
        description="แสดงข้อมูลงบประมาณประจำปี 2568 ขององค์การบริหารส่วนจังหวัดลำพูน"
        date={publicProjectsDate}
      >
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="งบประมาณทั้งหมด"
            value={formatCurrency(budgetData?.total.approved)}
            description="งบประมาณรายจ่ายประจำปี 2568"
            trend="up"
            trendValue="31% จากปีที่แล้ว (419M)"
            icon={<Layers />}
          />
          <StatCard
            title="โครงการสาธารณะ"
            value={formatCurrency(publicDataSummary?.total.approved)}
            description={`คิดเป็น ${formatPercentage(publicDataSummary?.total.approved, budgetData?.total.approved)} ของงบทั้งหมด`}
            trend="up"
            icon={<ArrowUpRight />}
          />
          <StatCard
            title="จำนวนรายการ"
            value={`${formatNumber(amountProject)} โครงการ`}
            description={`จำนวนโครงการทั้งหมดในข้อบัญญัติ`}
            icon={<Landmark />}
          />
          <StatCard
            title="จำนวนโครงการสาธารณะ"
            value={`${formatNumber(publicProjectsCount)} โครงการ`}
            description={`จำนวนโครงการสาธารณะในข้อบัญญัติ`}
            icon={<Building />}
            action={
              <Button variant="outline" asChild className="w-full mt-2">
                <Link to="/public-projects" className="flex items-center justify-center gap-2">
                  ดูโครงการสาธารณะ
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            }
          />
        </div>

        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">การจัดสรรงบประมาณตามหมวดหมู่</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                แสดงสัดส่วนงบประมาณแยกตามประเภทของโครงการ
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BudgetAllocationChart data={budgetAllocationData} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">ความคืบหน้าการเบิกจ่ายงบประมาณ</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                เปรียบเทียบเบิกจ่ายงบประมาณโครงการสาธารณะ
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BudgetProgressChart data={publicBudgetProgressData} />
            </CardContent>
          </Card>
        </div>

        {/* <Card className="mt-4">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
            <div className="space-y-1.5">
              <CardTitle className="text-lg sm:text-xl">โครงการก่อสร้างมูลค่าสูงสุด</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                แสดง 5 โครงการด้านที่ดินและสิ่งก่อสร้างที่มีงบประมาณสูงที่สุด
              </CardDescription>
            </div>
            <Button variant="outline" asChild className="w-full sm:w-auto">
              <Link to="/public-projects" className="flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                ดูโครงการสาธารณะ
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <ProjectsTable projects={topProjects} />
          </CardContent>
        </Card> */}
      </PageContainer>
    </>
  );
};

export default Index;
