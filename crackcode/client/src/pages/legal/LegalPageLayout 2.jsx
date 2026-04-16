import { useEffect } from "react";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";

const LegalPageLayout = ({ title, subtitle, children }) => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)", color: "var(--text)" }}>
            <Header variant="empty" />

            <main className="flex-1 pt-28 pb-28 px-6 sm:px-10">
                <section
                    className="w-full max-w-4xl mx-auto rounded-2xl border shadow-sm p-6 sm:p-10"
                    style={{ background: "var(--surface)", borderColor: "var(--border)" }}
                >
                    <div className="mb-8">
                        <h1 className="text-3xl sm:text-4xl font-bold mb-3" style={{ color: "var(--text)" }}>
                            {title}
                        </h1>
                        <p className="text-sm sm:text-base" style={{ color: "var(--textSec)" }}>
                            {subtitle}
                        </p>
                    </div>

                    <div className="space-y-6" style={{ color: "var(--text)" }}>
                        {children}
                    </div>
                </section>
            </main>

            <Footer variant="legalFixed" />
        </div>
    );
};

export default LegalPageLayout;
