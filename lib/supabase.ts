import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Project = {
  id: string
  created_at: string
  title: string
  description: string
  category: 'Sofa' | 'Chairs' | 'Restorations' | 'Living Room' | 'Restaurant' | 'Before & After'
  image_url: string
  alt_text: string
}

export const BUCKET = 'portfolio-uploads'

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
): Promise<Project> {
  const { data, error } = await supabase
    .from('projects')
    .insert(project)
    .select()
    .single()
  if (error) throw error
  return data as Project
}

export async function deleteProject(id: string, imageUrl: string): Promise<void> {
  const { error } = await supabase.from('projects').delete().eq('id', id)
  if (error) throw error
  await deleteImage(imageUrl)
}