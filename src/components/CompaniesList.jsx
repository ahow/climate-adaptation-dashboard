import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Search, Download, ChevronDown, ChevronUp } from 'lucide-react'

export default function CompaniesList({ companies, activities }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedCompany, setExpandedCompany] = useState(null)

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleExportAll = () => {
    const csvContent = [
      ['Company Analysis - Climate Adaptation Avoided Loss'],
      [''],
      ['Company', 'Revenue ($M)', 'Total Avoided Loss ($M)', 'Avoided Loss %'],
      ...companies.map(company => [
        company.name,
        company.revenue_m,
        company.total_avoided_loss_m,
        company.avoided_loss_pct.toFixed(1) + '%'
      ])
    ].map(row => row.join(',')).join('\\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'companies_avoided_loss_analysis.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const toggleExpand = (companyId) => {
    setExpandedCompany(expandedCompany === companyId ? null : companyId)
  }

  const getActivityName = (activityId) => {
    const activity = activities.find(a => a.id === activityId)
    return activity ? activity.name : activityId
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Company Analysis</CardTitle>
            <CardDescription>
              Companies with exposure to climate adaptation activities
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleExportAll}>
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
        </div>
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredCompanies.map((company) => (
            <div key={company.id} className="border rounded-lg overflow-hidden">
              <div 
                className="p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => toggleExpand(company.id)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{company.name}</h3>
                    <div className="grid grid-cols-3 gap-4 mt-2 text-sm">
                      <div>
                        <span className="text-gray-600">Revenue:</span>
                        <span className="font-medium ml-2">${company.revenue_m.toLocaleString()}M</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Avoided Loss:</span>
                        <span className="font-medium ml-2 text-green-600">
                          ${company.total_avoided_loss_m.toLocaleString()}M
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Avoided Loss %:</span>
                        <span className="font-medium ml-2 text-blue-600">
                          {company.avoided_loss_pct.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    {expandedCompany === company.id ? (
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>

              {expandedCompany === company.id && (
                <div className="p-4 bg-white border-t">
                  <h4 className="font-semibold mb-3">Business Segments & Activities</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Segment</TableHead>
                        <TableHead>Activity</TableHead>
                        <TableHead className="text-right">Revenue ($M)</TableHead>
                        <TableHead className="text-right">Revenue %</TableHead>
                        <TableHead className="text-right">Avoided Loss/$1M</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {company.segments.map((segment, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">{segment.segment}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="text-xs">
                              {getActivityName(segment.activity_id)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            ${segment.revenue_m.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            {segment.revenue_pct.toFixed(1)}%
                          </TableCell>
                          <TableCell className="text-right font-semibold text-green-600">
                            ${segment.avoided_loss_per_1m.toFixed(2)}M
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredCompanies.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No companies found matching your search.
          </div>
        )}
      </CardContent>
    </Card>
  )
}

