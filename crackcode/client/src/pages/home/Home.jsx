import Header from '../../components/common/Header'
import Footer from '../../components/common/Footer'
import LeftSidebar from '../../components/home/LeftSidebar'
import RightSidebar from '../../components/home/RightSidebar'
import ContentArea from '../../components/home/ContentArea'

function Home() {
  return (
    <div className='min-h-screen flex flex-col justify-between bg-[#050505] text-white'>
      <Header variant="default" />
      
      <main className='flex-grow flex gap-6 p-6 pt-24 w-full'>
        <LeftSidebar />
        <ContentArea />
        <RightSidebar />
      </main>

      <Footer />
    </div>
  )
}

export default Home