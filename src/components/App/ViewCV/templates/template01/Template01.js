import React from 'react';
import moment from 'moment';
import { getInitials, getAvatarStyle } from '../../../../../utils/avatarUtils';
import './template01.css';

const Template01 = ({ cvData }) => {
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
    
    // Handle different date formats more robustly
    let momentDate;
    try {
      // Check if it's a "Month YYYY" format first to avoid warnings
      if (
        typeof dateString === 'string' &&
        dateString.includes(' ') &&
        !dateString.includes('-') &&
        !dateString.includes('/')
      ) {
        momentDate = moment(dateString, 'MMMM YYYY');
      } else {
        // Try parsing with moment for other formats
        momentDate = moment(dateString);
      }

      // If moment can't parse it properly, try some common formats
      if (!momentDate.isValid()) {
        // Try ISO format
        momentDate = moment(dateString, moment.ISO_8601);

        // If still invalid, try other common formats
        if (!momentDate.isValid()) {
          momentDate = moment(dateString, [
            'YYYY-MM-DD',
            'MM/DD/YYYY',
            'DD/MM/YYYY',
          ]);
        }
      }

      // If still invalid, return the original string
      if (!momentDate.isValid()) {
        return dateString;
      }

      return momentDate.format('MMM YYYY');
    } catch (error) {
      // Silently fall back to original string if date formatting fails
      return dateString;
    }
  };

  // Helper function to render proficiency dots
  const renderProficiency = level => {
    const maxLevel = 5;
    const filledDots = Math.min(level, maxLevel);
    const emptyDots = maxLevel - filledDots;

    return (
      <div className="template01-skill-level">
        {[...Array(filledDots)].map((_, i) => (
          <div key={`filled-${i}`} className="template01-skill-dot filled" />
        ))}
        {[...Array(emptyDots)].map((_, i) => (
          <div key={`empty-${i}`} className="template01-skill-dot" />
        ))}
      </div>
    );
  };

  // Helper function to render subjects array
  const renderSubjects = subjects => {
    if (!subjects || !Array.isArray(subjects)) return '';
    return subjects.map(subject => subject.subject || subject).join(', ');
  };

  return (
    <div className="template01-wrapper">
      <div className="template01-container">
        {/* Header Section */}
        <header className="template01-header">
          <div className="template01-header-content">
            {assignedPhotoUrl && assignedPhotoUrl !== 'noneAssigned' ? (
              <img
                src={assignedPhotoUrl}
                alt="Profile"
                className="template01-photo"
              />
            ) : (
              <div
                className="template01-photo-avatar"
                style={getAvatarStyle(personalInfo?.fullName, 120)}
              >
                {getInitials(personalInfo?.fullName)}
              </div>
            )}

            <h1 className="template01-name">
              {personalInfo?.fullName || 'Your Name'}
            </h1>


            {contactInfo && (
              <div className="template01-contact-grid">
                {contactInfo.email && (
                  <div className="template01-contact-item">
                    <span className="template01-contact-icon">📧</span>
                    <span>{contactInfo.email}</span>
                  </div>
                )}
                {contactInfo.phone && (
                  <div className="template01-contact-item">
                    <span className="template01-contact-icon">📞</span>
                    <span>{contactInfo.phone}</span>
                  </div>
                )}
                {(contactInfo.address ||
                  contactInfo.suburb ||
                  contactInfo.city) && (
                  <div className="template01-contact-item">
                    <span className="template01-contact-icon">📍</span>
                    <span>
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
                )}
              </div>
            )}
          </div>
        </header>

        <div className="template01-content">
          {/* Personal Information */}
          {personalInfo && (
            <section className="template01-section">
              <div className="template01-section-header">
                <h2 className="template01-section-title">
                  <span className="template01-section-icon">👤</span>
                  Personal Information
                </h2>
              </div>
              <div className="template01-section-content">
                <div className="template01-personal-grid">
                  {personalInfo.dateOfBirth && (
                    <div className="template01-personal-item">
                      <span className="template01-personal-icon">📅</span>
                      <span className="template01-personal-label">
                        Date of Birth:
                      </span>
                      <span className="template01-personal-value">
                        {moment(personalInfo.dateOfBirth).format(
                          'MMMM D, YYYY'
                        )}
                      </span>
                    </div>
                  )}
                  {personalInfo.gender && (
                    <div className="template01-personal-item">
                      <span className="template01-personal-icon">👤</span>
                      <span className="template01-personal-label">Gender:</span>
                      <span className="template01-personal-value">
                        {personalInfo.gender}
                      </span>
                    </div>
                  )}
                  {personalInfo.nationality && (
                    <div className="template01-personal-item">
                      <span className="template01-personal-icon">🌍</span>
                      <span className="template01-personal-label">
                        Nationality:
                      </span>
                      <span className="template01-personal-value">
                        {personalInfo.nationality}
                      </span>
                    </div>
                  )}
                  {personalInfo.driversLicense && (
                    <div className="template01-personal-item">
                      <span className="template01-personal-icon">🚗</span>
                      <span className="template01-personal-label">
                        Driver's License:
                      </span>
                      <span className="template01-personal-value">
                        {personalInfo.licenseCode || 'Yes'}
                      </span>
                    </div>
                  )}
                  {personalInfo.idNumber && (
                    <div className="template01-personal-item">
                      <span className="template01-personal-icon">🆔</span>
                      <span className="template01-personal-label">
                        ID Number:
                      </span>
                      <span className="template01-personal-value">
                        {personalInfo.idNumber}
                      </span>
                    </div>
                  )}
                  {personalInfo.ppNumber && (
                    <div className="template01-personal-item">
                      <span className="template01-personal-icon">📘</span>
                      <span className="template01-personal-label">
                        Passport Number:
                      </span>
                      <span className="template01-personal-value">
                        {personalInfo.ppNumber}
                      </span>
                    </div>
                  )}
                  {personalInfo.saCitizen && (
                    <div className="template01-personal-item">
                      <span className="template01-personal-icon">🇿🇦</span>
                      <span className="template01-personal-label">
                        SA Citizen:
                      </span>
                      <span className="template01-personal-value">
                        Yes
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Personal Summary */}
          {personalSummary && (
            <section className="template01-section">
              <div className="template01-section-header">
                <h2 className="template01-section-title">
                  <span className="template01-section-icon">📝</span>
                  Professional Summary
                </h2>
              </div>
              <div className="template01-section-content">
                <p className="template01-item-description">
                  {personalSummary?.content}
                </p>
              </div>
            </section>
          )}

          {/* Employment History */}
          {employHistorys && employHistorys.length > 0 && (
            <section className="template01-section">
              <div className="template01-section-header">
                <h2 className="template01-section-title">
                  <span className="template01-section-icon">💼</span>
                  Employment History
                </h2>
              </div>
              <div className="template01-section-content">
                {employHistorys.map((history, index) => (
                  <div key={history._id || index} className="template01-item">
                    <div className="template01-item-header">
                      <h3 className="template01-item-title">
                        {history.position}
                      </h3>
                      <span className="template01-item-date">
                        {formatDate(history.startDate)} -{' '}
                        {history.endDate
                          ? formatDate(history.endDate)
                          : 'Present'}
                      </span>
                    </div>
                    <p className="template01-item-company">
                      {history.company}
                    </p>
                    {history.description && (
                      <p className="template01-item-description">
                        {history.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Experience */}
          {experiences && experiences.length > 0 && (
            <section className="template01-section">
              <div className="template01-section-header">
                <h2 className="template01-section-title">
                  <span className="template01-section-icon">🎯</span>
                  Experience
                </h2>
              </div>
              <div className="template01-section-content">
                {experiences.map((experience, index) => (
                  <div
                    key={experience._id || index}
                    className="template01-item"
                  >
                    <div className="template01-item-header">
                      <h3 className="template01-item-title">
                        {experience.title}
                      </h3>
                      <span className="template01-item-date">
                        {formatDate(experience.startDate)} -{' '}
                        {experience.endDate
                          ? formatDate(experience.endDate)
                          : 'Present'}
                      </span>
                    </div>
                    {experience.company && (
                      <p className="template01-item-company">
                        {experience.company}
                      </p>
                    )}
                    {experience.description && (
                      <p className="template01-item-description">
                        {experience.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {(secondEdu && secondEdu.length > 0) ||
          (tertEdus && tertEdus.length > 0) ? (
            <section className="template01-section">
              <div className="template01-section-header">
                <h2 className="template01-section-title">
                  <span className="template01-section-icon">🎓</span>
                  Education
                </h2>
              </div>
              <div className="template01-section-content">
                {/* Tertiary Education */}
                {tertEdus?.map((edu, index) => (
                  <div key={edu._id || index} className="template01-item">
                    <div className="template01-item-header">
                      <h3 className="template01-item-title">
                        {edu.certificationType || 'Tertiary Education'}
                      </h3>
                      <span className="template01-item-date">
                        {formatDate(edu.startDate)} -{' '}
                        {edu.endDate ? formatDate(edu.endDate) : 'Present'}
                      </span>
                    </div>
                    {edu.instituteName && (
                      <p className="template01-item-company">
                        {edu.instituteName}
                      </p>
                    )}
                    {edu.description && (
                      <p className="template01-item-description">
                        {edu.description}
                      </p>
                    )}
                    {edu.additionalInfo && (
                      <p className="template01-item-description">
                        {edu.additionalInfo}
                      </p>
                    )}
                  </div>
                ))}

                {/* Secondary Education */}
                {secondEdu?.map((edu, index) => (
                  <div key={edu._id || index} className="template01-item">
                    <div className="template01-item-header">
                      <h3 className="template01-item-title">
                        {edu.schoolName || 'Secondary Education'}
                      </h3>
                      <span className="template01-item-date">
                        {formatDate(edu.startDate)} -{' '}
                        {edu.endDate ? formatDate(edu.endDate) : 'Present'}
                      </span>
                    </div>
                    {edu.subjects && edu.subjects.length > 0 && (
                      <p className="template01-item-description">
                        Subjects: {renderSubjects(edu.subjects)}
                      </p>
                    )}
                    {edu.additionalInfo && (
                      <p className="template01-item-description">
                        {edu.additionalInfo}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {/* Skills, Languages, Interests & Attributes - Combined Section */}
          {(skills?.length > 0 ||
            languages?.length > 0 ||
            interests?.length > 0 ||
            attributes?.length > 0) && (
            <section className="template01-section">
              <div className="template01-section-header">
                <h2 className="template01-section-title">
                  <span className="template01-section-icon">🛠️</span>
                  Skills, Languages, Interests & Attributes
                </h2>
              </div>
              <div className="template01-section-content">
                <div className="template01-two-column-container">
                  {/* Left Column: Skills & Languages */}
                  <div className="template01-left-column">
                    {/* Skills */}
                    {skills && skills.length > 0 && (
                      <div className="template01-sub-section">
                        <h3 className="template01-sub-section-title">
                          <span className="template01-section-icon">🛠️</span>
                          Skills
                        </h3>
                        <div className="template01-skills-grid">
                          {skills.map((skill, index) => (
                            <div
                              key={skill._id || index}
                              className="template01-skill-item"
                            >
                              <span className="template01-skill-name">
                                {skill.skill}
                              </span>
                              {renderProficiency(skill.level || 3)}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Languages */}
                    {languages && languages.length > 0 && (
                      <div className="template01-sub-section">
                        <h3 className="template01-sub-section-title">
                          <span className="template01-section-icon">🌐</span>
                          Languages
                        </h3>
                        <div
                          className="template01-languages-container"
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            gap: '1rem',
                            width: '100%',
                          }}
                        >
                          {languages.map((language, index) => (
                            <div
                              key={language._id || index}
                              className="template01-language-item"
                              style={{
                                flex: '0 0 calc(50% - 0.5rem)',
                                width: 'calc(50% - 0.5rem)',
                                boxSizing: 'border-box',
                              }}
                            >
                              <h4 className="template01-language-name">
                                {language.language}
                              </h4>
                              <div className="template01-language-skills">
                                <div className="template01-language-skill-row">
                                  <span className="template01-language-skill-label">
                                    Read:
                                  </span>
                                  {renderProficiency(language.read || 0)}
                                </div>
                                <div className="template01-language-skill-row">
                                  <span className="template01-language-skill-label">
                                    Write:
                                  </span>
                                  {renderProficiency(language.write || 0)}
                                </div>
                                <div className="template01-language-skill-row">
                                  <span className="template01-language-skill-label">
                                    Speak:
                                  </span>
                                  {renderProficiency(language.speak || 0)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Interests & Attributes */}
                  <div className="template01-right-column">
                    {/* Interests */}
                    {interests && interests.length > 0 && (
                      <div className="template01-sub-section">
                        <h3 className="template01-sub-section-title">
                          <span className="template01-section-icon">🎨</span>
                          Interests
                        </h3>
                        <div className="template01-interests-column">
                          {interests.map((interest, index) => (
                            <p
                              key={interest._id || index}
                              className="template01-interest-item"
                            >
                              {interest.interest}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Attributes */}
                    {attributes && attributes.length > 0 && (
                      <div className="template01-sub-section">
                        <h3 className="template01-sub-section-title">
                          <span className="template01-section-icon">⭐</span>
                          Attributes
                        </h3>
                        <div className="template01-attributes-column">
                          {attributes.map((attribute, index) => (
                            <p
                              key={attribute._id || index}
                              className="template01-attribute-item"
                            >
                              {attribute.attribute}
                            </p>
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
            <section className="template01-section">
              <div className="template01-section-header">
                <h2 className="template01-section-title">
                  <span className="template01-section-icon">👥</span>
                  References
                </h2>
              </div>
              <div className="template01-section-content">
                <div className="template01-references-grid">
                  {references.map((reference, index) => (
                    <div
                      key={reference._id || index}
                      className="template01-reference-item"
                    >
                      <h4 className="template01-reference-name">
                        {reference.name}
                      </h4>
                      {reference.position && (
                        <p className="template01-reference-company">
                          {reference.position}
                        </p>
                      )}
                      {reference.company && (
                        <p className="template01-reference-company">
                          {reference.company}
                        </p>
                      )}
                      <div className="template01-reference-contact">
                        {reference.phone && (
                          <div className="template01-reference-contact-item">
                            <span>Phone: {reference.phone}</span>
                          </div>
                        )}
                        {reference.email && (
                          <div className="template01-reference-contact-item">
                            <span>Email: {reference.email}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default Template01;
