import LegalPageLayout from "./LegalPageLayout";
import { InstagramIcon } from "lucide-react";

const ContactUsPage = () => {
    return (
        <LegalPageLayout
            title="Contact Us"
            subtitle="We usually respond within 1-2 business days"
        >
            <section>
                <h2 className="text-xl font-semibold mb-2">Get in Touch</h2>
                <p style={{ color: "var(--textSec)" }}>
                    Need help with your account, coding challenges, payments, or platform
                    feedback? Reach our team through the channels below.
                </p>
            </section>

            <section className="grid sm:grid-cols-2 gap-4">
                <article
                    className="rounded-xl border p-4"
                    style={{ borderColor: "var(--border)", background: "var(--bg)" }}
                >
                    <h3 className="font-semibold mb-1">General Support</h3>
                    <a href="mailto:info.crackcode@gmail.com">
                        <p style={{ color: "var(--textSec)" }} >
                            info.crackcode@gmail.com
                        </p>
                    </a>
                </article>

                <article
                    className="rounded-xl border p-4"
                    style={{ borderColor: "var(--border)", background: "var(--bg)" }}
                >
                    <h3 className="font-semibold mb-1">Drop out a Message</h3>
                    <a href="https://www.instagram.com/crackcodelk" target="_blank" rel="noopener noreferrer">
                        <p style={{ color: "var(--textSec)" }}>
                            <InstagramIcon className="inline mr-2" />
                            @crackcodelk
                        </p>
                    </a>
                </article>
            </section>
        </LegalPageLayout>
    );
};

export default ContactUsPage;
