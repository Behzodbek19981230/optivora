// ** Next Import
import { GetStaticProps, GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType } from 'next/types'
import axios from 'axios'
import EmployeeTab from '../EmployeeTab'

const EmployeeList = ({ tab }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return <EmployeeTab tab={tab}  />
}

export function getStaticPaths() {
  return {
    paths: [{ params: { tab: 'activated' } }, { params: { tab: 'deactivated' } }],
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = async ({ params }: GetStaticPropsContext) => {
  const res = await axios.get('/pages/profile', { params: { tab: params?.tab } })

  return {
    props: {
      tab: params?.tab
    }
  }
}

export default EmployeeList
