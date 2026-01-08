import React from 'react';
import Template01 from './templates/template01/Template01';
import Template02 from './templates/template02/Template02';
import Template03 from './templates/template03/Template03';
import Template04 from './templates/template04/Template04';
import Template05 from './templates/template05/Template05';
import Template06 from './templates/template06/Template06';
import Template07 from './templates/template07/Template07';
import Template08 from './templates/template08/Template08';
import Template09 from './templates/template09/Template09';
import Template10 from './templates/template10/Template10';
import './CVTemplateRenderer.css';

/**
 * CVTemplateRenderer - Reusable component for rendering CV templates
 *
 * This component ensures consistent template rendering across different views
 * (ViewCV, HRViewCV, etc.) by providing a single source of truth for template logic.
 *
 * @param {Object} props
 * @param {Object} props.cvData - The CV data object containing all CV information
 * @param {string} props.templateSelected - The template identifier (e.g., 'template01', 'template05')
 * @param {string} [props.fallbackTemplate='template01'] - Fallback template if templateSelected is invalid
 */
const CVTemplateRenderer = ({
  cvData,
  templateSelected,
  fallbackTemplate = 'template01',
}) => {
  if (!cvData) {
    return null;
  }

  const templateToUse = templateSelected || fallbackTemplate;

  // Render template based on selection
  // Wrap in a container that isolates template from parent flex context
  let templateComponent;
  switch (templateToUse) {
    case 'template01':
      templateComponent = <Template01 cvData={cvData} />;
      break;
    case 'template02':
      templateComponent = <Template02 cvData={cvData} />;
      break;
    case 'template03':
      templateComponent = <Template03 cvData={cvData} />;
      break;
    case 'template04':
      templateComponent = <Template04 cvData={cvData} />;
      break;
    case 'template05':
      templateComponent = <Template05 cvData={cvData} />;
      break;
    case 'template06':
      templateComponent = <Template06 cvData={cvData} />;
      break;
    case 'template07':
      templateComponent = <Template07 cvData={cvData} />;
      break;
    case 'template08':
      templateComponent = <Template08 cvData={cvData} />;
      break;
    case 'template09':
      templateComponent = <Template09 cvData={cvData} />;
      break;
    case 'template10':
      templateComponent = <Template10 cvData={cvData} />;
      break;
    default:
      console.warn(
        `⚠️ CVTemplateRenderer: Unknown template "${templateToUse}", defaulting to ${fallbackTemplate}`
      );
      templateComponent = <Template01 cvData={cvData} />;
  }

  return (
    <div className="cv-template-wrapper">
      {templateComponent}
    </div>
  );
};

export default CVTemplateRenderer;
