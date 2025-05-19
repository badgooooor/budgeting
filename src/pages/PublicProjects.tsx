import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import PageContainer from '@/components/layout/PageContainer';
import ProjectsTable from '@/components/projects/ProjectsTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatNumber, formatCurrency } from '@/lib/utils';

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
  coordinates: { lat: number; lng: number } | null;
}

interface BudgetData {
  budget_data: {
    id: string;
    name: string;
    budget: number;
    decrease: number;
    increase: number;
    disbursed: number;
    remaining: number;
    coordinates: { lat: number; lng: number } | null;
  }[];
  metadata: {
    date: string;
    total_projects: number;
  };
}

const Projects = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/20250519-eplan.json');
        const data: BudgetData = await response.json();
        
        // แปลงข้อมูลให้ตรงกับ interface Project
        const transformedProjects = data.budget_data.map(item => ({
          id: item.id,
          name: item.name,
          category: 'โครงการสาธารณะ',
          budget: item.budget,
          spent: item.disbursed,
          location: '-',
          status: item.remaining === 0 ? 'completed' as const : 'in-progress' as const,
          hasLocation: false,
          disbursed: item.disbursed,
          remaining: item.remaining,
          increase: item.increase,
          decrease: item.decrease,
          committed: 0,
          coordinates: item.coordinates
        }));

        setProjects(transformedProjects);
        setDate(data.metadata.date);
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
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
        date={date}
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
