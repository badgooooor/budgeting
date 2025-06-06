import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import PageContainer from '@/components/layout/PageContainer';
import ProjectMap from '@/components/map/ProjectMap';
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';

interface BudgetDataItem {
  id: string;
  name: string;
  budget: number;
  decrease: number;
  increase: number;
  disbursed: number;
  remaining: number;
  coordinates: [number, number] | null;
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
        const response = await fetch('/20250519-eplan.json');
        const data = await response.json();
        
        // แปลงข้อมูลจาก JSON เป็นรูปแบบที่ต้องการ
        const mappedProjects = data.budget_data
          .filter((item: BudgetDataItem) => item.coordinates) // กรองเฉพาะที่มีพิกัด
          .map((item: BudgetDataItem) => ({
            id: item.id,
            name: item.name,
            category: 'โครงการสาธารณะ',
            budget: item.budget,
            spent: item.disbursed,
            location: 'ลำพูน',
            status: item.remaining === 0 ? 'completed' : 
                   item.disbursed > 0 ? 'in-progress' : 'planned',
            coordinates: {
              lng: item.coordinates![0],
              lat: item.coordinates![1]
            }
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
        description="แสดงตำแหน่งที่ตั้งโครงการสาธารณะบนแผนที่"
      >
        <div className="flex justify-end mb-4">
          <Button variant="outline" asChild>
            <Link to="/public-projects" className="flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              ดูโครงการสาธารณะ
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
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
