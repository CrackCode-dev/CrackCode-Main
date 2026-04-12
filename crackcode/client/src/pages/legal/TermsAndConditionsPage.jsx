import LegalPageLayout from "./LegalPageLayout";

const TermsAndConditionsPage = () => {
    return (
        <LegalPageLayout
            title="Terms and Conditions"
            subtitle="Last updated: April 11, 2026"
        >
            <section>
                <h2 className="text-xl font-semibold mb-2">1. Acceptance of Terms</h2>
                <p style={{ color: "var(--textSec)" }}>
                    By accessing and using CrackCode, you agree to follow these Terms and all
                    applicable laws and platform policies.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-2">2. User Responsibilities</h2>
                <p style={{ color: "var(--textSec)" }}>
                    Users must provide accurate account information, keep credentials secure,
                    and avoid misuse of coding tools, challenges, and community features.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-2">3. Intellectual Property</h2>
                <p style={{ color: "var(--textSec)" }}>
                    Platform branding, visual assets, and proprietary content remain the
                    property of CrackCode and its licensors unless stated otherwise.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-2">4. Prohibited Activities, Enforcement, and Account Actions</h2>
                <p style={{ color: "var(--textSec)" }}>
                    You agree not to engage in any activity that may harm, disrupt, or 
                    misuse the CrackCode platform. Prohibited activities include, but are not limited to:
                </p>
                <ul type="disc" className="ml-6 mb-4" style={{ color: "var(--textSec)" }}>
                    <li>- Attempting to gain unauthorized access to the platform, servers, or user accounts</li>
                    <li>- Exploiting bugs, vulnerabilities, or system loopholes</li>
                    <li>- Submitting malicious, harmful, or abusive code</li>
                    <li>- Using bots, scripts, or automation to gain unfair advantage</li>
                    <li>- Reverse engineering, copying, or redistributing platform features or content without permission</li>
                    <li>- Engaging in behavior that negatively affects other users or the platform’s integrity</li>
                </ul>
                <p style={{ color: "var(--textSec)" }}>
                    We reserve the right to investigate and take appropriate action against any
                    user who violates these terms, which may include warnings, temporary suspensions,
                    or permanent bans from the platform, at our sole discretion.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-2">5. Service Availability</h2>
                <p style={{ color: "var(--textSec)" }}>
                    We may modify, suspend, or update features at any time to improve
                    reliability, security, and user experience.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-2">6. Changes to Terms</h2>
                <p style={{ color: "var(--textSec)" }}>
                    We may update these terms at any time. Continued use means acceptance.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-2">7. Governing Law</h2>
                <p style={{ color: "var(--textSec)" }}>
                    These Terms and Conditions shall be governed by and interpreted in accordance 
                    with the laws of the <span className="font-bold">Democratic Socialist Republic of Sri Lanka</span>.
                </p>
            </section>
        </LegalPageLayout>
    );
};

export default TermsAndConditionsPage;
