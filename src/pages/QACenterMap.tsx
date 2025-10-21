// src/pages/QACenterMap.tsx
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Mail, Clock, Star, ExternalLink, Navigation as NavIcon, Filter, Search, CheckCircle2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const QACenterMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCenter, setSelectedCenter] = useState<number | null>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const markersRef = useRef<L.Marker[]>([]);
  const [isMapInteractive, setIsMapInteractive] = useState(false);

  // Enhanced QA Centers data
  const qaCenters = [
    {
      id: 1,
      name: "Karnataka Agricultural Testing Lab",
      location: "Bangalore, Karnataka",
      coordinates: [12.9716, 77.5946] as [number, number],
      phone: "+91-80-2678-9456",
      email: "contact@katl.org",
      hours: "9:00 AM - 5:00 PM",
      rating: 4.8,
      reviews: 124,
      specialties: ["Millet Testing", "Quality Certification", "Pesticide Analysis"],
      certification: "NABL Accredited",
      services: ["Pickup Available", "Express Testing", "Digital Reports"],
      distance: "2.5 km"
    },
    {
      id: 2,
      name: "Maharashtra Quality Control Center",
      location: "Pune, Maharashtra",
      coordinates: [18.5204, 73.8567] as [number, number],
      phone: "+91-20-2789-3451",
      email: "info@mqcc.co.in",
      hours: "8:30 AM - 6:00 PM",
      rating: 4.6,
      reviews: 89,
      specialties: ["Grain Quality", "Moisture Testing", "Full Analysis"],
      certification: "FSSAI Approved",
      services: ["On-site Testing", "Bulk Orders", "Export Certification"],
      distance: "5.2 km"
    },
    {
      id: 3,
      name: "Tamil Nadu Grain Testing Facility",
      location: "Chennai, Tamil Nadu",
      coordinates: [13.0827, 80.2707] as [number, number],
      phone: "+91-44-2678-1234",
      email: "support@tngtf.com",
      hours: "9:00 AM - 5:30 PM",
      rating: 4.9,
      reviews: 156,
      specialties: ["Organic Certification", "Export Quality", "Purity Tests"],
      certification: "NABL Accredited",
      services: ["Organic Testing", "International Standards", "Quick Results"],
      distance: "3.8 km"
    },
    {
      id: 4,
      name: "Rajasthan Millet Analysis Center",
      location: "Jaipur, Rajasthan",
      coordinates: [26.9124, 75.7873] as [number, number],
      phone: "+91-141-2789-4567",
      email: "lab@rmac.org",
      hours: "8:00 AM - 4:00 PM",
      rating: 4.4,
      reviews: 67,
      specialties: ["Millet Specific", "Traditional Varieties", "Quick Tests"],
      certification: "State Certified",
      services: ["Traditional Grains", "Local Varieties", "Fast Turnaround"],
      distance: "7.1 km"
    },
    {
      id: 5,
      name: "Andhra Pradesh Agricultural Lab",
      location: "Hyderabad, Andhra Pradesh",
      coordinates: [17.3850, 78.4867] as [number, number],
      phone: "+91-40-2678-7890",
      email: "testing@apal.gov.in",
      hours: "9:00 AM - 6:00 PM",
      rating: 4.7,
      reviews: 98,
      specialties: ["Comprehensive Analysis", "Digital Reports", "Fast Turnaround"],
      certification: "NABL Accredited",
      services: ["Digital Certificates", "Mobile App", "Real-time Tracking"],
      distance: "4.5 km"
    },
  ];

  const filters = [
    "NABL Accredited",
    "FSSAI Approved",
    "Pickup Available",
    "Express Testing",
    "Organic Certified"
  ];

  const filteredCenters = qaCenters.filter(center => {
    const matchesSearch = center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         center.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         center.specialties.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilters = activeFilters.length === 0 || 
                          activeFilters.some(filter => 
                            center.certification.includes(filter) || 
                            center.services.some(service => service.includes(filter))
                          );
    
    return matchesSearch && matchesFilters;
  });

  const initializeMap = () => {
    if (!mapContainer.current) return;

    try {
      // Initialize map
      map.current = L.map(mapContainer.current, {
        // Disable scroll wheel zoom by default
        scrollWheelZoom: false,
        // Add other options for better control
        dragging: true,
        tap: false
      } as any).setView([20.5937, 78.9629], 4);

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map.current);

      // Add markers for each QA center
      qaCenters.forEach((center) => {
        const customIcon = L.divIcon({
          html: `
            <div class="custom-marker ${selectedCenter === center.id ? 'selected' : ''}">
              <div class="marker-pin">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/>
                </svg>
              </div>
            </div>
          `,
          className: 'custom-div-icon',
          iconSize: [24, 24],
          iconAnchor: [12, 24],
        });

        const popupContent = `
          <div class="p-3 min-w-[250px]">
            <h3 class="font-bold text-lg mb-2">${center.name}</h3>
            <div class="space-y-2 text-sm">
              <div class="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#10b981">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/>
                </svg>
                <span>${center.location}</span>
              </div>
              <div class="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#10b981">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
                <span>${center.phone}</span>
              </div>
              <div class="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#10b981">
                  <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                </svg>
                <span>${center.hours}</span>
              </div>
              <div class="flex items-center gap-2 mt-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#fbbf24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
                <span class="font-medium">${center.rating} (${center.reviews} reviews)</span>
              </div>
            </div>
          </div>
        `;

        const marker = L.marker(center.coordinates, { icon: customIcon })
          .addTo(map.current!)
          .bindPopup(popupContent);

        marker.on('click', () => {
          setSelectedCenter(center.id);
        });

        markersRef.current.push(marker);
      });

      // Add control to toggle map interactivity
            const toggleControl: any = (L.control as any)({ position: 'topright' });
            toggleControl.onAdd = function() {
              const div = L.DomUtil.create('div', 'map-control');
              div.innerHTML = `
                <button class="bg-white px-3 py-2 rounded-lg shadow-md border border-gray-300 text-sm font-medium hover:bg-gray-50 transition-colors">
                  ${isMapInteractive ? '🔒 Lock Map' : '🔓 Unlock Map'}
                </button>
              `;
              
              div.addEventListener('click', (e) => {
                e.stopPropagation();
                setIsMapInteractive(!isMapInteractive);
                if (map.current) {
                  if (isMapInteractive) {
                    // Lock the map
                    map.current.scrollWheelZoom.disable();
                    map.current.dragging.disable();
                    (map.current as any).tap?.disable();
                  } else {
                    // Unlock the map
                    map.current.scrollWheelZoom.enable();
                    map.current.dragging.enable();
                    (map.current as any).tap?.enable();
                  }
                }
              });
              
              return div;
            };
            toggleControl.addTo(map.current);

    } catch (error) {
      console.error("Error initializing map:", error);
    }
  };

  const handleFilterToggle = (filter: string) => {
    setActiveFilters(prev =>
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const handleCenterSelect = (centerId: number) => {
    setSelectedCenter(centerId);
    const center = qaCenters.find(c => c.id === centerId);
    if (center && map.current) {
      map.current.setView(center.coordinates, 12);
      
      // Open popup for selected marker
      const marker = markersRef.current.find(m => {
        const latLng = m.getLatLng();
        return latLng.lat === center.coordinates[0] && latLng.lng === center.coordinates[1];
      });
      if (marker) {
        marker.openPopup();
      }
    }
  };

  const getDirections = (centerId: number) => {
    const center = qaCenters.find(c => c.id === centerId);
    if (center) {
      const [lat, lng] = center.coordinates;
      const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
      window.open(url, '_blank');
    }
  };

  useEffect(() => {
    initializeMap();

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  // Update markers when selection changes
  useEffect(() => {
    markersRef.current.forEach(marker => {
      const latLng = marker.getLatLng();
      const center = qaCenters.find(c => 
        c.coordinates[0] === latLng.lat && c.coordinates[1] === latLng.lng
      );
      
      if (center) {
        const isSelected = selectedCenter === center.id;
        const customIcon = L.divIcon({
          html: `
            <div class="custom-marker ${isSelected ? 'selected' : ''}">
              <div class="marker-pin">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/>
                </svg>
              </div>
            </div>
          `,
          className: 'custom-div-icon',
          iconSize: [24, 24],
          iconAnchor: [12, 24],
        });
        marker.setIcon(customIcon);
      }
    });
  }, [selectedCenter]);

  // Update map controls when interactivity changes
    useEffect(() => {
      if (map.current) {
        if (isMapInteractive) {
          map.current.scrollWheelZoom.enable();
          map.current.dragging.enable();
          (map.current as any).tap?.enable();
        } else {
          map.current.scrollWheelZoom.disable();
          map.current.dragging.disable();
          (map.current as any).tap?.disable();
        }
      }
    }, [isMapInteractive]);

  return (
    <div className="max-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-2">
        {/* Header */}
        <div className="text-center mb-3">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Quality Assurance Centers
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover certified testing laboratories near you for millet quality certification and analysis
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar - QA Centers List */}
          <div className="lg:col-span-1 space-y-4">
            {/* Search and Filters */}
            <Card className="p-4">
              <div className="space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search labs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Filters */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">Filters</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {filters.map((filter) => (
                      <Badge
                        key={filter}
                        variant={activeFilters.includes(filter) ? "default" : "outline"}
                        className="cursor-pointer transition-all"
                        onClick={() => handleFilterToggle(filter)}
                      >
                        {activeFilters.includes(filter) && <CheckCircle2 className="w-3 h-3 mr-1" />}
                        {filter}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Centers List */}
            <div className="space-y-3 max-h-[340px] overflow-y-auto">
              {filteredCenters.map((center) => (
                <Card 
                  key={center.id} 
                  className={`p-4 cursor-pointer transition-all border-2 hover:border-primary/50 ${
                    selectedCenter === center.id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border'
                  }`}
                  onClick={() => handleCenterSelect(center.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">{center.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <MapPin className="w-3 h-3" />
                        <span>{center.location}</span>
                        <span>•</span>
                        <span>{center.distance}</span>
                      </div>
                    </div>
                    {selectedCenter === center.id && (
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    )}
                  </div>

                  {/* Rating and Certification */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{center.rating}</span>
                      <span className="text-xs text-muted-foreground">({center.reviews})</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {center.certification}
                    </Badge>
                  </div>

                  {/* Specialties */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {center.specialties.slice(0, 2).map((specialty, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                    {center.specialties.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{center.specialties.length - 2} more
                      </Badge>
                    )}
                  </div>

                  {/* Contact Info */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {center.phone}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {center.hours}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Map Container */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden shadow-lg h-[400px] border-0 relative">
              <div 
                ref={mapContainer} 
                className="w-full h-full"
                style={{ cursor: isMapInteractive ? 'grab' : 'default' }}
              />
              
              {/* Map Instructions Overlay */}
              {!isMapInteractive && (
                <div className="absolute inset-0 bg-black/5 flex items-center justify-center pointer-events-none">
                  <div className="text-center p-6 bg-white/90 rounded-lg shadow-lg max-w-sm mx-4">
                    <MapPin className="w-8 h-8 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold text-foreground mb-2">Map Locked</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Click "Unlock Map" to enable zooming and panning
                    </p>
                    <div className="text-xs text-muted-foreground">
                      💡 This prevents the navigation from hiding when scrolling
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* Selected Center Details */}
            {selectedCenter && (
              <Card className="mt-4 p-4 bg-primary/5 border-primary/20">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-2">
                      {qaCenters.find(c => c.id === selectedCenter)?.name}
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-primary" />
                          <span>{qaCenters.find(c => c.id === selectedCenter)?.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-primary" />
                          <span>{qaCenters.find(c => c.id === selectedCenter)?.email}</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-primary" />
                          <span>{qaCenters.find(c => c.id === selectedCenter)?.hours}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <NavIcon className="w-4 h-4 text-primary" />
                          <span>{qaCenters.find(c => c.id === selectedCenter)?.distance}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    className="gap-2"
                    onClick={() => getDirections(selectedCenter)}
                  >
                    <ExternalLink className="w-4 h-4" />
                    Directions
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .custom-marker {
          background: #10b981;
          border: 3px solid white;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .custom-marker:hover {
          transform: scale(1.1);
          background: #059669;
        }
        
        .custom-marker.selected {
          background: #dc2626;
          transform: scale(1.2);
        }
        
        .marker-pin {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          color: white;
        }
        
        .leaflet-popup-content {
          margin: 8px;
        }
        
        .custom-div-icon {
          background: transparent !important;
          border: none !important;
        }
        
        .map-control {
          margin: 10px;
        }
        
        /* Prevent map from capturing scroll events when locked */
        .leaflet-container:not(.leaflet-interactive) {
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

export default QACenterMap;