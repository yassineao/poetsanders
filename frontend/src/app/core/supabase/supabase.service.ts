// src/app/services/supabase.service.ts
import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment.generated';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient | null = null;

  getPublicImageUrl(bucket: string, filePath: string): string {
    const supabase = this.getClient();
    if (!supabase) {
      return '';
    }

    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  async getPrivateImageUrl(
    bucket: string,
    filePath: string
  ): Promise<string | null> {
    const supabase = this.getClient();
    if (!supabase) {
      console.error('Supabase is not configured. Set SUPABASE_URL and SUPABASE_KEY in frontend/.env.');
      return null;
    }

    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(filePath, 3600); // valid for 1 hour

    if (error) {
      console.error('Could not load image:', error.message);
      return null;
    }

    return data.signedUrl;
  }

  private getClient(): SupabaseClient | null {
    if (this.supabase) {
      return this.supabase;
    }

    if (!environment.supabaseUrl || !environment.supabaseKey) {
      return null;
    }

    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    return this.supabase;
  }
}
