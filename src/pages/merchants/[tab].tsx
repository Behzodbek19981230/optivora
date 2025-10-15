import { GetStaticProps, GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType } from 'next/types'
import MerchantTabMain from 'src/views/pages/merchants/MerchantTab'

const MerchantTab = ({ tab }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return <MerchantTabMain tab={tab} />
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [{ params: { tab: 'allgood' } }, { params: { tab: 'allgood-car' } }],
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = async ({ params }: GetStaticPropsContext) => {
  return {
    props: {
      tab: params?.tab
    }
  }
}

export default MerchantTab
