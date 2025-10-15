import { GetStaticProps, GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType } from 'next/types'
import AgreementTabMain from 'src/views/pages/agreement/AgreementTab'
const AgreementTab = ({ tab }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return <AgreementTabMain tab={tab} />
}
export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [
      { params: { tab: 'confirmation' } },
      { params: { tab: 'collection' } },
      { params: { tab: 'support' } },
      { params: { tab: 'calculation_of_the_amount_of_goods' } }
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

export default AgreementTab
