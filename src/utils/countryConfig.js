// Country configurations for CV Cloud
export const COUNTRIES = [
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦' },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭' },
  { code: 'ZW', name: 'Zimbabwe', flag: '🇿🇼' },
  { code: 'BW', name: 'Botswana', flag: '🇧🇼' },
  { code: 'NA', name: 'Namibia', flag: '🇳🇦' },
  { code: 'MZ', name: 'Mozambique', flag: '🇲🇿' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'OTHER', name: 'Other', flag: '🌍' },
];

export const COUNTRY_CONFIGS = {
  ZA: {
    // South Africa
    requiresIDNumber: true,
    idLabel: 'SA ID Number',
    idPlaceholder: '0001010000001',
    idFormat: /^\d{13}$/,
    idHelperText: '13-digit SA ID number',
    phoneFormat: '+27',
    nationality: 'South African',
    hasDriversLicense: true,
    addressFields: {
      street: true,
      suburb: true,
      city: true,
      province: true,
      postalCode: true,
      country: false, // Don't show country field for SA
    },
  },
  PH: {
    // Philippines
    requiresIDNumber: false,
    idLabel: 'National ID / SSS / TIN',
    idPlaceholder: 'Optional',
    phoneFormat: '+63',
    nationality: 'Filipino',
    hasDriversLicense: true,
    addressFields: {
      street: true,
      barangay: true,
      city: true,
      region: true,
      zipCode: true,
      country: false,
    },
  },
  NG: {
    // Nigeria
    requiresIDNumber: false,
    idLabel: 'National ID / NIN',
    idPlaceholder: 'Optional',
    phoneFormat: '+234',
    nationality: 'Nigerian',
    hasDriversLicense: true,
    addressFields: {
      street: true,
      lga: true,
      city: true,
      state: true,
      postalCode: true,
      country: false,
    },
  },
  DEFAULT: {
    // Other countries
    requiresIDNumber: false,
    idLabel: 'National ID / Passport Number',
    idPlaceholder: 'Optional',
    phoneFormat: 'international',
    nationality: '',
    hasDriversLicense: true,
    addressFields: {
      street: true,
      city: true,
      state: true,
      postalCode: true,
      country: true, // Show country field for international users
    },
  },
};

/**
 * Get country configuration based on country code
 * @param {string} countryCode - ISO 3166-1 alpha-2 country code
 * @returns {object} Country configuration
 */
export const getCountryConfig = countryCode => {
  return COUNTRY_CONFIGS[countryCode] || COUNTRY_CONFIGS.DEFAULT;
};

/**
 * Get country name from country code
 * @param {string} countryCode - ISO 3166-1 alpha-2 country code
 * @returns {string} Country name
 */
export const getCountryName = countryCode => {
  const country = COUNTRIES.find(c => c.code === countryCode);
  return country ? country.name : 'Other';
};

/**
 * Validate ID number based on country
 * @param {string} idNumber - ID number to validate
 * @param {string} countryCode - Country code
 * @returns {boolean} Is valid
 */
export const validateIDNumber = (idNumber, countryCode) => {
  const config = getCountryConfig(countryCode);

  // If ID is not required and empty, it's valid
  if (!config.requiresIDNumber && !idNumber) {
    return true;
  }

  // If ID is required and empty, it's invalid
  if (config.requiresIDNumber && !idNumber) {
    return false;
  }

  // If there's a format regex, validate against it
  if (config.idFormat && idNumber) {
    return config.idFormat.test(idNumber);
  }

  // Otherwise, it's valid (country doesn't have strict format)
  return true;
};

/**
 * Detect user's country from browser/IP (client-side approximation)
 * Returns 'ZA' as default for South Africa
 * @returns {string} Country code
 */
export const detectUserCountry = () => {
  // Try to get from browser timezone
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timezone.includes('Johannesburg') || timezone.includes('Africa/')) {
      return 'ZA';
    }
    if (timezone.includes('Manila')) {
      return 'PH';
    }
    if (timezone.includes('Lagos')) {
      return 'NG';
    }
  } catch (error) {
    console.error('Error detecting timezone:', error);
  }

  // Default to South Africa (primary market)
  return 'ZA';
};

