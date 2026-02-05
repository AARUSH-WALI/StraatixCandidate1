import { motion } from 'framer-motion';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';

interface JobFiltersProps {
  // Job Type Filter
  selectedJobTypes: string[];
  onJobTypesChange: (types: string[]) => void;
  // Location Filter
  selectedLocations: string[];
  onLocationsChange: (locations: string[]) => void;
  // Job Function Filter
  selectedFunctions: string[];
  onFunctionsChange: (functions: string[]) => void;
  // Experience Filter
  experienceRange: number[];
  onExperienceChange: (range: number[]) => void;
  isExperienceFilterEnabled: boolean;
  onExperienceFilterToggle: (enabled: boolean) => void;
  // Available options (derived from data)
  availableLocations: string[];
  // Clear all
  onClearAll: () => void;
  hasActiveFilters: boolean;
}

const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];
const JOB_FUNCTIONS = ['Engineering', 'Product', 'Design', 'Marketing', 'Sales', 'Finance', 'Operations', 'HR', 'Consulting', 'General'];

export function JobFilters({
  selectedJobTypes,
  onJobTypesChange,
  selectedLocations,
  onLocationsChange,
  selectedFunctions,
  onFunctionsChange,
  experienceRange,
  onExperienceChange,
  isExperienceFilterEnabled,
  onExperienceFilterToggle,
  availableLocations,
  onClearAll,
  hasActiveFilters,
}: JobFiltersProps) {
  const toggleJobType = (type: string) => {
    if (selectedJobTypes.includes(type)) {
      onJobTypesChange(selectedJobTypes.filter((t) => t !== type));
    } else {
      onJobTypesChange([...selectedJobTypes, type]);
    }
  };

  const toggleLocation = (location: string) => {
    if (selectedLocations.includes(location)) {
      onLocationsChange(selectedLocations.filter((l) => l !== location));
    } else {
      onLocationsChange([...selectedLocations, location]);
    }
  };

  const toggleFunction = (func: string) => {
    if (selectedFunctions.includes(func)) {
      onFunctionsChange(selectedFunctions.filter((f) => f !== func));
    } else {
      onFunctionsChange([...selectedFunctions, func]);
    }
  };

  // Derive location categories from available locations
  const locationCategories = [...new Set(availableLocations.map((loc) => {
    if (loc.toLowerCase().includes('remote')) return 'Remote';
    if (loc.toLowerCase().includes('hybrid')) return 'Hybrid';
    return loc; // City name
  }))];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-card rounded-xl border border-border p-5 shadow-card"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-semibold text-foreground">Filters</h3>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3 mr-1" />
            Clear all
          </Button>
        )}
      </div>

      {/* Job Type Filter */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-foreground">Job Type</h4>
        <div className="space-y-2">
          {JOB_TYPES.map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={`type-${type}`}
                checked={selectedJobTypes.includes(type)}
                onCheckedChange={() => toggleJobType(type)}
              />
              <Label
                htmlFor={`type-${type}`}
                className="text-sm font-normal text-muted-foreground cursor-pointer"
              >
                {type}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator className="my-4" />

      {/* Location Filter */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-foreground">Location</h4>
        <div className="space-y-2">
          {locationCategories.map((location) => (
            <div key={location} className="flex items-center space-x-2">
              <Checkbox
                id={`loc-${location}`}
                checked={selectedLocations.includes(location)}
                onCheckedChange={() => toggleLocation(location)}
              />
              <Label
                htmlFor={`loc-${location}`}
                className="text-sm font-normal text-muted-foreground cursor-pointer"
              >
                {location}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator className="my-4" />

      {/* Experience Filter */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-foreground">Experience</h4>
          <Switch
            checked={isExperienceFilterEnabled}
            onCheckedChange={onExperienceFilterToggle}
          />
        </div>
        <div className={`space-y-4 transition-all duration-200 ${isExperienceFilterEnabled ? 'opacity-100 max-h-24 mt-4' : 'opacity-0 max-h-0 overflow-hidden'}`}>
          <Slider
            defaultValue={[0]}
            max={20}
            step={1}
            value={[experienceRange[0]]}
            onValueChange={(value) => onExperienceChange([value[0], 20])}
            className="py-4"
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{experienceRange[0]} years</span>
            <span>20+ years</span>
          </div>
        </div>
      </div>

      <Separator className="my-4" />

      {/* Job Function Filter */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-foreground">Job Function</h4>
        <div className="space-y-2">
          {JOB_FUNCTIONS.map((func) => (
            <div key={func} className="flex items-center space-x-2">
              <Checkbox
                id={`func-${func}`}
                checked={selectedFunctions.includes(func)}
                onCheckedChange={() => toggleFunction(func)}
              />
              <Label
                htmlFor={`func-${func}`}
                className="text-sm font-normal text-muted-foreground cursor-pointer"
              >
                {func}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
