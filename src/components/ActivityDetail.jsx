import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx'
import { Download, RefreshCw, TrendingUp } from 'lucide-react'
import { calculateMetrics } from '../lib/calculations.js'

export default function ActivityDetail({ activity, onAssumptionChange }) {
  const [editedValues, setEditedValues] = useState({})
  const [calculatedMetrics, setCalculatedMetrics] = useState({})

  useEffect(() => {
    // Recalculate metrics when activity or edited values change
    const metrics = calculateMetrics(activity, editedValues)
    setCalculatedMetrics(metrics)
  }, [activity, editedValues])

  const handleValueChange = (key, value) => {
    const numValue = parseFloat(value)
    if (!isNaN(numValue)) {
      setEditedValues(prev => ({ ...prev, [key]: numValue }))
      onAssumptionChange(activity.id, key, numValue)
    }
  }

  const handleReset = () => {
    setEditedValues({})
    // Reset to original values
    Object.keys(activity.assumptions).forEach(key => {
      if (activity.assumptions[key].editable) {
        onAssumptionChange(activity.id, key, activity.assumptions[key].value)
      }
    })
  }

  const handleExport = () => {
    // Create CSV content
    const csvContent = [
      ['Climate Adaptation Activity Analysis'],
      ['Activity', activity.name],
      ['Sector', activity.sector],
      [''],
      ['ASSUMPTIONS'],
      ['Parameter', 'Value', 'Unit', 'Rationale', 'Source'],
      ...Object.entries(activity.assumptions).map(([key, assumption]) => [
        key,
        editedValues[key] || assumption.value,
        assumption.unit,
        assumption.rationale,
        assumption.source
      ]),
      [''],
      ['CALCULATED METRICS'],
      ['Metric', 'Value', 'Description'],
      ...Object.entries(calculatedMetrics).map(([key, metric]) => [
        key,
        typeof metric === 'number' ? metric.toFixed(2) : metric,
                      activity.calculated_metrics?.[key]?.description || ''
      ])
    ].map(row => row.join(',')).join('\\n')

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${activity.id}_analysis.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{activity.name}</CardTitle>
              <CardDescription className="mt-2">{activity.description}</CardDescription>
            </div>
            <Badge className="bg-green-600">{activity.sector}</Badge>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {activity.climate_risks.map((risk, idx) => (
              <Badge key={idx} variant="outline">{risk}</Badge>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-sm text-gray-600">Market Size</div>
              <div className="text-2xl font-bold text-blue-600">${activity.market_size_bn}B</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-sm text-gray-600">Growth (CAGR)</div>
              <div className="text-2xl font-bold text-green-600">{activity.growth_cagr}%</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-sm text-gray-600">BCR</div>
              <div className="text-2xl font-bold text-purple-600">
                {calculatedMetrics.bcr ? calculatedMetrics.bcr.toFixed(1) : '-'}:1
              </div>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="text-sm text-gray-600">Avoided Loss/$1M</div>
              <div className="text-2xl font-bold text-orange-600">
                ${calculatedMetrics.adjusted_avoided_loss_per_1m 
                  ? calculatedMetrics.adjusted_avoided_loss_per_1m.toFixed(2) 
                  : '-'}M
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assumptions Card */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Editable Assumptions</CardTitle>
              <CardDescription>
                Modify assumptions to see how they affect avoided loss calculations
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleReset}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Parameter</TableHead>
                  <TableHead className="w-[120px]">Value</TableHead>
                  <TableHead className="w-[80px]">Unit</TableHead>
                  <TableHead>Rationale & Source</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(activity.assumptions).map(([key, assumption]) => (
                  <TableRow key={key} className={assumption.editable ? 'bg-yellow-50' : ''}>
                    <TableCell className="font-medium">
                      {key.replace(/_/g, ' ').replace(/\\b\\w/g, l => l.toUpperCase())}
                    </TableCell>
                    <TableCell>
                      {assumption.editable ? (
                        <Input
                          type="number"
                          value={editedValues[key] !== undefined ? editedValues[key] : assumption.value}
                          onChange={(e) => handleValueChange(key, e.target.value)}
                          className="w-full"
                          step="any"
                        />
                      ) : (
                        <span className="text-gray-600">
                          {editedValues[key] !== undefined ? editedValues[key] : assumption.value}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">{assumption.unit}</TableCell>
                    <TableCell className="text-sm">
                      <div className="space-y-1">
                        <p className="text-gray-700">{assumption.rationale}</p>
                        <p className="text-gray-500 text-xs italic">{assumption.source}</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Calculated Metrics Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
            Calculated Metrics
          </CardTitle>
          <CardDescription>
            These values are automatically calculated based on your assumptions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Metric</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(calculatedMetrics).map(([key, value]) => (
                  <TableRow key={key} className="bg-green-50">
                    <TableCell className="font-medium">
                      {key.replace(/_/g, ' ').replace(/\\b\\w/g, l => l.toUpperCase())}
                    </TableCell>
                    <TableCell className="font-bold text-green-700">
                      {typeof value === 'number' ? value.toFixed(2) : value}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {activity.calculated_metrics?.[key]?.description || ''}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* FactSet Segments Card */}
      <Card>
        <CardHeader>
          <CardTitle>FactSet Business Segments</CardTitle>
          <CardDescription>
            Business segments that map to this activity (editable attribution)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activity.factset_segments && activity.factset_segments.length > 0 ? (
            <div className="space-y-3">
              {activity.factset_segments.map((segment, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-blue-900">
                      {typeof segment === 'string' ? segment : segment.segment_name}
                    </div>
                    {segment.full_path && (
                      <div className="text-xs text-blue-600 mt-1">
                        {segment.full_path}
                      </div>
                    )}
                  </div>
                  {segment.attribution_pct && (
                    <Badge variant="secondary" className="ml-3">
                      {segment.attribution_pct}%
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No segment mappings available</p>
          )}
        </CardContent>
      </Card>

      {/* Key Companies Card */}
      <Card>
        <CardHeader>
          <CardTitle>Key Companies</CardTitle>
          <CardDescription>
            Top companies by avoided loss exposure ($ millions)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activity.key_companies && activity.key_companies.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                    <TableHead className="text-right">Segment Revenue</TableHead>
                    <TableHead className="text-right">Avoided Loss</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activity.key_companies.slice(0, 10).map((company, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">
                        {typeof company === 'string' ? company : company.company_name}
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        {company.revenue_m ? `$${company.revenue_m.toLocaleString()}M` : '-'}
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        {company.segment_revenue_m ? (
                          <div>
                            <div>${company.segment_revenue_m.toLocaleString()}M</div>
                            {company.segment_revenue_pct && (
                              <div className="text-xs text-gray-500">
                                ({company.segment_revenue_pct}%)
                              </div>
                            )}
                          </div>
                        ) : '-'}
                      </TableCell>
                      <TableCell className="text-right font-bold text-green-700">
                        {company.avoided_loss_m ? `$${company.avoided_loss_m.toLocaleString()}M` : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No company data available</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

