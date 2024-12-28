import { supabase } from '../supabase';
import { Invitation } from './types';

export async function createInvitation(data: {
  email: string;
  teamId: string;
  organizationId: string;
  role: string;
}): Promise<Invitation> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error('Not authenticated');

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

  const { data: invitation, error } = await supabase
    .from('team_invitations')
    .insert({
      email: data.email,
      team_id: data.teamId,
      organization_id: data.organizationId,
      role: data.role,
      invited_by: userData.user.id,
      expires_at: expiresAt.toISOString(),
      status: 'pending',
    })
    .select()
    .single();

  if (error) throw error;
  return invitation;
}

export async function getTeamInvitations(teamId: string): Promise<Invitation[]> {
  const { data, error } = await supabase
    .from('team_invitations')
    .select('*')
    .eq('team_id', teamId)
    .eq('status', 'pending');

  if (error) throw error;
  return data;
}

export async function acceptInvitation(invitationId: string): Promise<void> {
  const { data: invitation, error: fetchError } = await supabase
    .from('team_invitations')
    .select('*')
    .eq('id', invitationId)
    .single();

  if (fetchError) throw fetchError;
  if (!invitation) throw new Error('Invitation not found');

  const { error: updateError } = await supabase
    .from('team_invitations')
    .update({ status: 'accepted' })
    .eq('id', invitationId);

  if (updateError) throw updateError;

  const { error: memberError } = await supabase
    .from('team_members')
    .insert({
      team_id: invitation.team_id,
      user_id: invitation.email, // Will be replaced with actual user ID
      role: invitation.role,
    });

  if (memberError) throw memberError;
}