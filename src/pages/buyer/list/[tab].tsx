// ** Next Import
import { GetStaticProps, GetStaticPropsContext, InferGetStaticPropsType } from 'next/types'
import axios from 'axios'
import BuyerTab from '../components/BuyerTab'

const BuyersList = ({ tab }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return <BuyerTab tab={tab} />
}

export function getStaticPaths() {
  return {
    paths: [{ params: { tab: 'all' } }, { params: { tab: 'verified' } }, { params: { tab: 'on_verification' } }],
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

export default BuyersList
