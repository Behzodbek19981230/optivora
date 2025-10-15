import { GetStaticPaths, GetStaticProps, GetStaticPropsContext, InferGetStaticPropsType } from 'next/types'
import BillingTabMain from 'src/views/pages/billing/BillingTab'

const BillingTab = ({ tab }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return <BillingTabMain tab={tab} />
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [{ params: { tab: 'transaction_type_a' } }, { params: { tab: 'transactions_type_in' } }],
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

export default BillingTab
