import React from 'react';
import moment from 'moment';
import './template09.css';

const Template09 = ({ cvData }) => {
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
    return moment(date).format('MMM YYYY');
  };

  // Helper function to render proficiency bars
  const renderProficiency = level => {
    const percentage = Math.min((level / 5) * 100, 100);
    return (
      <div className="template09-proficiency-container">
        <div className="template09-proficiency-bar">
          <div
            className="template09-proficiency-fill"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="template09-proficiency-text">{level}/5</span>
      </div>
    );
  };

  // Helper function to render subjects array
  const renderSubjects = subjects => {
    if (!subjects || subjects.length === 0) return null;
    return subjects.map((subject, index) => (
      <span key={subject._id || index} className="template09-subject-tag">
        {subject.subject}
      </span>
    ));
  };

  return (
    <div className="template09-industrial">
      {/* Industrial Header */}
      <header className="template09-header">
        <div className="template09-header-content">
          <div className="template09-logo-section">
            <div className="template09-logo">
              <div className="template09-logo-text">⚙️</div>
            </div>
          </div>
          <div className="template09-title-section">
            <h1 className="template09-name">
              {personalInfo?.fullName || 'PROFESSIONAL PROFILE'}
            </h1>
            <div className="template09-title">
              {personalSummary?.content ||
                'Industrial Professional'}
            </div>
            <div className="template09-header-divider"></div>
          </div>
        </div>
      </header>

      {/* Contact Information */}
      <section className="template09-contact-section">
        <div className="template09-contact-grid">
          {contactInfo?.email && (
            <div className="template09-contact-item">
              <div className="template09-contact-icon">📧</div>
              <div className="template09-contact-details">
                <span className="template09-contact-label">Email</span>
                <span className="template09-contact-value">
                  {contactInfo.email}
                </span>
              </div>
            </div>
          )}
          {contactInfo?.phone && (
            <div className="template09-contact-item">
              <div className="template09-contact-icon">📞</div>
              <div className="template09-contact-details">
                <span className="template09-contact-label">Phone</span>
                <span className="template09-contact-value">
                  {contactInfo.phone}
                </span>
              </div>
            </div>
          )}
          {(contactInfo?.address || contactInfo?.city) && (
            <div className="template09-contact-item">
              <div className="template09-contact-icon">📍</div>
              <div className="template09-contact-details">
                <span className="template09-contact-label">Location</span>
                <span className="template09-contact-value">
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
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Photo Section */}
      {assignedPhotoUrl && (
        <section className="template09-photo-section">
          <img
            src={assignedPhotoUrl}
            alt="Profile"
            className="template09-profile-photo"
          />
        </section>
      )}

      {/* Main Content */}
      <main className="template09-main">
        {/* Personal Information */}
        {personalInfo && (
          <section className="template09-section">
            <div className="template09-section-header">
              <div className="template09-section-icon">👤</div>
              <h2 className="template09-section-title">
                PERSONAL INFORMATION
              </h2>
            </div>
            <div className="template09-section-content">
              <div className="template09-personal-grid">
                {personalInfo.dateOfBirth && (
                  <div className="template09-personal-item">
                    <span className="template09-personal-label">
                      Date of Birth:{' '}
                    </span>
                    <span className="template09-personal-value">
                      {moment(personalInfo.dateOfBirth).format('MMMM D, YYYY')}
                    </span>
                  </div>
                )}
                {personalInfo.gender && (
                  <div className="template09-personal-item">
                    <span className="template09-personal-label">Gender:</span>
                    <span className="template09-personal-value">
                      {personalInfo.gender}
                    </span>
                  </div>
                )}
                {personalInfo.nationality && (
                  <div className="template09-personal-item">
                    <span className="template09-personal-label">
                      Nationality:
                    </span>
                    <span className="template09-personal-value">
                      {personalInfo.nationality}
                    </span>
                  </div>
                )}
                {personalInfo.driversLicense && (
                  <div className="template09-personal-item">
                    <span className="template09-personal-label">
                      Driver's License:
                    </span>
                    <span className="template09-personal-value">
                      {personalInfo.licenseCode || 'Yes'}
                    </span>
                  </div>
                )}
                {personalInfo.idNumber && (
                  <div className="template09-personal-item">
                    <span className="template09-personal-label">
                      ID Number:{' '}
                    </span>
                    <span className="template09-personal-value">
                      {personalInfo.idNumber}
                    </span>
                  </div>
                )}
                {personalInfo.ppNumber && (
                  <div className="template09-personal-item">
                    <span className="template09-personal-label">
                      Passport Number:{' '}
                    </span>
                    <span className="template09-personal-value">
                      {personalInfo.ppNumber}
                    </span>
                  </div>
                )}
                {personalInfo.saCitizen && (
                  <div className="template09-personal-item">
                    <span className="template09-personal-label">
                      SA Citizen:{' '}
                    </span>
                    <span className="template09-personal-value">
                      Yes
                    </span>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Employment History */}
        {employHistorys && employHistorys.length > 0 && (
          <section className="template09-section">
            <div className="template09-section-header">
              <div className="template09-section-icon">🔧</div>
              <h2 className="template09-section-title">
                EMPLOYMENT HISTORY
              </h2>
            </div>
            <div className="template09-section-content">
              {employHistorys.map((employment, index) => (
                <div
                  key={employment._id || index}
                  className="template09-experience-item"
                >
                  <div className="template09-experience-header">
                    <h3 className="template09-experience-name">
                      {employment.position || employment.jobTitle}
                    </h3>
                    {employment.startDate && (
                      <div className="template09-experience-date">
                        {formatDate(employment.startDate)} -{' '}
                        {employment.endDate
                          ? formatDate(employment.endDate)
                          : 'Present'}
                      </div>
                    )}
                    {employment.company && (
                      <div className="template09-experience-company">
                        {employment.company || employment.companyName}
                      </div>
                    )}
                  </div>
                  {employment.description && (
                    <div className="template09-experience-description">
                      {employment.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience */}
        {experiences && experiences.length > 0 && (
          <section className="template09-section">
            <div className="template09-section-header">
              <div className="template09-section-icon">⚙️</div>
              <h2 className="template09-section-title">EXPERIENCE</h2>
            </div>
            <div className="template09-section-content">
              {experiences.map((experience, index) => (
                <div
                  key={experience._id || index}
                  className="template09-experience-item"
                >
                  <div className="template09-experience-header">
                    <h3 className="template09-experience-name">
                      {experience.title}
                    </h3>
                    {experience.startDate && (
                      <div className="template09-experience-date">
                        {formatDate(experience.startDate)} -{' '}
                        {experience.endDate
                          ? formatDate(experience.endDate)
                          : 'Present'}
                      </div>
                    )}
                    {experience.company && (
                      <div className="template09-experience-company">
                        {experience.company}
                      </div>
                    )}
                  </div>
                  {experience.description && (
                    <div className="template09-experience-description">
                      {experience.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {((tertEdus && tertEdus.length > 0) ||
          (secondEdu && secondEdu.length > 0)) && (
          <section className="template09-section">
            <div className="template09-section-header">
              <div className="template09-section-icon">🎓</div>
              <h2 className="template09-section-title">EDUCATION</h2>
            </div>
            <div className="template09-section-content">
              {/* Tertiary Education */}
              {tertEdus &&
                tertEdus.map((education, index) => (
                  <div
                    key={education._id || index}
                    className="template09-education-item"
                  >
                    <h3 className="template09-education-name">
                      {education.certificationType || 'Tertiary Education'}
                    </h3>
                    <div className="template09-education-institution">
                      {education.instituteName}
                    </div>
                    {education.description && (
                      <div className="template09-education-description">
                        {education.description}
                      </div>
                    )}
                    {education.additionalInfo && (
                      <div className="template09-education-additional">
                        {education.additionalInfo}
                      </div>
                    )}
                  </div>
                ))}

              {/* Secondary Education */}
              {secondEdu &&
                secondEdu.map((education, index) => (
                  <div
                    key={education._id || index}
                    className="template09-education-item"
                  >
                    <h3 className="template09-education-name">
                      Secondary Education
                    </h3>
                    <div className="template09-education-institution">
                      {education.schoolName}
                    </div>
                    {education.subjects &&
                      education.subjects.length > 0 && (
                        <div className="template09-education-subjects">
                          <span className="template09-education-subjects-label">
                            Subjects:
                          </span>
                          <div className="template09-subjects-container">
                            {renderSubjects(education.subjects)}
                          </div>
                        </div>
                      )}
                    {education.additionalInfo && (
                      <div className="template09-education-additional">
                        {education.additionalInfo}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* Skills, Languages, Interests & Attributes */}
        {(skills?.length > 0 ||
          languages?.length > 0 ||
          interests?.length > 0 ||
          attributes?.length > 0) && (
          <section className="template09-section">
            <div className="template09-section-header">
              <div className="template09-section-icon">⚙️</div>
              <h2 className="template09-section-title">
                SKILLS, LANGUAGES, INTERESTS & ATTRIBUTES
              </h2>
            </div>
            <div className="template09-section-content">
              <div className="template09-two-column-container">
                {/* Left Column: Skills & Languages */}
                <div className="template09-left-sub-column">
                  {/* Skills */}
                  {skills && skills.length > 0 && (
                    <div className="template09-sub-section">
                      <h3 className="template09-sub-section-title">Skills</h3>
                      <div className="template09-skills-list">
                        {skills.map((skill, index) => (
                          <div
                            key={skill._id || index}
                            className="template09-skill-item"
                          >
                            <div className="template09-skill-header">
                              <span className="template09-skill-name">
                                {skill.skill}
                              </span>
                              <span className="template09-skill-level">
                                {skill.proficiency || 0}/5
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Languages */}
                  {languages && languages.length > 0 && (
                    <div className="template09-sub-section">
                      <h3 className="template09-sub-section-title">
                        Languages
                      </h3>
                      <div className="template09-languages-list">
                        {languages.map((language, index) => (
                          <div
                            key={language._id || index}
                            className="template09-language-item"
                          >
                            <div className="template09-language-header">
                              <span className="template09-language-name">
                                {language.language}
                              </span>
                              <span className="template09-language-proficiency">
                                Read: {language.read}/5 | Write:{' '}
                                {language.write}/5 | Speak: {language.speak}/5
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column: Interests & Attributes */}
                <div className="template09-right-sub-column">
                  {/* Interests */}
                  {interests && interests.length > 0 && (
                    <div className="template09-sub-section">
                      <h3 className="template09-sub-section-title">
                        Interests
                      </h3>
                      <div className="template09-interests-grid">
                        {interests.map((interest, index) => (
                          <span
                            key={interest._id || index}
                            className="template09-interest-tag"
                          >
                            {interest.interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Attributes */}
                  {attributes && attributes.length > 0 && (
                    <div className="template09-sub-section">
                      <h3 className="template09-sub-section-title">
                        Attributes
                      </h3>
                      <div className="template09-attributes-grid">
                        {attributes.map((attribute, index) => (
                          <span
                            key={attribute._id || index}
                            className="template09-attribute-tag"
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

        {/* References */}
        {references && references.length > 0 && (
          <section className="template09-section">
            <div className="template09-section-header">
              <div className="template09-section-icon">📋</div>
              <h2 className="template09-section-title">REFERENCES</h2>
            </div>
            <div className="template09-section-content">
              <div className="template09-references-grid">
                {references.map((reference, index) => (
                  <div
                    key={reference._id || index}
                    className="template09-reference-item"
                  >
                    <div className="template09-reference-header">
                      <h3 className="template09-reference-name">
                        {reference.name}
                      </h3>
                    </div>
                    <div className="template09-reference-details">
                      <p>
                        {reference.position && (
                          <strong>{reference.position}</strong>
                        )}
                        {reference.position && reference.company && ' at '}
                        {reference.company}
                      </p>
                      {reference.email && <p>Email: {reference.email}</p>}
                      {reference.phone && <p>Phone: {reference.phone}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Industrial Footer */}
      <footer className="template09-footer">
        <div className="template09-footer-text">
          Built for Industrial Excellence
        </div>
      </footer>
    </div>
  );
};

export default Template09;
