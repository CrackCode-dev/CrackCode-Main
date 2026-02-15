import Header from '../../components/common/Header'
import Footer from '../../components/common/Footer'
import LeftSidebar from '../../components/home/LeftSidebar'
import RightSidebar from '../../components/home/RightSidebar'
import ContentArea from '../../components/home/ContentArea'

function Home() {
  return (
    <div className='h-screen flex flex-col justify-between bg-[#050505] text-white'>
      <Header variant="default" />
      
      <main className='flex flex-1 px-6 sm:px-10 py-10 w-full'>
        <div className='flex gap-6 pt-20 w-full overflow-hidden'>
          <LeftSidebar />
          <ContentArea />
          <RightSidebar />
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Home