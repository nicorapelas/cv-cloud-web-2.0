import React from 'react';
import './template10.css';

const Template10 = ({ cvData }) => {
  const {
    assignedPhotoUrl,
    assignedPhotoUrlSample,
    contactInfo,
    contactInfoSample,
    personalInfo,
    personalInfoSample,
    languages,
    languageSample,
    attributes,
    attributeSample,
    interests,
    interestSample,
    skills,
    skillSample,
    references,
    referenceSample,
    viewHeading,
    viewHeadingSample,
    personalSummary,
    personalSummarySample,
    employHistorys,
    employHistorySample,
    experiences,
    experienceSample,
    secondEdu,
    secondEduSample,
    tertEdus,
    tertEduSample,
  } = cvData;

  // Use sample data if available, otherwise use real data
  const data = {
    assignedPhotoUrl: assignedPhotoUrlSample || assignedPhotoUrl,
    contactInfo:
      contactInfoSample?.[0] ||
      (Array.isArray(contactInfo) ? contactInfo[0] : contactInfo),
    personalInfo:
      personalInfoSample?.[0] ||
      (Array.isArray(personalInfo) ? personalInfo[0] : personalInfo),
    languages: languageSample || languages,
    attributes: attributeSample || attributes,
    interests: interestSample || interests,
    skills: skillSample || skills,
    references: referenceSample || references,
    personalSummary:
      personalSummarySample?.[0] ||
      (Array.isArray(personalSummary) ? personalSummary[0] : personalSummary),
    employHistorys: employHistorySample || employHistorys,
    experiences: experienceSample || experiences,
    secondEdu: secondEduSample || secondEdu,
    tertEdus: tertEduSample || tertEdus,
  };

  // Helper function to format date
  const formatDate = dateString => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="template10-agriculture">
      <div className="template10-container">
        {/* Farming Header */}
        <div className="template10-header">
          <div className="template10-header-content">
            <div className="template10-logo-section">
              <div className="template10-logo">
                <div className="template10-tractor-icon">🚜</div>
              </div>
            </div>
            <div className="template10-title-section">
              <h1 className="template10-name">
                {data.personalInfo?.fullName || 'AGRICULTURAL PROFESSIONAL'}
              </h1>
              <h2 className="template10-title">
                {data.personalSummary?.content?.split('.')[0] ||
                  'Farming & Agriculture Specialist'}
              </h2>
              <div className="template10-header-divider"></div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="template10-contact-section">
          <div className="template10-contact-grid">
            {data.contactInfo?.email && (
              <div className="template10-contact-item">
                <div className="template10-contact-icon">📧</div>
                <div className="template10-contact-details">
                  <div className="template10-contact-label">Email</div>
                  <div className="template10-contact-value">
                    {data.contactInfo.email}
                  </div>
                </div>
              </div>
            )}
            {data.contactInfo?.phone && (
              <div className="template10-contact-item">
                <div className="template10-contact-icon">📞</div>
                <div className="template10-contact-details">
                  <div className="template10-contact-label">Phone</div>
                  <div className="template10-contact-value">
                    {data.contactInfo.phone}
                  </div>
                </div>
              </div>
            )}
            {(data.contactInfo?.address || data.contactInfo?.complex || data.contactInfo?.unit) && (
              <div className="template10-contact-item">
                <div className="template10-contact-icon">🏠</div>
                <div className="template10-contact-details">
                  <div className="template10-contact-label">Address</div>
                  <div className="template10-contact-value">
                    {data.contactInfo?.unit && `${data.contactInfo.unit} `}
                    {data.contactInfo?.complex && `${data.contactInfo.complex} `}
                    {data.contactInfo?.address}
                  </div>
                </div>
              </div>
            )}
            {(data.contactInfo?.suburb || data.contactInfo?.city) && (
              <div className="template10-contact-item">
                <div className="template10-contact-icon">📍</div>
                <div className="template10-contact-details">
                  <div className="template10-contact-label">Location</div>
                  <div className="template10-contact-value">
                    {data.contactInfo?.suburb && `${data.contactInfo.suburb}, `}
                    {data.contactInfo?.city}
                  </div>
                </div>
              </div>
            )}
            {(data.contactInfo?.province || data.contactInfo?.postalCode) && (
              <div className="template10-contact-item">
                <div className="template10-contact-icon">🗺️</div>
                <div className="template10-contact-details">
                  <div className="template10-contact-label">Region</div>
                  <div className="template10-contact-value">
                    {data.contactInfo?.province}
                    {data.contactInfo?.postalCode &&
                      ` ${data.contactInfo.postalCode}`}
                  </div>
                </div>
              </div>
            )}
            {data.contactInfo?.country && (
              <div className="template10-contact-item">
                <div className="template10-contact-icon">🌍</div>
                <div className="template10-contact-details">
                  <div className="template10-contact-label">Country</div>
                  <div className="template10-contact-value">
                    {data.contactInfo.country}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Photo Section */}
        {data.assignedPhotoUrl && (
          <div className="template10-photo-section">
            <img
              src={data.assignedPhotoUrl}
              alt="Profile"
              className="template10-profile-photo"
            />
          </div>
        )}

        {/* Two Column Layout */}
        <div className="template10-columns">
          {/* Left Column */}
          <div className="template10-left-column">
            {/* Employment History */}
            {data.employHistorys && data.employHistorys.length > 0 && (
              <div className="template10-section">
                <div className="template10-section-header">
                  <div className="template10-section-icon">💼</div>
                  <h3 className="template10-section-title">
                    EMPLOYMENT HISTORY
                  </h3>
                </div>
                <div className="template10-section-content">
                  {data.employHistorys.map((job, index) => (
                    <div
                      key={job._id || index}
                      className="template10-experience-item"
                    >
                      <div className="template10-experience-header">
                        <h4 className="template10-experience-name">
                          {job.position}
                        </h4>
                        <div className="template10-experience-company">
                          {job.company}
                        </div>
                        <div className="template10-experience-dates">
                          {job.startDate} -{' '}
                          {job.current ? 'Present' : job.endDate}
                        </div>
                      </div>
                      {job.description && (
                        <p className="template10-experience-description">
                          {job.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Work Experience */}
            {data.experiences && data.experiences.length > 0 && (
              <div className="template10-section">
                <div className="template10-section-header">
                  <div className="template10-section-icon">🚜</div>
                  <h3 className="template10-section-title">
                    AGRICULTURAL EXPERIENCE
                  </h3>
                </div>
                <div className="template10-section-content">
                  {data.experiences.map((experience, index) => (
                    <div
                      key={experience._id || index}
                      className="template10-experience-item"
                    >
                      <div className="template10-experience-header">
                        <h4 className="template10-experience-name">
                          {experience.title}
                        </h4>
                        {experience.company && (
                          <div className="template10-experience-company">
                            {experience.company}
                          </div>
                        )}
                        {(experience.startDate || experience.endDate) && (
                          <div className="template10-experience-dates">
                            {formatDate(experience.startDate)} -{' '}
                            {formatDate(experience.endDate) || 'Present'}
                          </div>
                        )}
                      </div>
                      {experience.description && (
                        <p className="template10-experience-description">
                          {experience.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {(data.tertEdus && data.tertEdus.length > 0) ||
            (data.secondEdu && data.secondEdu.length > 0) ? (
              <div className="template10-section">
                <div className="template10-section-header">
                  <div className="template10-section-icon">🎓</div>
                  <h3 className="template10-section-title">
                    EDUCATION & TRAINING
                  </h3>
                </div>
                <div className="template10-section-content">
                  {/* Tertiary Education */}
                  {data.tertEdus &&
                    data.tertEdus.map((education, index) => (
                      <div
                        key={education._id || index}
                        className="template10-education-item"
                      >
                        <h4 className="template10-education-name">
                          {education.certificationType ||
                            'Agricultural Education'}
                        </h4>
                        <div className="template10-education-institution">
                          {education.instituteName}
                        </div>
                        {education.description && (
                          <p className="template10-education-description">
                            {education.description}
                          </p>
                        )}
                        {education.additionalInfo && (
                          <p className="template10-education-additional">
                            {education.additionalInfo}
                          </p>
                        )}
                      </div>
                    ))}

                  {/* Secondary Education */}
                  {data.secondEdu &&
                    data.secondEdu.map((education, index) => (
                      <div
                        key={education._id || index}
                        className="template10-education-item"
                      >
                        <h4 className="template10-education-name">
                          Secondary Education
                        </h4>
                        <div className="template10-education-institution">
                          {education.schoolName}
                        </div>
                        {education.additionalInfo && (
                          <p className="template10-education-additional">
                            {education.additionalInfo}
                          </p>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            ) : null}

            {/* References */}
            {data.references && data.references.length > 0 && (
              <div className="template10-section">
                <div className="template10-section-header">
                  <div className="template10-section-icon">🤝</div>
                  <h3 className="template10-section-title">REFERENCES</h3>
                </div>
                <div className="template10-section-content">
                  {data.references.map((reference, index) => (
                    <div
                      key={reference._id || index}
                      className="template10-reference-item"
                    >
                      <h4 className="template10-reference-name">
                        {reference.name}
                      </h4>
                      {reference.company && (
                        <div className="template10-reference-position">
                          {reference.company}
                        </div>
                      )}
                      {reference.email && (
                        <div className="template10-reference-contact">
                          📧 {reference.email}
                        </div>
                      )}
                      {reference.phone && (
                        <div className="template10-reference-contact">
                          📞 {reference.phone}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="template10-right-column">
            {/* Personal Information */}
            {data.personalInfo && (
              <div className="template10-section">
                <div className="template10-section-header">
                  <div className="template10-section-icon">👤</div>
                  <h3 className="template10-section-title">
                    PERSONAL INFORMATION
                  </h3>
                </div>
                <div className="template10-section-content">
                  {data.personalInfo.dateOfBirth && (
                    <div className="template10-info-item">
                      <strong>Date of Birth:</strong>{' '}
                      {formatDate(data.personalInfo.dateOfBirth)}
                    </div>
                  )}
                  {data.personalInfo.idNumber && (
                    <div className="template10-info-item">
                      <strong>ID Number:</strong> {data.personalInfo.idNumber}
                    </div>
                  )}
                  {data.personalInfo.gender && (
                    <div className="template10-info-item">
                      <strong>Gender:</strong>{' '}
                      {data.personalInfo.gender.charAt(0).toUpperCase() +
                        data.personalInfo.gender.slice(1)}
                    </div>
                  )}
                  {data.personalInfo.nationality && (
                    <div className="template10-info-item">
                      <strong>Nationality:</strong>{' '}
                      {data.personalInfo.nationality}
                    </div>
                  )}
                  {data.personalInfo.saCitizen && (
                    <div className="template10-info-item">
                      <strong>SA Citizen:</strong> Yes
                    </div>
                  )}
                  {data.personalInfo.ppNumber && (
                    <div className="template10-info-item">
                      <strong>Passport Number:</strong> {data.personalInfo.ppNumber}
                    </div>
                  )}
                  {data.personalInfo.driversLicense !== undefined && (
                    <div className="template10-info-item">
                      <strong>Driver's License:</strong>{' '}
                      {data.personalInfo.driversLicense ? 'Yes' : 'No'}
                      {data.personalInfo.licenseCode &&
                        ` (${data.personalInfo.licenseCode})`}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Skills */}
            {data.skills && data.skills.length > 0 && (
              <div className="template10-section">
                <div className="template10-section-header">
                  <div className="template10-section-icon">⚙️</div>
                  <h3 className="template10-section-title">
                    AGRICULTURAL SKILLS
                  </h3>
                </div>
                <div className="template10-section-content">
                  {data.skills.map((skill, index) => (
                    <div
                      key={skill._id || index}
                      className="template10-skill-item"
                    >
                      <div className="template10-skill-name">{skill.skill}</div>
                      <div className="template10-skill-level">
                        <div className="template10-skill-bar">
                          <div
                            className="template10-skill-progress"
                            style={{
                              width: `${(skill.proficiency / 5) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <span className="template10-skill-rating">
                          {skill.proficiency}/5
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {data.languages && data.languages.length > 0 && (
              <div className="template10-section">
                <div className="template10-section-header">
                  <div className="template10-section-icon">🌐</div>
                  <h3 className="template10-section-title">LANGUAGES</h3>
                </div>
                <div className="template10-section-content">
                  {data.languages.map((language, index) => (
                    <div
                      key={language._id || index}
                      className="template10-language-item"
                    >
                      <div className="template10-language-name">
                        {language.language}
                      </div>
                      <div className="template10-language-skills">
                        {language.read && (
                          <div className="template10-language-skill">
                            Read: {language.read}/5
                          </div>
                        )}
                        {language.write && (
                          <div className="template10-language-skill">
                            Write: {language.write}/5
                          </div>
                        )}
                        {language.speak && (
                          <div className="template10-language-skill">
                            Speak: {language.speak}/5
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Attributes */}
            {data.attributes && data.attributes.length > 0 && (
              <div className="template10-section">
                <div className="template10-section-header">
                  <div className="template10-section-icon">💪</div>
                  <h3 className="template10-section-title">
                    PERSONAL ATTRIBUTES
                  </h3>
                </div>
                <div className="template10-section-content">
                  <div className="template10-attributes-grid">
                    {data.attributes.map((attribute, index) => (
                      <div
                        key={attribute._id || index}
                        className="template10-attribute-tag"
                      >
                        {attribute.attribute}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Interests */}
            {data.interests && data.interests.length > 0 && (
              <div className="template10-section">
                <div className="template10-section-header">
                  <div className="template10-section-icon">🌾</div>
                  <h3 className="template10-section-title">INTERESTS</h3>
                </div>
                <div className="template10-section-content">
                  <div className="template10-interests-grid">
                    {data.interests.map((interest, index) => (
                      <div
                        key={interest._id || index}
                        className="template10-interest-tag"
                      >
                        {interest.interest}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="template10-footer">
          <div className="template10-footer-content">
            <div className="template10-footer-icon">🌱</div>
            <p className="template10-footer-text">
              Cultivating Excellence in Agriculture
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Template10;
