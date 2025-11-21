import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import ActivitiesList from './components/ActivitiesList.jsx'
import ActivityDetail from './components/ActivityDetail.jsx'
import CompaniesList from './components/CompaniesList.jsx'
import activitiesData from './data/activities.json'
import companiesData from './data/companies.json'
import './App.css'

function App() {
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [activities, setActivities] = useState(activitiesData)

  const handleActivitySelect = (activity) => {
    setSelectedActivity(activity)
  }

  const handleAssumptionChange = (activityId, assumptionKey, newValue) => {
    setActivities(prevActivities => 
      prevActivities.map(act => {
        if (act.id === activityId) {
          const updated = { ...act }
          updated.assumptions[assumptionKey].value = newValue
          return updated
        }
        return act
      })
    )
    
    // Update selected activity if it's the one being edited
    if (selectedActivity && selectedActivity.id === activityId) {
      const updatedActivity = activities.find(a => a.id === activityId)
      if (updatedActivity) {
        setSelectedActivity({...updatedActivity})
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Climate Adaptation Avoided Loss Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Analyze climate adaptation activities, company exposures, and avoided economic losses
          </p>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <Tabs defaultValue="activities" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3 mb-8">
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="companies">Companies</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>

          <TabsContent value="activities" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <ActivitiesList 
                  activities={activities}
                  selectedActivity={selectedActivity}
                  onActivitySelect={handleActivitySelect}
                />
              </div>
              <div className="lg:col-span-2">
                {selectedActivity ? (
                  <ActivityDetail 
                    activity={selectedActivity}
                    onAssumptionChange={handleAssumptionChange}
                  />
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>Select an Activity</CardTitle>
                      <CardDescription>
                        Choose an activity from the list to view details and edit assumptions
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">
                        Select an activity from the left panel to see its calculation model, 
                        assumptions, and avoided loss metrics. You can edit assumptions and 
                        see calculations update in real-time.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="companies">
            <CompaniesList companies={companiesData} activities={activities} />
          </TabsContent>

          <TabsContent value="about">
            <Card>
              <CardHeader>
                <CardTitle>About This Dashboard</CardTitle>
                <CardDescription>
                  Understanding the Climate Adaptation Avoided Loss Framework
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Purpose</h3>
                  <p className="text-gray-700">
                    This dashboard helps investors and analysts quantify the economic value created by 
                    climate adaptation activities. It maps companies to specific adaptation solutions 
                    and calculates the avoided economic losses attributable to their products and services.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-2">Key Features</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Browse 80+ climate adaptation activities across 13 sectors</li>
                    <li>Edit assumptions and see calculations update in real-time</li>
                    <li>View company-level avoided loss estimates</li>
                    <li>Understand value chain attribution</li>
                    <li>Export data to Excel for further analysis</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Methodology</h3>
                  <p className="text-gray-700">
                    The avoided loss calculations are based on benefit-cost analysis (BCA) methodology, 
                    incorporating empirical data from academic research, industry reports, and international 
                    organizations. Each activity includes detailed assumptions with sources, transparent 
                    calculation formulas, and value chain attribution to avoid double-counting.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Data Sources</h3>
                  <p className="text-gray-700">
                    The framework integrates data from 40+ authoritative sources including the World Bank, 
                    IPCC, WHO, FAO, industry associations, and leading research institutions. All assumptions 
                    are documented with rationales and citations.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="container mx-auto px-6 py-6 text-center text-gray-600">
          <p>Climate Adaptation Avoided Loss Dashboard © 2024</p>
          <p className="text-sm mt-2">
            Data updated: November 2024 | Framework version: 2.0
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App

