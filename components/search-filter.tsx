"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, X, Calendar, DollarSign, Tag } from "lucide-react"
import { useFinanceData } from "@/hooks/use-finance-data"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"

export function SearchFilter() {
  const { filters, setFilters, categories } = useFinanceData()
  const [isOpen, setIsOpen] = useState(false)
  const [tempFilters, setTempFilters] = useState(filters)

  const applyFilters = () => {
    setFilters(tempFilters)
    setIsOpen(false)
  }

  const clearFilters = () => {
    const emptyFilters = {
      searchTerm: "",
      categories: [],
      dateRange: { start: "", end: "" },
      amountRange: { min: 0, max: 0 },
      tags: [],
    }
    setTempFilters(emptyFilters)
    setFilters(emptyFilters)
    setIsOpen(false)
  }

  const hasActiveFilters =
    filters.searchTerm ||
    filters.categories.length > 0 ||
    filters.dateRange.start ||
    filters.dateRange.end ||
    filters.amountRange.min > 0 ||
    filters.amountRange.max > 0 ||
    filters.tags.length > 0

  return (
    <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Search & Filter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              placeholder="Search transactions..."
              value={filters.searchTerm}
              onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
              className="w-full"
            />
          </div>
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="relative">
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {hasActiveFilters && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                  >
                    !
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Advanced Filters</h4>
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Categories Filter */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Categories
                  </Label>
                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                    {categories.map((category) => (
                      <div key={category.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={category.id}
                          checked={tempFilters.categories.includes(category.name)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setTempFilters({
                                ...tempFilters,
                                categories: [...tempFilters.categories, category.name],
                              })
                            } else {
                              setTempFilters({
                                ...tempFilters,
                                categories: tempFilters.categories.filter((c) => c !== category.name),
                              })
                            }
                          }}
                        />
                        <Label htmlFor={category.id} className="text-sm">
                          {category.icon} {category.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Date Range Filter */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Date Range
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="start-date" className="text-xs">
                        From
                      </Label>
                      <Input
                        id="start-date"
                        type="date"
                        value={tempFilters.dateRange.start}
                        onChange={(e) =>
                          setTempFilters({
                            ...tempFilters,
                            dateRange: { ...tempFilters.dateRange, start: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="end-date" className="text-xs">
                        To
                      </Label>
                      <Input
                        id="end-date"
                        type="date"
                        value={tempFilters.dateRange.end}
                        onChange={(e) =>
                          setTempFilters({
                            ...tempFilters,
                            dateRange: { ...tempFilters.dateRange, end: e.target.value },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Amount Range Filter */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Amount Range
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="min-amount" className="text-xs">
                        Min
                      </Label>
                      <Input
                        id="min-amount"
                        type="number"
                        placeholder="0"
                        value={tempFilters.amountRange.min || ""}
                        onChange={(e) =>
                          setTempFilters({
                            ...tempFilters,
                            amountRange: { ...tempFilters.amountRange, min: Number(e.target.value) || 0 },
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="max-amount" className="text-xs">
                        Max
                      </Label>
                      <Input
                        id="max-amount"
                        type="number"
                        placeholder="∞"
                        value={tempFilters.amountRange.max || ""}
                        onChange={(e) =>
                          setTempFilters({
                            ...tempFilters,
                            amountRange: { ...tempFilters.amountRange, max: Number(e.target.value) || 0 },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={applyFilters} className="flex-1">
                    Apply Filters
                  </Button>
                  <Button variant="outline" onClick={clearFilters}>
                    Clear
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2">
            {filters.searchTerm && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Search: {filters.searchTerm}
                <X className="h-3 w-3 cursor-pointer" onClick={() => setFilters({ ...filters, searchTerm: "" })} />
              </Badge>
            )}
            {filters.categories.map((category) => (
              <Badge key={category} variant="secondary" className="flex items-center gap-1">
                {category}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() =>
                    setFilters({
                      ...filters,
                      categories: filters.categories.filter((c) => c !== category),
                    })
                  }
                />
              </Badge>
            ))}
            {filters.dateRange.start && (
              <Badge variant="secondary" className="flex items-center gap-1">
                From: {filters.dateRange.start}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() =>
                    setFilters({
                      ...filters,
                      dateRange: { ...filters.dateRange, start: "" },
                    })
                  }
                />
              </Badge>
            )}
            {filters.dateRange.end && (
              <Badge variant="secondary" className="flex items-center gap-1">
                To: {filters.dateRange.end}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() =>
                    setFilters({
                      ...filters,
                      dateRange: { ...filters.dateRange, end: "" },
                    })
                  }
                />
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
