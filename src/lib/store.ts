import { supabase } from '@/lib/supabaseClient';

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
    const { data, error } = await supabase.from('branches').insert(branch).single();
    if (error) throw error;
    return data;
  },

  async getBranches() {
    const { data, error } = await supabase.from('branches').select('*');
    if (error) throw error;
    return data;
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
};


