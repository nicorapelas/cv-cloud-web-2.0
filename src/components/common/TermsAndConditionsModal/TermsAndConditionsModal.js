import React, { useState, useEffect } from 'react';
import './TermsAndConditionsModal.css';

const TermsAndConditionsModal = ({
  isOpen,
  onClose,
  onAccept,
  currentlyAccepted,
}) => {
  const [privacyChecked, setPrivacyChecked] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);

  // When modal opens, set checkboxes based on currentlyAccepted state
  useEffect(() => {
    if (isOpen) {
      setPrivacyChecked(currentlyAccepted);
      setTermsChecked(currentlyAccepted);
    }
  }, [isOpen, currentlyAccepted]);

  if (!isOpen) return null;

  const handleAccept = () => {
    if (privacyChecked && termsChecked) {
      onAccept(true);
    }
  };

  const handleClose = () => {
    // If either box is unchecked, update parent state to false
    if (!privacyChecked || !termsChecked) {
      onAccept(false);
    }
    // Reset to the current accepted state
    setPrivacyChecked(currentlyAccepted);
    setTermsChecked(currentlyAccepted);
    onClose();
  };

  return (
    <div className="terms-modal-overlay">
      <div className="terms-modal">
        <div className="terms-modal-header">
          <h2>Terms and Conditions</h2>
          <button
            className="terms-modal-close"
            onClick={handleClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="terms-modal-content">
          <div className="terms-content">
            <h3>CV CLOUD</h3>
            <h3>MOBILE APPLICATION / WEBSITE TERMS OF USE</h3>

            <p>
              CV Cloud is owned and operated by a sole proprietorship. CV Cloud
              has been developed to assist users with compiling a professional
              CV within a couple of minutes.
            </p>

            <p>
              These Terms of Use should be read together with our Privacy Policy
              that follows.
            </p>

            <h4>1 Acceptance of these Terms of Use.</h4>
            <p>
              1.1 These Terms of Use, including our Privacy Policy and all other
              polices that may be posted on CV Cloud set out the terms on which
              we offer you access to use our mobile application and website. All
              of our policies are incorporated into these Terms of Use. Your
              agree to comply with all of our policies and in particular these
              Terms of Use when you access and use our website.
            </p>
            <p>
              1.2 It is your responsibility to familiarise yourself with these
              Terms and check them regularly for any updates.
            </p>
            <p>
              1.3 By accessing the website and using our services, you agree to
              all the terms set out in these Terms of Use, which are designed to
              make sure that the website is useful to everyone. Should you not
              agree to these terms, or any of our updates or changes thereto as
              dealt with below, you should not access or use website.
            </p>
            <p>
              1.4 You confirm that you are 18 years or older, or that you have
              been duly assisted to consent to these terms.
            </p>

            <h4>2 Log-in details and passwords.</h4>
            <p>
              2.1 You must be registered to create a CV on CV Cloud. You are
              responsible for all actions taken using your username, email
              address and password.
            </p>
            <p>
              2.2 You agree that you will use your username and password for
              your personal use only and will not disclose it to or share it
              with any unauthorised third party.
            </p>

            <h4>3 Using CV Cloud.</h4>
            <p>
              3.1 As a condition of your use of CV Cloud, you agree that you
              will not:
            </p>
            <ul>
              <li>
                use CV Cloud in any manner that could impair our mobile
                application and/or website in any way or interfere with any
                party's use or enjoyment of our mobile application and/or
                website;
              </li>
              <li>
                distribute viruses or any other technologies that may harm CV
                Cloud or the interests or property of CV Cloud users;
              </li>
              <li>
                impose an unreasonable load on our infrastructure or interfere
                with the proper working of CV Cloud;
              </li>
              <li>
                copy, modify, or distribute any other person's content without
                their consent;
              </li>
              <li>
                use any robot spider, scraper or other automated means to access
                CV Cloud and collect content for any purpose without our express
                written permission;
              </li>
              <li>
                harvest or otherwise collect information about others, including
                email addresses, without their consent or otherwise violate the
                privacy of another person;
              </li>
              <li>
                bypass measures used to prevent or restrict access to CV Cloud.
              </li>
            </ul>

            <p>
              3.2 You are solely responsible for all information that you upload
              to CV Cloud and any resultant consequences. We reserve the right
              for any or no reason, at our discretion to refuse or delete any CV
              content (or any part thereof) that we believe is inappropriate or
              is in breach of these Terms of Use or any of our other policies.
              We also reserve the right at our discretion to restrict your use
              of CV Cloud either temporarily or permanently, or refuse a your
              registration.
            </p>

            <h4>4 Protecting CV Cloud.</h4>
            <p>
              4.1 CV Cloud works to keep the mobile application / website
              working properly and the community safe. Please report problems,
              offensive content and policy breaches to us at the following email
              address nicorapelas@gmail.com
            </p>
            <p>
              4.2 Without limiting other remedies which might be available to
              us, we may issue warnings, limit or terminate our service, remove
              hosted content and take technical and legal steps to keep users
              off CV Cloud if we think that they are creating problems or acting
              inconsistently with the letter or spirit of our policies. However,
              whether we decide to take any of these steps is our decision and
              we do not accept any liability for monitoring CV Cloud or for
              unauthorised or unlawful content on CV Cloud or use of CV Cloud by
              users.
            </p>
            <p>
              4.3 You also recognise and accept that CV Cloud is not under any
              obligation to monitor any data or content which is submitted to or
              available on the website.
            </p>

            <h4>5 Fees.</h4>
            <p>
              5.1 Using CV Cloud to create, email and print your CV is free.
            </p>
            <p>
              5.2 You may incur data charges at your carrier's applicable rates
              when using CV Cloud.
            </p>

            <h4>6 Content on CV Cloud.</h4>
            <p>
              CV Cloud may contain content from us and other businesses that may
              advertise on the mobile application and/or website from time to
              time. CV Cloud is protected by copyright laws. Content displayed
              on or via CV Cloud is protected as a collective work and/or
              compilation, pursuant to copyrights laws. You agree not to copy,
              distribute or modify content from CV Cloud without our express
              written consent. You may not disassemble or decompile, reverse
              engineer or otherwise attempt to discover any source code
              contained in CV Cloud. Without limiting the foregoing, you agree
              not to reproduce, copy, sell, resell, or exploit for any purposes
              any aspect of CV Cloud.
            </p>

            <h4>7 Liability.</h4>
            <p>
              7.1 CV Cloud does not act a labour broker, or otherwise. CV Cloud
              is only a platform which allows users to create, email and print
              their CV and is not otherwise involved in any users job
              applications process.
            </p>
            <p>
              7.2 We do not actively monitor data or content. We are not
              involved in any interactions which may subsequently be entered
              into as a result of preparing your CV on CV Cloud.
            </p>
            <p>
              7.3 You understand that it is a criminal offence to deliberately
              include any false information and/or information which may deceive
              a prospective employer in your CV. CV Cloud does not take any
              responsibility for the content included in your CV and it is your
              responsibility to ensure that your CV is correct, no misleading
              and up to date.
            </p>
            <p>
              7.4 CV Cloud may contain links to third-party websites which offer
              certain goods or services. These websites, services and and/or
              goods are beyond the control of CV Cloud. CV Cloud is not involved
              in transactions between users and the operators of such
              third-party sites. CV Cloud does not accept responsibility for
              their content, services and/or products.
            </p>
            <p>
              7.5 We cannot guarantee continuous, error-free or secure access to
              our services or that defects in the service will be corrected.
            </p>
            <p>
              7.6 While we will use reasonable efforts to maintain an
              uninterrupted service, we cannot guarantee this and we do not give
              any promises or warranties (whether express or implied) about the
              availability of our website.
            </p>
            <p>
              7.7 Accordingly, to the extent legally permitted we expressly
              disclaim all warranties, representations and conditions, express
              or implied, including those of quality, merchantability,
              merchantable quality, durability, fitness for a particular purpose
              and those arising by statute. We are not liable for any loss,
              whether of money (including profit), goodwill, or reputation, or
              any special, indirect, or consequential damages arising out of
              your use of CV Cloud, even if you advise us or we could reasonably
              foresee the possibility of any such damage occurring.
            </p>
            <p>
              7.8 Nothing in these terms shall limit our liability for
              fraudulent misrepresentation, for death or personal injury
              resulting from our negligence or the negligence of our agents or
              employees.
            </p>

            <h4>8 Security.</h4>
            <p>
              In order to ensure the security and reliable operation of the
              website for all users, we reserve the right at our sole and
              absolute discretion to take whatever action it finds necessary to
              preserve the security, integrity and reliability of our network
              and back-office applications. Any user who commits any of the
              offences detailed in Chapter 13 of the Electronic Communications
              and Transactions Act, 2002 (specifically sections 85 to 88
              (inclusive)) or the Cybercrimes Act, 2020 will, notwithstanding
              criminal prosecution, be liable for all resulting liability, loss
              or damages suffered and/or incurred by CV Cloud and its
              affiliates, agents and/or partners.
            </p>

            <h4>9 General.</h4>
            <p>
              9.1 These terms and the other policies posted on CV Cloud
              constitute the entire agreement between CV Cloud and you.
            </p>
            <p>
              9.2 This agreement shall be governed by the laws of the Republic
              of South Africa. You agree that any claim or dispute you may have
              against CV Cloud must be resolved by in the courts of the Republic
              of South Africa.
            </p>
            <p>
              9.3 If we don't enforce any particular provision, we are not
              waiving our right to do so later. If a court strikes down any of
              these terms, the remaining terms will survive.
            </p>
            <p>
              9.4 We may update these Terms of Use at any time and in our sole
              discretion. Any such change will be effective from the date of
              being posted on the mobile application / website.
            </p>

            <h3>CV CLOUD</h3>
            <h3>MOBILE APPLICATION / WEBSITE PRIVACY POLICY</h3>

            <h4>1. ABOUT THIS POLICY</h4>
            <p>
              1.1 This Policy describes how CV Cloud Processes information we
              collect and/or receive from you.
            </p>
            <p>
              1.2 CV Cloud is a sole proprietorship; with its primary place of
              business at 3 Halitestreet, Carletonville.
            </p>
            <p>
              1.3 CV Cloud is a "Responsible Party". This means that we are
              responsible for deciding how we hold and use Personal Information
              about you. We are required under data protection legislation to
              notify you of the information contained in this Privacy Policy.
            </p>
            <p>
              1.4 This Policy applies to all Data Subjects who visit this
              Website and all Data Subjects who CV Cloud Processes their
              Personal Information.
            </p>

            <h4>2. DEFINITIONS</h4>
            <p>2.1. For purposes of this Policy:</p>
            <ul>
              <li>"CV Cloud", "Us" or "We" means CV Cloud;</li>
              <li>
                "Data Subject" or "You" means any person to whom the specific
                Personal Information relates, as contemplated in POPIA;
              </li>
              <li>"IO" means the Information Officer of CV Cloud;</li>
              <li>
                "Personal Information" means information relating to an
                identifiable, living, natural person, and (where applicable) an
                identifiable, existing juristic person, including the name,
                race, gender, marital status, address and identifying number of
                a person, symbol, e-mail address, physical address, telephone
                number, location information, online identifier or other
                particular assignment to the person;
              </li>
              <li>
                "Policy" or "Privacy Policy" means this Website Privacy Policy;
              </li>
              <li>
                "POPIA" means the Protection of Personal Information, of 2013;
              </li>
              <li>
                "Processing" or "Process" means any activity that involves the
                use of Personal Information;
              </li>
              <li>
                "Special personal information" means personal information
                concerning the religious or philosophical beliefs, race or
                ethnic origin, trade union membership, political persuasion,
                health or sex life or biometric information of a data subject;
              </li>
              <li>
                "Social Media Platforms" means platforms such as Facebook,
                LinkedIn, Twitter, Pinterest, YouTube, Instagram, WeChat,
                WhatsApp, TikTok, blogs and all other similar Social Media or
                communication platforms;
              </li>
              <li>
                "Website" means CV Cloud's website and mobile application
                www.cvcloud.app
              </li>
            </ul>

            <h4>3. INFORMATION WE COLLECT AND RECEIVE</h4>
            <p>
              We collect and receive information about you in the following
              ways:
            </p>
            <p>
              3.1 Information you give us - This includes any information that
              you provide to us directly:
            </p>
            <ul>
              <li>when you sign-up to use our services;</li>
              <li>
                by filling in forms on our websites, or those provided to you;
                or
              </li>
              <li>
                when you contact us or we contact you and you provide
                information directly to us.
              </li>
            </ul>

            <p>3.2 Personal Information we collect:</p>
            <p>
              3.2.1 When you register to use our services, you will be required
              to provide us with the following information, your:
            </p>
            <ul>
              <li>name and surname; and</li>
              <li>email address.</li>
            </ul>

            <p>
              3.2.2 We will also collect the Personal Information which you
              upload onto your profile when building your CV, this will include
              (without limitation):
            </p>
            <ul>
              <li>contact details;</li>
              <li>physical address;</li>
              <li>education and job history;</li>
              <li>race information; and/or</li>
              <li>health information.</li>
            </ul>

            <p>
              3.2.3 By submitting the above information to us when preparing
              your CV you hereby consent to us collecting and otherwise
              Processing such Personal Information and Special Personal
              Information.
            </p>

            <h4>4. HOW WE USE THE INFORMATION WE COLLECT AND RECEIVE.</h4>
            <p>
              We use the information we collect and receive for the following
              general purposes:
            </p>
            <ul>
              <li>
                to provide you with information, products or services you
                request from us;
              </li>
              <li>
                in order to refer you to an appropriate third-party service
                provider;
              </li>
              <li>to communicate with you;</li>
              <li>to provide you with support; and</li>
              <li>
                to provide effective advertising (for example to be provide you
                with news, special offers and general information about other
                goods, services and events which we offer, that are similar to
                those that you have already enquired about).
              </li>
            </ul>

            <h4>5 HOW WE SHARE THE INFORMATION WE COLLECT AND RECEIVE.</h4>
            <p>
              5.1 We don't sell your Personal Information to third parties for
              their marketing purposes.
            </p>
            <p>
              5.2 We may share information with our affiliates, employees, third
              party service providers, legal authorities, and third-parties
              where you provide consent.
            </p>

            <h4>6 YOUR RIGHTS.</h4>
            <p>
              6.1 You have the right to ask us not to contact you for marketing
              purposes. You can exercise this right at any time by using any of
              the various "opt-out" options that we will always provide to you
              when we communicate with you.
            </p>
            <p>
              6.2 Our website use cookies. If you wish to reject our cookies,
              you can configure your browser to do so.
            </p>
            <p>
              6.3 We want to make sure that any data we hold about you is up to
              date. So, if you think your Personal Information is inaccurate,
              you can ask us to correct or remove it.
            </p>

            <h4>7 RETENTION OF DATA.</h4>
            <p>
              We will retain your Personal Information only for as long as is
              necessary for the purposes set out in this privacy policy or to
              comply with our legal obligations, resolve disputes, and enforce
              our legal agreements and policies.
            </p>

            <h4>8 OUR COMMITMENT TO SECURITY.</h4>
            <p>
              The security of your data is important to us. While we strive to
              use commercially acceptable means to protect your Personal
              Information, we cannot guarantee its absolute security. However,
              we do employ a number of safeguards intended to mitigate the risk
              of unauthorised access or disclosure of your information.
            </p>

            <h4>9 TRANSFER OF DATA.</h4>
            <p>
              9.1 We are based in and operate from South Africa. Your
              information, including Personal Information, may be transferred to
              and maintained on servers located outside of your country of
              residence, where the data privacy laws, regulations and standards,
              may not be equivalent to the laws in your country of residence.
            </p>
            <p>
              9.2 We might transfer your Personal Information to places outside
              of South Africa and store it there, where our suppliers might
              Process it. If that happens, your Personal Information will only
              be transferred to and stored in country that has equivalent, or
              better, data protection legislation than South Africa.
            </p>
            <p>
              9.3 Your use of our Website, followed by your submission of
              information to us, represents your consent to such transfer.
            </p>
            <p>
              9.4 We will take all steps reasonably necessary to ensure that
              your data is treated securely and in accordance with this Policy.
            </p>

            <h4>10 LINKS TO OTHER WEBSITES.</h4>
            <p>
              Our Website or Social Media platforms may contain links to and
              from websites, mobile applications or services of third parties,
              advertisers or affiliates. Please note that we are not responsible
              for the privacy practices of such other parties and advise you to
              read the privacy statements of each website you visit which
              collects Personal Information.
            </p>

            <h4>11 CHANGES TO THIS PRIVACY POLICY.</h4>
            <p>
              We may update this Privacy Policy from time to time. Any changes
              that we may make to our privacy policy will be posted on our
              website and will be effective from the date of posting.
            </p>

            <h4>
              12 ACCESS TO, CORRECTION AND DELETION OF YOUR PERSONAL
              INFORMATION.
            </h4>
            <p>
              12.1 You may request details of Personal Information which we hold
              about you under the Promotion of Access to Information Act, 2000
              ("PAIA").
            </p>
            <p>
              12.2 You may request the correction of Personal Information CV
              Cloud holds about you.
            </p>
            <p>
              12.3 You have a right in certain circumstances to request the
              destruction or deletion of and, where applicable, to obtain
              restriction on the Processing of Personal Information held about
              you.
            </p>
            <p>
              12.4 You have a right to object on reasonable grounds to the
              Processing of your Personal Information where the Processing is
              carried out in order to protect our legitimate interests or your
              legitimate interests, unless the law provides for such Processing.
            </p>

            <h4>13 COMPLAINTS.</h4>
            <p>
              13.1 Should you believe that CV Cloud has utilised your Personal
              Information contrary to Applicable Laws, you undertake to first
              attempt to resolve any concerns with us.
            </p>
            <p>
              13.2 If you are not satisfied with such process, you may have the
              right to lodge a complaint with the Information Regulator, using
              the contact details listed below:
            </p>
            <p>
              E-mail address: complaints.IR@justice.gov.za
              <br />
              Physical address: JD House 27, Stiemens Street, Braamfontein,
              Johannesburg, 2001
            </p>

            <h4>14 IO CONTACT DETAILS.</h4>
            <p>
              If you have any comments or questions about this Statement or how
              we handle your Personal Information, please contact the
              Information Officer.
            </p>
            <p>
              IO Name: Nico Rapelas
              <br />
              E-mail address: nicorapelas@gmail.com
            </p>
          </div>
        </div>

        <div className="terms-modal-footer">
          <div className="terms-checkboxes">
            <label className="terms-checkbox-label">
              <input
                type="checkbox"
                checked={privacyChecked}
                onChange={e => setPrivacyChecked(e.target.checked)}
                className="terms-checkbox"
              />
              <span className="terms-checkbox-text">
                I accept CV Cloud Privacy Policy
              </span>
            </label>

            <label className="terms-checkbox-label">
              <input
                type="checkbox"
                checked={termsChecked}
                onChange={e => setTermsChecked(e.target.checked)}
                className="terms-checkbox"
              />
              <span className="terms-checkbox-text">
                I accept CV Cloud Terms of Use
              </span>
            </label>
          </div>

          <div className="terms-modal-actions">
            <button className="terms-modal-cancel" onClick={handleClose}>
              Cancel
            </button>
            <button
              className="terms-modal-accept"
              onClick={handleAccept}
              disabled={!privacyChecked || !termsChecked}
            >
              Accept & Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditionsModal;
