import React from 'react';
import './InkFriendlyTemplate.css';

const InkFriendlyTemplate = ({ cvData }) => {
  if (!cvData) return null;

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

  // Convert proficiency dots to numbers (1-5 scale)
  const getProficiencyNumber = proficiency => {
    if (!proficiency) return 'N/A';
    const num = parseInt(proficiency);
    if (isNaN(num)) return 'N/A';
    return `${num}/5`;
  };

  return (
    <div className="ink-friendly-template">
      {/* Header Section */}
      <div className="ink-header">
        <div className="ink-photo-section">
          {assignedPhotoUrl && (
            <img src={assignedPhotoUrl} alt="Profile" className="ink-photo" />
          )}
        </div>
        <div className="ink-name-section">
          <h1 className="ink-name">{personalInfo?.fullName}</h1>
          {personalInfo?.title && (
            <h2 className="ink-title">{personalInfo.title}</h2>
          )}
        </div>
      </div>

      {/* Contact Information */}
      {contactInfo && (
        <div className="ink-section">
          <h3 className="ink-section-title">Contact Information</h3>
          <div className="ink-contact-grid">
            {contactInfo.email && (
              <div className="ink-contact-item">
                <strong>Email:</strong> {contactInfo.email}
              </div>
            )}
            {contactInfo.phone && (
              <div className="ink-contact-item">
                <strong>Phone:</strong> {contactInfo.phone}
              </div>
            )}
            {contactInfo.address && (
              <div className="ink-contact-item">
                <strong>Address:</strong> {contactInfo.address}
              </div>
            )}
            {contactInfo.linkedin && (
              <div className="ink-contact-item">
                <strong>LinkedIn:</strong> {contactInfo.linkedin}
              </div>
            )}
            {contactInfo.website && (
              <div className="ink-contact-item">
                <strong>Website:</strong> {contactInfo.website}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Personal Summary */}
      {personalSummary?.content && (
        <div className="ink-section">
          <h3 className="ink-section-title">Professional Summary</h3>
          <p className="ink-summary">{personalSummary.content}</p>
        </div>
      )}

      {/* Work Experience */}
      {experiences && experiences.length > 0 && (
        <div className="ink-section">
          <h3 className="ink-section-title">Work Experience</h3>
          {experiences.map((exp, index) => (
            <div key={index} className="ink-experience">
              <div className="ink-experience-header">
                <h4 className="ink-experience-title">{exp.title}</h4>
              </div>
              {exp.description && (
                <p className="ink-experience-description">{exp.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {(tertEdus && tertEdus.length > 0) ||
      (secondEdu && secondEdu.length > 0) ? (
        <div className="ink-section">
          <h3 className="ink-section-title">Education</h3>
          {tertEdus &&
            tertEdus.map((edu, index) => (
              <div key={index} className="ink-education">
                <h4 className="ink-education-title">
                  {edu.certificationType} - {edu.instituteName}
                </h4>
                <div className="ink-education-meta">
                  {edu.startDate} - {edu.endDate || 'Present'}
                </div>
                {edu.description && (
                  <p className="ink-education-description">{edu.description}</p>
                )}
                {edu.additionalInfo && (
                  <p className="ink-education-description">
                    {edu.additionalInfo}
                  </p>
                )}
              </div>
            ))}
          {secondEdu &&
            secondEdu.map((edu, index) => (
              <div key={index} className="ink-education">
                <h4 className="ink-education-title">{edu.schoolName}</h4>
                <div className="ink-education-meta">
                  {edu.startDate} - {edu.endDate || 'Present'}
                </div>
                {edu.subjects && edu.subjects.length > 0 && (
                  <div className="ink-education-subjects">
                    <strong>Subjects:</strong>{' '}
                    {edu.subjects.map(subject => subject.subject).join(', ')}
                  </div>
                )}
                {edu.additionalInfo && (
                  <p className="ink-education-description">
                    {edu.additionalInfo}
                  </p>
                )}
              </div>
            ))}
        </div>
      ) : null}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <div className="ink-section">
          <h3 className="ink-section-title">Skills</h3>
          <div className="ink-skills-list">
            {skills.map((skill, index) => (
              <div key={index} className="ink-skill-item">
                <div className="ink-skill-name">
                  {skill.skill ||
                    skill.skillName ||
                    skill.name ||
                    skill.title ||
                    `Skill ${index + 1}`}
                </div>
                <div className="ink-skill-proficiency">
                  Proficiency: {getProficiencyNumber(skill.proficiency)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Employment History */}
      {employHistorys && employHistorys.length > 0 && (
        <div className="ink-section">
          <h3 className="ink-section-title">Employment History</h3>
          {employHistorys.map((emp, index) => (
            <div key={index} className="ink-experience">
              <div className="ink-experience-header">
                <h4 className="ink-experience-title">{emp.position}</h4>
                <div className="ink-experience-meta">
                  {emp.company} | {emp.startDate} - {emp.endDate || 'Present'}
                  {emp.current && (
                    <span className="ink-current"> (Current)</span>
                  )}
                </div>
              </div>
              {emp.description && (
                <p className="ink-experience-description">{emp.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Languages */}
      {languages && languages.length > 0 && (
        <div className="ink-section">
          <h3 className="ink-section-title">Languages</h3>
          <div className="ink-languages-grid">
            {languages.map((lang, index) => (
              <div key={index} className="ink-language">
                <span className="ink-language-name">{lang.language}</span>
                <span className="ink-language-level">
                  Read: {getProficiencyNumber(lang.read)} | Write:{' '}
                  {getProficiencyNumber(lang.write)} | Speak:{' '}
                  {getProficiencyNumber(lang.speak)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* References */}
      {references && references.length > 0 && (
        <div className="ink-section">
          <h3 className="ink-section-title">References</h3>
          {references.map((ref, index) => (
            <div key={index} className="ink-reference">
              <h4 className="ink-reference-name">{ref.name}</h4>
              <div className="ink-reference-meta">
                {ref.position} at {ref.company}
              </div>
              {ref.email && (
                <div className="ink-reference-contact">
                  <strong>Email:</strong> {ref.email}
                </div>
              )}
              {ref.phone && (
                <div className="ink-reference-contact">
                  <strong>Phone:</strong> {ref.phone}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Attributes */}
      {attributes && attributes.length > 0 && (
        <div className="ink-section">
          <h3 className="ink-section-title">Personal Attributes</h3>
          <p className="ink-attributes">
            {attributes.map(attr => attr.attribute).join(', ')}
          </p>
        </div>
      )}

      {/* Interests */}
      {interests && interests.length > 0 && (
        <div className="ink-section">
          <h3 className="ink-section-title">Interests</h3>
          <p className="ink-interests">
            {interests.map(interest => interest.interest).join(', ')}
          </p>
        </div>
      )}
    </div>
  );
};

export default InkFriendlyTemplate;
