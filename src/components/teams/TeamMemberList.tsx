import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { supabase } from '@/lib/supabase';

interface TeamMember {
  id: string;
  user: {
    full_name: string;
    email: string;
    avatar_url?: string;
  };
  role: string;
}

export function TeamMemberList({ teamId }: { teamId: string }) {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMembers() {
      try {
        const { data, error } = await supabase
          .from('team_members')
          .select(`
            id,
            role,
            user:users (
              full_name,
              email,
              avatar_url
            )
          `)
          .eq('team_id', teamId);

        if (error) throw error;
        setMembers(data);
      } catch (error) {
        console.error('Failed to load team members:', error);
      } finally {
        setLoading(false);
      }
    }

    loadMembers();
  }, [teamId]);

  if (loading) {
    return <div>Loading members...</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Member</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((member) => (
          <TableRow key={member.id}>
            <TableCell className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={member.user.avatar_url} />
                <AvatarFallback>
                  {member.user.full_name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <span>{member.user.full_name}</span>
            </TableCell>
            <TableCell>{member.user.email}</TableCell>
            <TableCell className="capitalize">{member.role}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}