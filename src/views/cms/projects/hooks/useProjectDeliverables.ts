import { useState, useEffect } from 'react'
import { ProjectDeliverable } from 'src/types/project-deliverable'
import { DataService } from 'src/configs/dataService'

export function useProjectDeliverables(projectId: number) {
  const [items, setItems] = useState<ProjectDeliverable[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!projectId) return
    setLoading(true)
    DataService.get(`/project-deliverable?project=${projectId}`).then((res: any) => {
      setItems(res.results || [])
    }).finally(() => setLoading(false))
  }, [projectId])

  const add = async (item: Omit<ProjectDeliverable, 'id'>) => {
    const res = await DataService.post('/project-deliverable', item)
    setItems(prev => [...prev, res.data ? res.data : res])
  }

  const remove = async (id: number) => {
    await DataService.delete(`/project-deliverable/${id}`)
    setItems(prev => prev.filter(i => i.id !== id))
  }

  return { items, loading, add, remove }
}
