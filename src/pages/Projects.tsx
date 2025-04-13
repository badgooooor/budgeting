import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import PageContainer from '@/components/layout/PageContainer';
import ProjectsTable from '@/components/projects/ProjectsTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatNumber } from '@/lib/utils';

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
  category_1: string;
  type: string;
  category_2: string;
  project: string;
  approved: number;
  increase: number;
  decrease: number;
  committed: number;
  disbursed: number;
  remaining: number;
}

const Projects = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/20250121-lpao-budgeting.json');
        const data = await response.json();
        
        // แปลงข้อมูลจาก budget_data เป็นรูปแบบที่ต้องการ
        const transformedProjects = data.budget_data.map((item: BudgetData, index: number) => ({
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
          committed: item.committed
        }));

        setProjects(transformedProjects);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const getFilteredProjects = () => {
    switch (activeTab) {
      case 'completed':
        return projects.filter(project => project.status === 'completed');
      case 'in-progress':
        return projects.filter(project => project.status === 'in-progress');
      default:
        return projects;
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <PageContainer
          title="โครงการทั้งหมด"
          description="รายการโครงการที่ได้รับการจัดสรรงบประมาณประจำปี 2568"
        >
          <div className="flex items-center justify-center min-h-[400px]">
            กำลังโหลดข้อมูล...
          </div>
        </PageContainer>
      </>
    );
  }

  return (
    <>
      <Header />
      <PageContainer
        title="โครงการทั้งหมด"
        description="รายการโครงการที่ได้รับการจัดสรรงบประมาณประจำปี 2568"
      >
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">
              ทั้งหมด ({formatNumber(projects.length)})
            </TabsTrigger>
            <TabsTrigger value="completed">
              เบิกจ่ายครบ ({formatNumber(projects.filter(p => p.status === 'completed').length)})
            </TabsTrigger>
            <TabsTrigger value="in-progress">
              รอเบิกจ่าย ({formatNumber(projects.filter(p => p.status === 'in-progress').length)})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            <ProjectsTable projects={getFilteredProjects()} />
          </TabsContent>
          <TabsContent value="completed" className="mt-0">
            <ProjectsTable projects={getFilteredProjects()} />
          </TabsContent>
          <TabsContent value="in-progress" className="mt-0">
            <ProjectsTable projects={getFilteredProjects()} />
          </TabsContent>
        </Tabs>
      </PageContainer>
    </>
  );
};

export default Projects;
