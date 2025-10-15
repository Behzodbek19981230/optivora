import { useEffect, useState } from 'react'
import { DataService } from 'src/configs/dataService'
import endpoints from 'src/configs/endpoint '
import { CompanyProfile } from 'src/types/company-profile'
import CompanyProfileCard from 'src/views/cms/company-profile/CompanyProfileCard'
import CompanyProfileForm from 'src/views/cms/company-profile/CompanyProfileForm'
import DeleteConfirmDialog from 'src/views/cms/projects/dialogs/DeleteConfirmDialog'
import toast from 'react-hot-toast'

const CompanyProfilePage = () => {
  const [profile, setProfile] = useState<CompanyProfile | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [loading, setLoading] = useState(false)

  const fetchProfile = async () => {
    setLoading(true)
    const { data: { results: res } } = await DataService.get(endpoints.companyProfile)
    setProfile(Array.isArray(res) ? res[0] : res)
    setLoading(false)
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  const handleEdit = () => setEditMode(true)
  const handleDelete = () => setOpenDelete(true)

  const handleDeleteConfirm = async () => {
    if (profile?.id) {
      await DataService.delete(endpoints.companyProfileById(profile.id))
      setProfile(null)
      setOpenDelete(false)
      toast.success('Kompaniya profili o‘chirildi!')
    }
  }

  const handleSubmit = async (values: any) => {
    setLoading(true)
    try {
      let res
      if (profile?.id) {
        const formData = new FormData()
        Object.entries(values).forEach(([key, value]) => {
          if (key === 'logo' && value) {
            formData.append('logo', value as File)
          } else if (value !== undefined && value !== null) {
            formData.append(key, String(value))
          }
        })
        res = await DataService.putForm(endpoints.companyProfileById(profile.id), formData)
      } else {
        const formData = new FormData()
        Object.entries(values).forEach(([key, value]) => {
          if (key === 'logo' && value) {
            formData.append('logo', value as File)
          } else if (value !== undefined && value !== null) {
            formData.append(key, String(value))
          }
        })
        res = await DataService.postForm(endpoints.companyProfile, formData)
      }
      setProfile(res.data ? res.data : res)
      setEditMode(false)
      toast.success('Kompaniya profili saqlandi!')
    } catch {
      toast.error('Saqlashda xatolik!')
    }
    setLoading(false)
  }

  if (loading) return <div>Yuklanmoqda…</div>

  return (
    <div>
      {profile && !editMode ? (
        <CompanyProfileCard profile={profile} onEdit={handleEdit} onDelete={handleDelete} />
      ) : (
        <CompanyProfileForm initialValues={profile || {}} onSubmit={handleSubmit} loading={loading} />
      )}
      <DeleteConfirmDialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDeleteConfirm}
        title='Kompaniya profilini o‘chirishni tasdiqlang'
        description={profile ? `“${profile.name_uz || profile.name}” profilini o‘chirmoqchimisiz?` : undefined}
      />
    </div>
  )
}

CompanyProfilePage.acl = { action: 'read', subject: 'cms' }
CompanyProfilePage.authGuard = true

export default CompanyProfilePage
