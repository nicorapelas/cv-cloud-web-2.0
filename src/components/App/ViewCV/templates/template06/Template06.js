import React from 'react';
import moment from 'moment';
import './template06.css';

const Template06 = ({ cvData }) => {
  const {
    personalInfo,
    contactInfo,
    personalSummary,
    experiences,
    secondEdu,
    skills,
    languages,
    references,
    tertEdus,
    interests,
    attributes,
    employHistorys,
    assignedPhotoUrl,
  } = cvData;

  // Helper function to format date
  const formatDate = dateString => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return moment(date).format('MMM D, YYYY');
  };

  // Helper function to render proficiency dots
  const renderProficiency = level => {
    const maxLevel = 5;
    const filledDots = Math.min(level, maxLevel);
    const emptyDots = maxLevel - filledDots;

    return (
      <div className="template06-skill-level">
        {[...Array(filledDots)].map((_, i) => (
          <div key={`filled-${i}`} className="template06-skill-dot filled" />
        ))}
        {[...Array(emptyDots)].map((_, i) => (
          <div key={`empty-${i}`} className="template06-skill-dot" />
        ))}
      </div>
    );
  };

  // Helper function to render subjects array
  const renderSubjects = subjects => {
    if (!subjects || subjects.length === 0) return null;
    return subjects.map((subject, index) => (
      <span key={subject._id || index} className="template06-subject-tag">
        {subject.subject}
      </span>
    ));
  };

  return (
    <div className="template06-newspaper">
      {/* Newspaper Header */}
      <header className="template06-header">
        <div className="template06-masthead">
          <h1 className="template06-newspaper-title">THE CURRICULUM VITAE</h1>
          <div className="template06-date-line">
            <span className="template06-date">
              {moment().format('MMMM D, YYYY')}
            </span>
            <span className="template06-volume">Vol. 1, No. 1</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="template06-main">
        {/* Front Page Headlines */}
        <section className="template06-front-page">
          <div className="template06-headline-section">
            <h2 className="template06-main-headline">
              {personalInfo?.fullName || 'PROFESSIONAL PROFILE'}
            </h2>
            <div className="template06-subheadline">
              {personalSummary?.content ||
                'Experienced Professional Seeking New Opportunities'}
            </div>
          </div>

          {/* Photo Section */}
          {assignedPhotoUrl && (
            <div className="template06-photo-section">
              <img
                src={assignedPhotoUrl}
                alt="Profile"
                className="template06-profile-photo"
              />
              <div className="template06-photo-caption">
                Professional Headshot
              </div>
            </div>
          )}
        </section>

        {/* Contact Information */}
        <section className="template06-contact-section">
          <h3 className="template06-section-headline">CONTACT INFORMATION</h3>
          <div className="template06-contact-grid">
            {contactInfo?.email && (
              <div className="template06-contact-item">
                <strong>Email:</strong> {contactInfo.email}
              </div>
            )}
            {contactInfo?.phone && (
              <div className="template06-contact-item">
                <strong>Phone:</strong> {contactInfo.phone}
              </div>
            )}
            {(contactInfo?.address || contactInfo?.city) && (
              <div className="template06-contact-item">
                <strong>Location:</strong>{' '}
                {[
                  contactInfo.address,
                  contactInfo.complex,
                  contactInfo.unit,
                  contactInfo.suburb,
                  contactInfo.city,
                  contactInfo.province,
                  contactInfo.postalCode,
                  contactInfo.country,
                ]
                  .filter(Boolean)
                  .join(', ')}
              </div>
            )}
          </div>
        </section>

        {/* Personal Information */}
        {personalInfo && (
          <section className="template06-section">
            <h3 className="template06-section-headline">PERSONAL DETAILS</h3>
            <div className="template06-personal-grid">
              {personalInfo.dateOfBirth && (
                <div className="template06-personal-item">
                  <strong>Date of Birth:</strong>{' '}
                  {formatDate(personalInfo.dateOfBirth)}
                </div>
              )}
              {personalInfo.gender && (
                <div className="template06-personal-item">
                  <strong>Gender:</strong> {personalInfo.gender}
                </div>
              )}
              {personalInfo.nationality && (
                <div className="template06-personal-item">
                  <strong>Nationality:</strong> {personalInfo.nationality}
                </div>
              )}
              {personalInfo.driversLicense && (
                <div className="template06-personal-item">
                  <strong>Driver's License:</strong>{' '}
                  {personalInfo.licenseCode || 'Valid'}
                </div>
              )}
              {personalInfo.idNumber && (
                <div className="template06-personal-item">
                  <strong>ID Number:</strong> {personalInfo.idNumber}
                </div>
              )}
              {personalInfo.ppNumber && (
                <div className="template06-personal-item">
                  <strong>Passport Number:</strong> {personalInfo.ppNumber}
                </div>
              )}
              {personalInfo.saCitizen && (
                <div className="template06-personal-item">
                  <strong>SA Citizen:</strong> Yes
                </div>
              )}
            </div>
          </section>
        )}

        {/* Main Content - Single Column */}
        <div className="template06-main-content">
          {/* Employment History */}
          {employHistorys && employHistorys.length > 0 && (
            <section className="template06-section">
              <h3 className="template06-section-headline">
                EMPLOYMENT HISTORY
              </h3>
              <div className="template06-employment-list">
                {employHistorys.map((job, index) => (
                  <article
                    key={job._id || index}
                    className="template06-employment-item"
                  >
                    <div className="template06-employment-header">
                      <h4 className="template06-employment-title">
                        {job.position}
                      </h4>
                      <div className="template06-employment-company">
                        {job.company}
                      </div>
                      <div className="template06-employment-dates">
                        {formatDate(job.startDate)} -{' '}
                        {job.endDate ? formatDate(job.endDate) : 'Present'}
                      </div>
                    </div>
                    {job.description && (
                      <div className="template06-employment-description">
                        {job.description}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* Experience */}
          {experiences && experiences.length > 0 && (
            <section className="template06-section">
              <h3 className="template06-section-headline">EXPERIENCE</h3>
              <div className="template06-employment-list">
                {experiences.map((experience, index) => (
                  <article
                    key={experience._id || index}
                    className="template06-employment-item"
                  >
                    <div className="template06-employment-header">
                      <h4 className="template06-employment-title">
                        {experience.title}
                      </h4>
                      {experience.company && (
                        <div className="template06-employment-company">
                          {experience.company}
                        </div>
                      )}
                      {experience.startDate && (
                        <div className="template06-employment-dates">
                          {formatDate(experience.startDate)} -{' '}
                          {experience.endDate
                            ? formatDate(experience.endDate)
                            : 'Present'}
                        </div>
                      )}
                    </div>
                    {experience.description && (
                      <div className="template06-employment-description">
                        {experience.description}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Education Section */}
        {((tertEdus && tertEdus.length > 0) ||
          (secondEdu && secondEdu.length > 0)) && (
          <section className="template06-section">
            <div className="template06-section-header">
              <h3 className="template06-section-headline">EDUCATION</h3>
            </div>
            <div className="template06-section-content">
              {/* Tertiary Education */}
              {tertEdus &&
                tertEdus.map((education, index) => (
                  <article key={index} className="template06-item">
                    <div className="template06-item-header">
                      <h4 className="template06-item-title">
                        {education.certificationType} - {education.instituteName}
                      </h4>
                      <div className="template06-item-date">
                        {formatDate(education.startDate)} -{' '}
                        {education.endDate
                          ? formatDate(education.endDate)
                          : 'Present'}
                      </div>
                    </div>
                    {education.description && (
                      <div className="template06-item-subtitle">
                        {education.description}
                      </div>
                    )}
                    {education.additionalInfo && (
                      <div className="template06-item-description">
                        {education.additionalInfo}
                      </div>
                    )}
                  </article>
                ))}

              {/* Secondary Education */}
              {secondEdu &&
                secondEdu.map((education, index) => (
                  <article key={index} className="template06-item">
                    <div className="template06-item-header">
                      <h4 className="template06-item-title">
                        {education.schoolName}
                      </h4>
                      <div className="template06-item-date">
                        {formatDate(education.startDate)} -{' '}
                        {education.endDate
                          ? formatDate(education.endDate)
                          : 'Present'}
                      </div>
                    </div>
                    {education.subjects && education.subjects.length > 0 && (
                      <div className="template06-item-description">
                        Subjects: {renderSubjects(education.subjects)}
                      </div>
                    )}
                    {education.additionalInfo && (
                      <div className="template06-item-description">
                        {education.additionalInfo}
                      </div>
                    )}
                  </article>
                ))}
            </div>
          </section>
        )}

        {/* Skills, Languages, Interests & Attributes - Combined Section */}
        {(skills?.length > 0 ||
          languages?.length > 0 ||
          interests?.length > 0 ||
          attributes?.length > 0) && (
          <section className="template06-section">
            <div className="template06-section-header">
              <h3 className="template06-section-headline">
                SKILLS, LANGUAGES, INTERESTS & ATTRIBUTES
              </h3>
            </div>
            <div className="template06-section-content">
              <div className="template06-two-column-container">
                {/* Left Column: Skills & Languages */}
                <div className="template06-left-sub-column">
                  {/* Skills */}
                  {skills && skills.length > 0 && (
                    <div className="template06-sub-section">
                      <h4 className="template06-sub-section-title">Skills</h4>
                      <div className="template06-skills">
                        {skills.map((skill, index) => (
                          <div
                            key={skill._id || index}
                            className="template06-skill-item"
                          >
                            <div className="template06-skill-name">
                              {skill.skill}
                            </div>
                            {renderProficiency(skill.proficiency)}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Languages */}
                  {languages && languages.length > 0 && (
                    <div className="template06-sub-section">
                      <h4 className="template06-sub-section-title">
                        Languages
                      </h4>
                      <div className="template06-languages">
                        {languages.map((language, index) => (
                          <div
                            key={language._id || index}
                            className="template06-language-item"
                          >
                            <div className="template06-language-name">
                              {language.language}
                            </div>
                            <div className="template06-language-proficiency">
                              Read: {language.read}/5 | Write:{' '}
                              {language.write}/5 | Speak: {language.speak}/5
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column: Interests & Attributes */}
                <div className="template06-right-sub-column">
                  {/* Interests */}
                  {interests && interests.length > 0 && (
                    <div className="template06-sub-section">
                      <h4 className="template06-sub-section-title">
                        Interests
                      </h4>
                      <div className="template06-interests">
                        {interests.map((interest, index) => (
                          <span
                            key={interest._id || index}
                            className="template06-interest-tag"
                          >
                            {interest.interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Attributes */}
                  {attributes && attributes.length > 0 && (
                    <div className="template06-sub-section">
                      <h4 className="template06-sub-section-title">
                        Attributes
                      </h4>
                      <div className="template06-attributes">
                        {attributes.map((attribute, index) => (
                          <span
                            key={attribute._id || index}
                            className="template06-attribute-tag"
                          >
                            {attribute.attribute}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* References Section */}
        {references && references.length > 0 && (
          <section className="template06-section">
            <div className="template06-section-header">
              <h3 className="template06-section-headline">REFERENCES</h3>
            </div>
            <div className="template06-section-content">
              {references.map((reference, index) => (
                <article key={reference._id || index} className="template06-item">
                  <h4 className="template06-item-title">{reference.name}</h4>
                  {reference.position && (
                    <div className="template06-item-subtitle">
                      {reference.position}
                    </div>
                  )}
                  {reference.company && (
                    <div className="template06-item-subtitle">
                      {reference.company}
                    </div>
                  )}
                  {(reference.email || reference.phone) && (
                    <div className="template06-reference-contact">
                      {reference.email && (
                        <div className="template06-item-description">
                          Email: {reference.email}
                        </div>
                      )}
                      {reference.phone && (
                        <div className="template06-item-description">
                          Phone: {reference.phone}
                        </div>
                      )}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Newspaper Footer */}
      <footer className="template06-footer">
        <div className="template06-footer-text">
          <span>THE CURRICULUM VITAE</span>
          <span>Professional Profile</span>
          <span>{moment().format('YYYY')}</span>
        </div>
      </footer>
    </div>
  );
};

export default Template06;
