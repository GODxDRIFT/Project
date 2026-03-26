import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../pages/term-and-conditions/terms.css";
import Head from "next/head";
import Link from "next/link";

const page = () => {
  return (
    <>
      <Head>
        <title>Return Policy | Biziffy</title>
        <meta
          name="description"
          content="Read Biziffy's Return policy to learn how we protect your personal and business information. Your data privacy and security are our top priority."
        />
        <meta
          name="keywords"
          content="Privacy Policy, Biziffy Privacy, user data protection, business data privacy, personal information policy, GDPR, data security, cookies policy, data handling, information confidentiality, secure data, online privacy, digital safety, terms of privacy, user trust, Biziffy policy, business privacy, listing privacy, data collection policy"
        />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Privacy Policy | Biziffy" />
        <meta
          property="og:description"
          content="Understand how Biziffy collects, uses, and protects your data. We prioritize your privacy and follow strict security protocols."
        />
        <meta property="og:url" content="https://biziffy.com/privacy-policy" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Biziffy" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Biziffy Privacy Policy" />
        <meta
          name="twitter:description"
          content="Your trust matters. Learn how Biziffy protects your data and respects your privacy."
        />
        <meta name="twitter:creator" content="@biziffy" />
      </Head>

      <div className="py-3 terms-container">
        <div className="container">
          <h1 className="terms-heading mb-4">
            Refund Policy for Bizi
            <span style={{ color: "var(--blue)" }}>ff</span>y
          </h1>
          <p>
            <strong>Effective Date : </strong> 08/08/2025
          </p>

          <div className="mb-4 terms-main">
            <p>
              At Biziffy.com, we provide paid listings for businesses and
              websites to increase their visibility and reach. As we do not sell
              physical goods, this refund policy applies solely to our listing
              and promotional services.
            </p>
          </div>

          <div className="mb-4 terms-main">
            <h4 className="terms-section-title">1. Nature of Services</h4>
            <p>We offer digital services including, but not limited to:</p>
            <ul>
              <li>Paid business listings</li>
              <li>Featured or promoted listings</li>
              <li>Sponsored placements</li>
              <li>Advertising packages</li>
            </ul>
            <p>
              Once a listing is published or promotion is activated, it is
              considered a delivered service.
            </p>
          </div>

          <div className="mb-4 terms-main">
            <h4 className="terms-section-title">2. Refund Eligibility</h4>
            <p>We offer refunds only under the following conditions:</p>
            <ul>
              <li>
                Duplicate charges: If you were accidentally charged more than
                once for the same listing or promotion.
              </li>
              <li>
                Technical issues on our end: If your listing was not published
                due to an error on our website and we cannot resolve it within a
                reasonable time.
              </li>
              <li>
                Service not delivered: If your listing or promotion was never
                activated as agreed.
              </li>
            </ul>
            <p>
              Refunds will <strong>NOT</strong> be issued in the following
              cases:
            </p>
            <ul>
              <li>You changed your mind after purchase</li>
              <li>
                You submitted incorrect or incomplete information for your
                listing
              </li>
              <li>
                Your listing was removed due to a violation of our Terms of
                Service or Listing Guidelines
              </li>
              <li>
                You did not receive the level of traffic or sales you expected
                (we do not guarantee specific results)
              </li>
            </ul>
          </div>

          <div className="mb-4 terms-main">
            <h4 className="terms-section-title">3. Cancellation Policy</h4>
            <p>
              You may cancel your paid listing or promotion at any time.
              However, cancellations do not automatically qualify for a refund
              unless one of the eligibility conditions above is met.
            </p>
          </div>

          <div className="mb-4 terms-main">
            <h4 className="terms-section-title">4. How to Request a Refund</h4>
            <p>
              To request a refund, please contact us at{" "}
              <a href="mailto:support@biziffy.com">support@biziffy.com</a>{" "}
              within 7 days of your purchase. Include:
            </p>
            <ul>
              <li>Your full name or business name</li>
              <li>Order or transaction ID</li>
              <li>Reason for the refund request</li>
              <li>Relevant details or screenshots (if applicable)</li>
            </ul>
            <p>
              We will review your request and respond within 5 business days.
            </p>
          </div>

          <div className="mb-4 terms-main">
            <h4 className="terms-section-title">5. Dispute Resolution</h4>
            <p>
              If you believe your request was unfairly denied, please reach out
              again to discuss further. We are committed to handling all
              concerns respectfully and reasonably.
            </p>
          </div>

          <div className="mb-4 terms-main">
            <h4 className="terms-section-title">6. Policy Changes</h4>
            <p>
              We may update this policy from time to time. The latest version
              will always be available on this page and will take effect
              immediately upon posting.
            </p>
          </div>

          <div className="mb-4 terms-main">
            <h4 className="terms-section-title">Questions?</h4>
            <ul>
              <li>
                Email:{" "}
                <a href="mailto:support@biziffy.com">support@biziffy.com</a>
              </li>
              <li>
                Mail: Mediaman Advertising, Barwala, Hisar, Haryana 132001
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
