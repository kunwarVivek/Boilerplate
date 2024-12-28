import { useState } from 'react';
import { AuditAction } from '@/lib/audit/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface AuditLogFiltersProps {
  onFilterChange: (filters: {
    action?: AuditAction;
    targetType?: string;
    search?: string;
  }) => void;
}

export function AuditLogFilters({ onFilterChange }: AuditLogFiltersProps) {
  const [action, setAction] = useState<AuditAction>();
  const [targetType, setTargetType] = useState<string>();
  const [search, setSearch] = useState('');

  function handleFilterChange() {
    onFilterChange({
      action,
      targetType,
      search: search || undefined,
    });
  }

  function handleReset() {
    setAction(undefined);
    setTargetType(undefined);
    setSearch('');
    onFilterChange({});
  }

  return (
    <div className="flex gap-4 items-end">
      <div className="space-y-2">
        <label className="text-sm font-medium">Action</label>
        <Select
          value={action}
          onValueChange={(value) => setAction(value as AuditAction)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="settings.update">Settings Update</SelectItem>
            <SelectItem value="team.create">Team Create</SelectItem>
            <SelectItem value="member.invite">Member Invite</SelectItem>
            {/* Add other actions */}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Target Type</label>
        <Select
          value={targetType}
          onValueChange={setTargetType}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select target type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="team">Team</SelectItem>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="settings">Settings</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2 flex-1">
        <label className="text-sm font-medium">Search</label>
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search audit logs..."
        />
      </div>

      <div className="flex gap-2">
        <Button onClick={handleFilterChange}>Apply Filters</Button>
        <Button variant="outline" onClick={handleReset}>Reset</Button>
      </div>
    </div>
  );
}