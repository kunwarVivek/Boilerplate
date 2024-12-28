import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createTeam } from '@/lib/teams';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const teamSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
});

type TeamFormData = z.infer<typeof teamSchema>;

interface TeamCreateDialogProps {
  organizationId: string;
  onTeamCreated: () => void;
}

export function TeamCreateDialog({ organizationId, onTeamCreated }: TeamCreateDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const form = useForm<TeamFormData>({
    resolver: zodResolver(teamSchema),
  });

  async function onSubmit(data: TeamFormData) {
    try {
      setLoading(true);
      await createTeam({
        name: data.name,
        description: data.description,
        organizationId,
      });
      toast.success('Team created successfully');
      setOpen(false);
      onTeamCreated();
      form.reset();
    } catch (error) {
      toast.error('Failed to create team');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Team</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Team</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Engineering" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Team description..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating...' : 'Create Team'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}