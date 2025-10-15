import { useState, useEffect } from 'react'
import { ProjectImage } from 'src/types/project-image'
import { DataService } from 'src/configs/dataService'

export function useProjectImages(projectId: number) {
  const [items, setItems] = useState<ProjectImage[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!projectId) return
    setLoading(true)
    DataService.get(`/project-image?project=${projectId}`).then((res: any) => {
      setItems(res.results || [])
    }).finally(() => setLoading(false))
  }, [projectId])

  const add = async (item: Omit<ProjectImage, 'id' | 'image'>, file: File) => {
    const formData = new FormData()
    Object.entries(item).forEach(([k, v]) => formData.append(k, String(v)))
    formData.append('image', file)
    const res = await DataService.postForm('/project-image', formData)
    setItems(prev => [...prev, res.data ? res.data : res])
  }

  const remove = async (id: number) => {
    await DataService.delete(`/project-image/${id}`)
    setItems(prev => prev.filter(i => i.id !== id))
  }

  return { items, loading, add, remove }
}
