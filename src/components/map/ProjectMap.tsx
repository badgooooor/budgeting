import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSearchParams } from 'react-router-dom';
import { Skeleton } from "@/components/ui/skeleton";
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

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

interface ProjectMapProps {
  projects: Project[];
}

const ProjectMap = ({ projects }: ProjectMapProps) => {
  const [searchParams] = useSearchParams();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markers = useRef<maplibregl.Marker[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  console.log('ProjectMap component rendered');
  console.log('Projects:', projects);
  console.log('Map container:', mapContainer.current);

  // สร้าง map เมื่อ component mount แล้ว
  useLayoutEffect(() => {
    if (!mapContainer.current) {
      console.log('No map container found');
      return;
    }

    console.log('Initializing map with container:', mapContainer.current);

    try {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: {
          version: 8,
          sources: {
            'raster-tiles': {
              type: 'raster',
              tiles: [
                'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
              ],
              tileSize: 256,
              attribution: '© OpenStreetMap contributors'
            }
          },
          layers: [{
            id: 'simple-tiles',
            type: 'raster',
            source: 'raster-tiles',
            minzoom: 0,
            maxzoom: 22
          }]
        },
        center: [98.93273443954536, 18.09850631134027], // ลำพูน
        zoom: 8,
        attributionControl: false
      });

      // Wait for map to load
      map.current.on('load', () => {
        console.log('Map loaded successfully');
        setLoading(false);

        // Add navigation controls
        map.current?.addControl(new maplibregl.NavigationControl(), 'top-right');

        // Add attribution
        map.current?.addControl(new maplibregl.AttributionControl({
          compact: true
        }), 'bottom-right');

        // Add markers for each project
        projects.forEach(project => {
          const marker = new maplibregl.Marker({
            color: project.status === 'completed' ? '#4ade80' :
              project.status === 'in-progress' ? '#f59e0b' : '#94a3b8'
          })
            .setLngLat([project.coordinates.lng, project.coordinates.lat])
            .setPopup(
              new maplibregl.Popup({ offset: 25 })
                .setHTML(`
                  <div class="p-2">
                    <h3 class="font-medium">${project.name}</h3>
                    <p class="text-sm text-muted-foreground">${project.category}</p>
                    <div class="mt-2 space-y-1">
                      <div class="flex justify-between">
                        <span class="text-sm">งบประมาณ:</span>
                        <span class="font-medium">${formatCurrency(project.budget)}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-sm">สถานะ:</span>
                        <span class="font-medium">${getStatusText(project.status)}</span>
                      </div>
                    </div>
                  </div>
                `)
            )
            .addTo(map.current!);

          marker.getElement().addEventListener('click', () => {
            setSelectedProject(project);
          });

          markers.current.push(marker);
        });
      });

      // Handle map errors
      map.current.on('error', (e) => {
        console.error('Map error:', e);
        setLoading(false);
      });

    } catch (error) {
      console.error('Error initializing map:', error);
      setLoading(false);
    }

    // Cleanup
    return () => {
      console.log('Cleaning up map');
      markers.current.forEach(marker => marker.remove());
      if (map.current) {
        map.current.remove();
      }
    };
  }, [projects]);

  // Find the project from URL params if any
  useEffect(() => {
    const projectId = searchParams.get('project');
    if (projectId) {
      const project = projects.find(p => p.id === projectId);
      if (project) {
        setSelectedProject(project);
        if (map.current) {
          map.current.flyTo({
            center: [project.coordinates.lng, project.coordinates.lat],
            zoom: 14
          });
        }
      }
    }
  }, [projects, searchParams]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'แล้วเสร็จ';
      case 'in-progress': return 'กำลังดำเนินการ';
      case 'planned': return 'วางแผน';
      default: return status;
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3">
          <Card className="h-[500px]">
            <CardHeader className="p-4">
              <CardTitle className="text-lg">แผนที่แสดงตำแหน่งโครงการ</CardTitle>
              <CardDescription>
                คลิกที่จุดบนแผนที่เพื่อดูรายละเอียดโครงการ
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 h-[400px]">
              {/* {loading ? (
                <div className="h-full w-full flex items-center justify-center">
                  <div className="space-y-4">
                    <Skeleton className="h-8 w-32 mx-auto" />
                    <Skeleton className="h-32 w-32 rounded-full mx-auto" />
                    <Skeleton className="h-4 w-48 mx-auto" />
                  </div>
                </div>
              ) : ( */}
              <div className="h-full w-full relative" ref={mapContainer} />
              {/* )} */}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="h-[500px]">
            <CardHeader className="p-4">
              <CardTitle className="text-lg">ข้อมูลโครงการ</CardTitle>
              <CardDescription>
                {selectedProject ? 'รายละเอียดโครงการที่เลือก' : 'เลือกโครงการบนแผนที่'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedProject ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-lg">{selectedProject.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedProject.category}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">งบประมาณ:</span>
                      <span className="font-medium">{formatCurrency(selectedProject.budget)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">การใช้จ่าย:</span>
                      <span className="font-medium">{formatCurrency(selectedProject.spent)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">คงเหลือ:</span>
                      <span className="font-medium">{formatCurrency(selectedProject.budget - selectedProject.spent)}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium">สถานที่:</p>
                    <p className="text-sm">{selectedProject.location}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium">พิกัด:</p>
                    <p className="text-sm">
                      Lat: {selectedProject.coordinates.lat}, Lng: {selectedProject.coordinates.lng}
                      <br />
                      <span className="text-xs text-muted-foreground">พิกัดอาจคาดเคลื่อน</span>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-center p-4">
                  <p className="text-muted-foreground">
                    เลือกโครงการบนแผนที่เพื่อดูรายละเอียด
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProjectMap;
