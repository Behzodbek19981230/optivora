// ** Next Import
import { GetStaticProps, GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType } from 'next/types'
import ReportTab from 'src/views/pages/reports/ReportTab'

const ReportsTab = ({ tab }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return <ReportTab tab={tab} />
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [
      { params: { tab: 'bnpl' } },
      { params: { tab: 'extension-to-bnpl' } },
      { params: { tab: 'statistics-by-region' } },
      { params: { tab: 'merchant-statistics' } },
      { params: { tab: 'borrower-statistics' } },
      { params: { tab: 'briefcase' } }
    ],
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

export default ReportsTab
