import LegalPageLayout from "./LegalPageLayout";

const PrivacyPolicyPage = () => {
    return (
        <LegalPageLayout
            title="Privacy Policy"
            subtitle="Last updated: April 11, 2026"
        >
            <section>
                <p style={{ color: "var(--textSec)" }}>
                    Welcome to CrackCode. Your privacy matters to us. This Privacy Policy explains 
                    how we collect, use, and protect your information when you use our platform.
                </p><br />
                <p>By using CrackCode, you agree to the practices described below.</p>
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-2">1. Information We Collect</h2>
                <p style={{ color: "var(--textSec)" }}>
                    We collect account and gameplay-related information such as username, email,
                    progress data, leaderboard stats, and activity required to deliver CrackCode
                    features.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-2">2. How We Use Information</h2>
                <p style={{ color: "var(--textSec)" }}>
                    Your data is used to authenticate your account, personalize your learning
                    experience, show progress, improve platform performance, and provide support.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-2">3. Data Protection</h2>
                <p style={{ color: "var(--textSec)" }}>
                    We apply reasonable security safeguards to protect personal information and
                    limit access to authorized services and personnel.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-2">4. User Rights</h2>
                <p style={{ color: "var(--textSec)" }}>
                    You have the right to access, correct, or delete your personal information,
                    as well as the right to data portability and the right to withdraw consent.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-2">5. Data Retention and Children’s Privacy</h2>
                <p style={{ color: "var(--textSec)" }}>
                    We retain personal data only as long as necessary to provide and improve our services. 
                    Data that is no longer required will be securely deleted or anonymized.
                </p><br />
                <p style={{ color: "var(--textSec)" }}>
                    CrackCode is intended for users aged <b>12 and above</b>. We do not knowingly collect data 
                    from children under this age. If such data is identified, it will be removed promptly. 
                    Parents or guardians may contact us for assistance.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-2">6. Changes to Policy</h2>
                <p style={{ color: "var(--textSec)" }}>
                    We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on our website.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-2">7. Contact</h2>
                <p style={{ color: "var(--textSec)" }}>
                    If you have privacy questions, please use the Contact Us page and include
                    the subject "Privacy Inquiry".
                </p>
            </section>
        </LegalPageLayout>
    );
};

export default PrivacyPolicyPage;
