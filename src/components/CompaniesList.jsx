import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Search, Download, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react'

export default function CompaniesList({ companies, activities }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedCompany, setExpandedCompany] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  const filteredCompanies = useMemo(() => {
    return companies.filter(company =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [companies, searchTerm])

  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedCompanies = filteredCompanies.slice(startIndex, startIndex + itemsPerPage)

  const handleExportAll = () => {
    const csvContent = [
      ['Company Analysis - Climate Adaptation Avoided Loss'],
      [''],
      ['Company', 'ISIN', 'Revenue ($M)', 'Total Avoided Loss ($M)', 'Avoided Loss %', 'Climate Activities'],
      ...companies.map(company => [
        company.name,
        company.isin || '',
        company.total_revenue_m.toFixed(2),
        company.total_avoided_loss_m.toFixed(2),
        company.avoided_loss_pct.toFixed(1) + '%',
        company.climate_activities || ''
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

  const toggleExpand = (companyName) => {
    setExpandedCompany(expandedCompany === companyName ? null : companyName)
  }

  const getActivityName = (activityName) => {
    return activityName || 'Unknown Activity'
  }

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
    setExpandedCompany(null) // Collapse expanded company when changing pages
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Company Analysis</CardTitle>
            <CardDescription>
              {companies.length.toLocaleString()} companies with exposure to climate adaptation activities
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
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {paginatedCompanies.map((company) => (
            <div key={company.name} className="border rounded-lg overflow-hidden">
              <div 
                className="p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => toggleExpand(company.name)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{company.name}</h3>
                    {company.isin && (
                      <p className="text-sm text-gray-500 mt-1">ISIN: {company.isin}</p>
                    )}
                    <div className="grid grid-cols-3 gap-4 mt-2 text-sm">
                      <div>
                        <span className="text-gray-600">Revenue:</span>
                        <span className="font-medium ml-2">${company.total_revenue_m.toLocaleString()}M</span>
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
                    {expandedCompany === company.name ? (
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>

              {expandedCompany === company.name && company.segments && company.segments.length > 0 && (
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
                        <TableHead className="text-right">Segment Avoided Loss</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {company.segments.map((segment, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">{segment.segment}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="text-xs">
                              {getActivityName(segment.activity)}
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
                          <TableCell className="text-right font-semibold text-blue-600">
                            ${segment.segment_avoided_loss_m.toLocaleString()}M
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

        {filteredCompanies.length > 0 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredCompanies.length)} of {filteredCompanies.length.toLocaleString()} companies
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  let pageNum
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (currentPage <= 3) {
                    pageNum = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = currentPage - 2 + i
                  }
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => goToPage(pageNum)}
                      className="w-10"
                    >
                      {pageNum}
                    </Button>
                  )
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

