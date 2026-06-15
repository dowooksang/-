import { supabase } from '@/lib/supabaseClient';
import { UserLevel } from '@/lib/userLevel';

// Re‑export UserLevel enum for existing imports
export { UserLevel } from '@/lib/userLevel';

/**
 * Supabase‑backed data access wrapper replacing the previous in‑memory DB.
 * Only the methods used throughout the project are implemented.
 */
export const db = {
  // ---------- Users ----------
  async getUser(email: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    if (error) throw error;
    return data;
  },

  async getUsers() {
    const { data, error } = await supabase.from('users').select('*');
    if (error) throw error;
    return data;
  },

  // ---------- Posts ----------
  async getPosts() {
    const { data, error } = await supabase.from('posts').select('*');
    if (error) throw error;
    return data;
  },

  async addPost(post: { title: string; content: string; author: string }) {
    const { data, error } = await supabase.from('posts').insert(post).single();
    if (error) throw error;
    return data;
  },

  async getPost(id: string) {
    const { data, error } = await supabase.from('posts').select('*').eq('id', id).single();
    if (error) return null; // not found
    return data;
  },

  async updatePost(id: string, updates: Partial<{ title: string; content: string; author: string }>) {
    const { data, error } = await supabase.from('posts').update(updates).eq('id', id).single();
    if (error) return null;
    return data;
  },

  async deletePost(id: string) {
    const { error } = await supabase.from('posts').delete().eq('id', id);
    return !error;
  },

  // ---------- Branches ----------
  async addBranch(branch: {
    name: string;
    managerName: string;
    managerPhone: string;
    region: string;
    hasPracticeRoom: boolean;
    bandCount: number;
    userId: string;
  }) {
    const { data, error } = await supabase
      .from('branches')
      .insert({
        name: branch.name,
        manager_name: branch.managerName,
        manager_phone: branch.managerPhone,
        region: branch.region,
        has_practice: branch.hasPracticeRoom,
        band_count: branch.bandCount,
        user_id: branch.userId,
        status: 'pending'
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      managerName: data.manager_name,
      managerPhone: data.manager_phone,
      region: data.region,
      hasPracticeRoom: data.has_practice,
      bandCount: data.band_count,
      status: data.status,
      userId: data.user_id,
      createdAt: data.created_at
    };
  },

  async getBranches() {
    const { data, error } = await supabase.from('branches').select('*');
    if (error) throw error;
    return data.map((b: any) => ({
      id: b.id,
      name: b.name,
      managerName: b.manager_name,
      managerPhone: b.manager_phone,
      region: b.region,
      hasPracticeRoom: b.has_practice,
      bandCount: b.band_count,
      status: b.status,
      userId: b.user_id,
      createdAt: b.created_at
    }));
  },

  // ---------- Admin utilities (generic) ----------
  async getUsersSafe() {
    const users = await this.getUsers();
    // remove password field
    return users.map((u: any) => {
      const { password, ...rest } = u;
      return rest;
    });
  },

  // ---------- Admin management functions ----------
  async approveBranch(branchId: string): Promise<boolean> {
    const { data: branch, error: getErr } = await supabase
      .from('branches')
      .select('user_id')
      .eq('id', branchId)
      .single();
    if (getErr || !branch) return false;

    const { error: updateBranchErr } = await supabase
      .from('branches')
      .update({ status: 'approved' })
      .eq('id', branchId);
    if (updateBranchErr) return false;

    const { error: updateUserErr } = await supabase
      .from('users')
      .update({ level: UserLevel.LV4_MANAGER })
      .eq('id', branch.user_id);
    
    return !updateUserErr;
  },

  async appointAdmin(userId: string): Promise<boolean> {
    const { error } = await supabase
      .from('users')
      .update({ level: UserLevel.LV5_ADMIN })
      .eq('id', userId);
    return !error;
  },

  async approveUser(userId: string): Promise<boolean> {
    const { error } = await supabase
      .from('users')
      .update({ status: 'active', level: UserLevel.LV2_MEMBER })
      .eq('id', userId);
    return !error;
  },

  async dismissAdmin(userId: string): Promise<boolean> {
    const { error } = await supabase
      .from('users')
      .update({ level: UserLevel.LV2_MEMBER })
      .eq('id', userId);
    return !error;
  },

  async changeUserLevel(userId: string, level: number): Promise<boolean> {
    const { error } = await supabase
      .from('users')
      .update({ level })
      .eq('id', userId);
    return !error;
  },
};


