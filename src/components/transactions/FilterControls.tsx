import React from 'react';
import { TransactionType } from '../../types';

type FilterType = "all" | TransactionType;
type SortOption =
  | "date-desc"
  | "date-asc"
  | "amount-desc"
  | "amount-asc"
  | "category";

interface FilterControlsProps {
  filterType: FilterType;
  setFilterType: (type: FilterType) => void;
  sortBy: SortOption;
  setSortBy: (option: SortOption) => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({
  filterType,
  setFilterType,
  sortBy,
  setSortBy,
}) => {
  return (
    <div className="filter-controls">
      <div className="filter-group">
        <label htmlFor="filter-type">Filter:</label>
        <select
          id="filter-type"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as FilterType)}
          className="filter-select"
        >
          <option value="all">All Transactions</option>
          <option value={TransactionType.INCOME}>Income Only</option>
          <option value={TransactionType.EXPENSE}>Expenses Only</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="sort-by">Sort by:</label>
        <select
          id="sort-by"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className="filter-select"
        >
          <option value="date-desc">Newest First</option>
          <option value="date-asc">Oldest First</option>
          <option value="amount-desc">Highest Amount</option>
          <option value="amount-asc">Lowest Amount</option>
          <option value="category">Category (A-Z)</option>
        </select>
      </div>
    </div>
  );
};

export default FilterControls;
export type { FilterType, SortOption };

