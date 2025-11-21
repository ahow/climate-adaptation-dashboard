import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Search } from 'lucide-react'

export default function ActivitiesList({ activities, selectedActivity, onActivitySelect }) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredActivities = activities.filter(activity =>
    activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.sector.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Climate Adaptation Activities</CardTitle>
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search activities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-[600px] overflow-y-auto">
          {filteredActivities.map((activity) => (
            <div
              key={activity.id}
              onClick={() => onActivitySelect(activity)}
              className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                selectedActivity?.id === activity.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-sm">{activity.name}</h3>
              </div>
              <Badge variant="secondary" className="text-xs mb-2">
                {activity.sector}
              </Badge>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mt-2">
                <div>
                  <span className="font-medium">Market:</span> ${activity.market_size_bn}B
                </div>
                <div>
                  <span className="font-medium">Growth:</span> {activity.growth_cagr}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

