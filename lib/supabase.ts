import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Project = {
  id: string
  created_at: string
  title: string
  description: string
  category: string
  subcategory: string
  image_url: string       // main/after image
  before_image_url?: string | null // optional before photo
  alt_text: string
}

export const BUCKET = 'portfolio-uploads'

// ==================== IMAGE HANDLING ====================
export async function uploadImage(file: File): Promise<string> {
  const ext = file.name.split('.').pop()
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(filename, file, { cacheControl: '3600', upsert: false })
  if (error) throw error
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(filename)
  return data.publicUrl
}

export async function deleteImage(publicUrl: string): Promise<void> {
  const marker = `/${BUCKET}/`
  const idx = publicUrl.indexOf(marker)
  if (idx === -1) return
  const filePath = publicUrl.slice(idx + marker.length)
  const { error } = await supabase.storage.from(BUCKET).remove([filePath])
  if (error) throw error
}

// ==================== PROJECTS ====================
export async function getProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as Project[]
}

export async function insertProject(
  project: Omit<Project, 'id' | 'created_at'>
): Promise<{ data: Project | null; error: any }> {
  const { data, error } = await supabase
    .from('projects')
    .insert(project)
    .select()
    .single()

  if (error) {
    console.error('[insertProject] Supabase error:', {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    })
  }

  return { data, error }
}

export async function updateProject(
  id: string,
  updates: Partial<Omit<Project, 'id' | 'created_at'>>
): Promise<{ data: Project | null; error: any }> {
  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  return { data, error }
}

export async function deleteProject(id: string, imageUrl: string, beforeImageUrl?: string | null): Promise<void> {
  const { error } = await supabase.from('projects').delete().eq('id', id)
  if (error) throw error
  await deleteImage(imageUrl)
  if (beforeImageUrl) await deleteImage(beforeImageUrl)
}

// ==================== ARTISAN PHOTO (site_settings) ====================
export async function getArtisanImage(): Promise<string | null> {
  const { data, error } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', 'artisan_image_url')
    .maybeSingle();

  if (error) {
    console.error('[getArtisanImage] Supabase error:', error);
    return null;
  }
  return data?.value ?? null;
}

export async function updateArtisanImage(imageUrl: string): Promise<{ error: any }> {
  const { error } = await supabase
    .from('site_settings')
    .upsert(
      { key: 'artisan_image_url', value: imageUrl, updated_at: new Date().toISOString() },
      { onConflict: 'key' }
    );
  return { error };
}