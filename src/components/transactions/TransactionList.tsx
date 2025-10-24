import React, { useState } from "react";
import TransactionItem from "./TransactionItem";
import { Transaction, TransactionType } from "../../types";

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onEdit?: (transaction: Transaction) => void;
}

type FilterType = "all" | TransactionType;
type SortOption =
  | "date-desc"
  | "date-asc"
  | "amount-desc"
  | "amount-asc"
  | "category";

const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onDelete,
  onEdit,
}) => {
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [sortBy, setSortBy] = useState<SortOption>("date-desc");

  const filteredTransactions = transactions.filter((transaction) => {
    if (filterType === "all") return true;
    return transaction.type === filterType;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    switch (sortBy) {
      case "date-desc":
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case "date-asc":
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case "amount-desc":
        return b.amount - a.amount;
      case "amount-asc":
        return a.amount - b.amount;
      case "category":
        return a.category.localeCompare(b.category);
      default:
        return 0;
    }
  });

  if (transactions.length === 0) {
    return (
      <div className="transaction-list empty">
        <div className="empty-state">
          <span className="empty-icon">📊</span>
          <h3>No transactions yet</h3>
          <p>Start by adding your first income or expense transaction above.</p>
        </div>
      </div>
    );
  }

  if (sortedTransactions.length === 0) {
    return (
      <div className="transaction-list">
        <div className="list-controls">
          <FilterControls
            filterType={filterType}
            setFilterType={setFilterType}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        </div>

        <div className="empty-state">
          <span className="empty-icon">🔍</span>
          <h3>No matching transactions</h3>
          <p>Try adjusting your filters to see more results.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="transaction-list">
      <div className="list-controls">
        <FilterControls
          filterType={filterType}
          setFilterType={setFilterType}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        <div className="filter-stats">
          Showing {sortedTransactions.length} of {transactions.length}{" "}
          transactions
          {filterType !== "all" && (
            <span className="active-filter">({filterType} only)</span>
          )}
        </div>
      </div>

      <div className="transactions">
        {sortedTransactions.map((transaction) => (
          <TransactionItem
            key={transaction.id}
            transaction={transaction}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </div>
    </div>
  );
};

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

export default TransactionList;
