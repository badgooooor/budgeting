import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import PageContainer from '@/components/layout/PageContainer';
import ProjectMap from '@/components/map/ProjectMap';

interface BudgetDataItem {
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
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface Project {
  id: string;
  name: string;
  category: string;
  budget: number;
  spent: number;
  location: string;
  status: 'completed' | 'in-progress' | 'planned';
  coordinates: {
    lat: number;
    lng: number;
  };
}

const ProjectMapPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/20250121-lpao-budgeting.json');
        const data = await response.json();
        
        // แปลงข้อมูลจาก JSON เป็นรูปแบบที่ต้องการ
        const mappedProjects = data.budget_data
          .filter((item: BudgetDataItem) => item.coordinates) // กรองเฉพาะที่มีพิกัด
          .map((item: BudgetDataItem, index: number) => ({
            id: `project-${index}`,
            name: item.project,
            category: item.category_1,
            budget: item.approved,
            spent: item.disbursed,
            location: 'ลำพูน', // ตั้งค่าเริ่มต้น
            status: item.remaining === 0 ? 'completed' : 
                   item.disbursed > 0 ? 'in-progress' : 'planned',
            coordinates: item.coordinates!
          }));

        setProjects(mappedProjects);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Header />
      <PageContainer
        title="แผนที่โครงการ"
        description="แสดงตำแหน่งที่ตั้งโครงการบนแผนที่"
      >
        {loading ? (
          <div className="flex items-center justify-center h-[500px]">
            <div className="space-y-4">
              <div className="h-8 w-32 bg-muted animate-pulse rounded" />
              <div className="h-32 w-32 bg-muted animate-pulse rounded-full" />
              <div className="h-4 w-48 bg-muted animate-pulse rounded" />
            </div>
          </div>
        ) : (
          <ProjectMap projects={projects} />
        )}
      </PageContainer>
    </>
  );
};

export default ProjectMapPage;
