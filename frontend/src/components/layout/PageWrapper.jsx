/**
 * NyayaSetu — Page Wrapper
 * Layout shell: Navbar + main content + Footer + CustomCursor
 */
import NavBar from './Navbar';
import Footer from './Footer';
import CustomCursor from '@/components/common/CustomCursor';

const PageWrapper = ({ children, hideFooter = false }) => (
  <div className="relative min-h-screen w-screen overflow-x-hidden bg-ct-void text-ct-ivory">
    <CustomCursor />
    <NavBar />
    <main id="main-content" tabIndex={-1}>
      {children}
    </main>
    {!hideFooter && <Footer />}
  </div>
);

export default PageWrapper;
