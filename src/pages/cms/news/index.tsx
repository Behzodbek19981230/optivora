import { useState } from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import NewsCardGrid from 'src/views/cms/news/NewsCardGrid'
import { DataService } from 'src/configs/dataService'
import endpoints from 'src/configs/endpoint '
import { NewsPost } from 'src/types/news-post'
import Link from 'next/link'
import DeleteConfirmDialog from 'src/views/cms/projects/dialogs/DeleteConfirmDialog'
import { useFetchList } from 'src/hooks/useFetchList'
import { CardContent } from '@mui/material'

const NewsListPage = () => {
  const [selected, setSelected] = useState<NewsPost | null>(null)
  const [openDelete, setOpenDelete] = useState(false)
  const { data = [], mutate } = useFetchList<NewsPost>(endpoints.news, { perPage: 100 })

  const handleDelete = (item: NewsPost) => {
    setSelected(item)
    setOpenDelete(true)
  }

  const handleDeleteConfirm = async () => {
    if (selected) {
  await DataService.delete(endpoints.newsById(selected.id))
      mutate()
      setOpenDelete(false)
    }
  }

  return (
    <Card>
      <CardHeader
        title='Yangiliklar'
        action={
          <Link href='/cms/news/create' passHref legacyBehavior>
            <Button variant='contained' component='a'>Yangi yangilik</Button>
          </Link>
        }
      />
      <CardContent>
        <NewsCardGrid data={data} onDelete={handleDelete} />
      </CardContent>
      <DeleteConfirmDialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDeleteConfirm}
        title='Yangilikni o‘chirishni tasdiqlang'
        description={selected ? `“${selected.title}” yangiligini o‘chirmoqchimisiz?` : undefined}
      />
    </Card>
  )
}

NewsListPage.acl = { action: 'read', subject: 'cms' }
NewsListPage.authGuard = true

export default NewsListPage
