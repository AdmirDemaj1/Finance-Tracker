import React, { useState, useMemo } from "react";
import TransactionItem from "./TransactionItem";
import FilterControls, { FilterType, SortOption } from "./FilterControls";
import SearchBar from "../common/SearchBar";
import Pagination from "../common/Pagination";
import { Transaction } from "../../types";

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onEdit?: (transaction: Transaction) => void;
}

const ITEMS_PER_PAGE = 10;

const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onDelete,
  onEdit,
}) => {
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [sortBy, setSortBy] = useState<SortOption>("date-desc");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  
  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      
      const typeMatch = filterType === "all" || transaction.type === filterType;
      
      
      const searchMatch = searchQuery === "" || 
        transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.amount.toString().includes(searchQuery);
      
      return typeMatch && searchMatch;
    });
  }, [transactions, filterType, searchQuery]);

  const sortedTransactions = useMemo(() => {
    return [...filteredTransactions].sort((a, b) => {
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
  }, [filteredTransactions, sortBy]);

  
  const totalPages = Math.ceil(sortedTransactions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedTransactions = sortedTransactions.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const handleFilterChange = (newFilter: FilterType) => {
    setFilterType(newFilter);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort);
    setCurrentPage(1);
  };

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
        <SearchBar searchQuery={searchQuery} onSearchChange={handleSearchChange} />
        
        <div className="list-controls">
          <FilterControls
            filterType={filterType}
            setFilterType={handleFilterChange}
            sortBy={sortBy}
            setSortBy={handleSortChange}
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
      <SearchBar searchQuery={searchQuery} onSearchChange={handleSearchChange} />
      
      <div className="list-controls">
        <FilterControls
          filterType={filterType}
          setFilterType={handleFilterChange}
          sortBy={sortBy}
          setSortBy={handleSortChange}
        />

        <div className="filter-stats">
          Showing {startIndex + 1}-{Math.min(endIndex, sortedTransactions.length)} of{" "}
          {sortedTransactions.length} transactions
          {(filterType !== "all" || searchQuery) && (
            <span className="active-filter">
              {filterType !== "all" && `(${filterType} only)`}
              {searchQuery && ` (searching: "${searchQuery}")`}
            </span>
          )}
        </div>
      </div>

      <div className="transactions">
        {paginatedTransactions.map((transaction) => (
          <TransactionItem
            key={transaction.id}
            transaction={transaction}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default TransactionList;
