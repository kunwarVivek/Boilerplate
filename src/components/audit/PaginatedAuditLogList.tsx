import { useState } from 'react';
import { AuditLogList } from './AuditLogList';
import { AuditLogFilters } from './AuditLogFilters';
import { Pagination } from '@/components/ui/pagination';
import { usePagination } from '@/hooks/usePagination';
import { Card } from '@/components/ui/card';

const ITEMS_PER_PAGE = 10;

interface PaginatedAuditLogListProps {
  organizationId: string;
}

export function PaginatedAuditLogList({ organizationId }: PaginatedAuditLogListProps) {
  const [totalItems, setTotalItems] = useState(0);
  const [filters, setFilters] = useState({});
  
  const pagination = usePagination({
    totalItems,
    itemsPerPage: ITEMS_PER_PAGE,
  });

  return (
    <Card>
      <div className="p-6 space-y-6">
        <AuditLogFilters
          onFilterChange={setFilters}
        />
        
        <AuditLogList
          organizationId={organizationId}
          limit={ITEMS_PER_PAGE}
          offset={pagination.offset}
          filters={filters}
          onTotalItemsChange={setTotalItems}
        />
        
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={pagination.goToPage}
        />
      </div>
    </Card>
  );
}