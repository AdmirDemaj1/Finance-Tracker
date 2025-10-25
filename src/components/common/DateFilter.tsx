import React, { useState } from 'react';
import { DateFilterPreset, DateRange, formatDateRange } from '../../utils/dateFilters';

interface DateFilterProps {
  preset: DateFilterPreset;
  customRange: DateRange | null;
  onPresetChange: (preset: DateFilterPreset) => void;
  onCustomRangeChange: (range: DateRange) => void;
  onReset?: () => void;
}

const DateFilter: React.FC<DateFilterProps> = ({
  preset,
  customRange,
  onPresetChange,
  onCustomRangeChange,
  onReset,
}) => {
  const [tempStartDate, setTempStartDate] = useState<string>(
    customRange?.startDate || new Date().toISOString().split('T')[0]
  );
  const [tempEndDate, setTempEndDate] = useState<string>(
    customRange?.endDate || new Date().toISOString().split('T')[0]
  );

  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPreset = e.target.value as DateFilterPreset;
    onPresetChange(newPreset);
  };

  const handleApplyCustomRange = () => {
    if (tempStartDate && tempEndDate) {
      const start = new Date(tempStartDate);
      const end = new Date(tempEndDate);
      
      if (start <= end) {
        onCustomRangeChange({ startDate: tempStartDate, endDate: tempEndDate });
      } else {
        alert('Start date must be before or equal to end date');
      }
    }
  };

  const isCustomRangeValid = tempStartDate && tempEndDate && 
    new Date(tempStartDate) <= new Date(tempEndDate);

  return (
    <div className="date-filter">
      <div className="date-filter-header">
        <h3 className="date-filter-title">📅 Date Filter</h3>
        {preset !== 'all' && onReset && (
          <button 
            onClick={onReset} 
            className="btn-reset-filter"
            title="Clear filter"
          >
            Clear
          </button>
        )}
      </div>

      <div className="date-filter-content">
        <div className="form-group">
          <label htmlFor="date-preset">Quick Select:</label>
          <select
            id="date-preset"
            value={preset}
            onChange={handlePresetChange}
            className="date-filter-select"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="thisWeek">This Week</option>
            <option value="lastWeek">Last Week</option>
            <option value="thisMonth">This Month</option>
            <option value="lastMonth">Last Month</option>
            <option value="thisYear">This Year</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>

        {preset === 'custom' && (
          <div className="custom-range-inputs">
            <div className="form-group">
              <label htmlFor="start-date">Start Date:</label>
              <input
                type="date"
                id="start-date"
                value={tempStartDate}
                onChange={(e) => setTempStartDate(e.target.value)}
                className="date-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="end-date">End Date:</label>
              <input
                type="date"
                id="end-date"
                value={tempEndDate}
                onChange={(e) => setTempEndDate(e.target.value)}
                min={tempStartDate}
                className="date-input"
              />
            </div>

            <button
              onClick={handleApplyCustomRange}
              disabled={!isCustomRangeValid}
              className="btn btn-primary btn-apply-range"
            >
              Apply Range
            </button>
          </div>
        )}

        {preset !== 'all' && (
          <div className="active-filter-display">
            <span className="filter-label">Active Filter:</span>
            <span className="filter-value">
              {formatDateRange(preset, customRange || undefined)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DateFilter;

