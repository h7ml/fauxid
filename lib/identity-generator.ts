import { Country, Gender, GenerateIdentityOptions, IdentityType, CreditCardInfo, SocialMediaInfo } from "./types";
import { v4 as uuidv4 } from 'uuid';
import {
  COUNTRY_INFO,
  CN_SURNAMES,
  US_SURNAMES,
  UK_SURNAMES,
  JP_SURNAMES,
  CA_SURNAMES,
  AU_SURNAMES,
  US_STATES,
  US_STATE_ABBREVIATIONS,
  UK_COUNTIES,
  JP_PREFECTURES,
  CA_PROVINCES,
  CA_PROVINCE_ABBREVIATIONS,
  AU_STATES,
  AU_STATE_ABBREVIATIONS,
  US_MALE_GIVEN_NAMES,
  US_FEMALE_GIVEN_NAMES,
  OCCUPATIONS,
  EDUCATION_LEVELS
} from "./country-configs";

// 中国各省份及其行政区划代码前两位
const REGION_CODES: Record<string, string> = {
  '北京': '11',
  '天津': '12',
  '河北': '13',
  '山西': '14',
  '内蒙古': '15',
  '辽宁': '21',
  '吉林': '22',
  '黑龙江': '23',
  '上海': '31',
  '江苏': '32',
  '浙江': '33',
  '安徽': '34',
  '福建': '35',
  '江西': '36',
  '山东': '37',
  '河南': '41',
  '湖北': '42',
  '湖南': '43',
  '广东': '44',
  '广西': '45',
  '海南': '46',
  '重庆': '50',
  '四川': '51',
  '贵州': '52',
  '云南': '53',
  '西藏': '54',
  '陕西': '61',
  '甘肃': '62',
  '青海': '63',
  '宁夏': '64',
  '新疆': '65',
};

// 常见的中国名字（名）
const MALE_GIVEN_NAMES = [
  '伟', '强', '磊', '勇', '军', '杰', '涛', '明', '超', '刚',
  '平', '辉', '健', '鹏', '斌', '波', '宇', '浩', '凯', '鑫',
  '俊', '文', '力', '旭', '航', '帆', '成', '奇', '志', '嘉',
  '宏', '皓', '睿', '泽', '楠', '轩', '宁', '建', '铭', '峰',
];

const FEMALE_GIVEN_NAMES = [
  '娜', '芳', '静', '敏', '婷', '文', '颖', '琴', '丽', '欣',
  '玲', '雪', '莉', '燕', '华', '琳', '瑞', '云', '霞', '红',
  '倩', '月', '莹', '梅', '秀', '艳', '晶', '雯', '茜', '雅',
  '佳', '琼', '瑶', '璐', '柳', '凤', '鸣', '淑', '洁', '梦',
];

// 常见城市和街道
const CITIES: Record<string, string[]> = {
  '北京': ['海淀区', '朝阳区', '东城区', '西城区', '丰台区'],
  '上海': ['浦东新区', '静安区', '黄浦区', '徐汇区', '长宁区'],
  '广州': ['天河区', '越秀区', '海珠区', '白云区', '荔湾区'],
  '深圳': ['南山区', '福田区', '罗湖区', '宝安区', '龙岗区'],
  '杭州': ['西湖区', '拱墅区', '上城区', '下城区', '江干区'],
};

// 美国各城市 - 扩展更多城市
const US_CITIES: Record<string, string[]> = {
  'Alabama': ['Birmingham', 'Montgomery', 'Mobile', 'Huntsville', 'Tuscaloosa', 'Auburn', 'Hoover', 'Dothan', 'Decatur', 'Gadsden'],
  'Alaska': ['Anchorage', 'Fairbanks', 'Juneau', 'Sitka', 'Ketchikan', 'Wasilla', 'Kenai', 'Kodiak', 'Bethel', 'Palmer'],
  'Arizona': ['Phoenix', 'Tucson', 'Mesa', 'Chandler', 'Scottsdale', 'Glendale', 'Gilbert', 'Tempe', 'Peoria', 'Surprise'],
  'California': ['Los Angeles', 'San Francisco', 'San Diego', 'San Jose', 'Sacramento', 'Oakland', 'Fresno', 'Long Beach', 'Bakersfield', 'Anaheim', 'Santa Ana', 'Riverside', 'Irvine', 'San Bernardino'],
  'Colorado': ['Denver', 'Colorado Springs', 'Aurora', 'Fort Collins', 'Lakewood', 'Thornton', 'Arvada', 'Westminster', 'Pueblo', 'Centennial'],
  'Florida': ['Miami', 'Orlando', 'Tampa', 'Jacksonville', 'St. Petersburg', 'Hialeah', 'Tallahassee', 'Fort Lauderdale', 'Port St. Lucie', 'Cape Coral', 'Pembroke Pines'],
  'Georgia': ['Atlanta', 'Savannah', 'Augusta', 'Columbus', 'Macon', 'Athens', 'Sandy Springs', 'Roswell', 'Albany', 'Johns Creek'],
  'New York': ['New York City', 'Buffalo', 'Rochester', 'Syracuse', 'Albany', 'Yonkers', 'New Rochelle', 'Mount Vernon', 'Schenectady', 'Utica'],
  'Texas': ['Houston', 'Dallas', 'San Antonio', 'Austin', 'Fort Worth', 'El Paso', 'Arlington', 'Corpus Christi', 'Plano', 'Laredo', 'Lubbock', 'Garland', 'Irving', 'Amarillo'],
  'Washington': ['Seattle', 'Spokane', 'Tacoma', 'Vancouver', 'Bellevue', 'Kent', 'Everett', 'Renton', 'Yakima', 'Federal Way'],
  'Illinois': ['Chicago', 'Aurora', 'Naperville', 'Joliet', 'Rockford', 'Springfield', 'Peoria', 'Elgin', 'Waukegan', 'Cicero'],
  'Pennsylvania': ['Philadelphia', 'Pittsburgh', 'Allentown', 'Erie', 'Reading', 'Scranton', 'Bethlehem', 'Lancaster', 'Harrisburg', 'Altoona'],
  'Ohio': ['Columbus', 'Cleveland', 'Cincinnati', 'Toledo', 'Akron', 'Dayton', 'Parma', 'Canton', 'Youngstown', 'Lorain'],
  'Michigan': ['Detroit', 'Grand Rapids', 'Warren', 'Sterling Heights', 'Ann Arbor', 'Lansing', 'Flint', 'Dearborn', 'Livonia', 'Westland'],
  'Massachusetts': ['Boston', 'Worcester', 'Springfield', 'Lowell', 'Cambridge', 'New Bedford', 'Brockton', 'Quincy', 'Lynn', 'Fall River']
};

// 美国街道名称
const US_STREET_NAMES = [
  'Main', 'First', 'Second', 'Third', 'Fourth', 'Fifth', 'Oak', 'Pine', 'Maple', 'Cedar', 'Elm', 'Washington',
  'Lincoln', 'Jefferson', 'Roosevelt', 'Madison', 'Adams', 'Jackson', 'Monroe', 'Franklin', 'Wilson',
  'Park', 'Lake', 'Hill', 'River', 'Valley', 'Forest', 'Meadow', 'Garden', 'Wood', 'Sunset', 'Sunrise'
];

// 美国街道类型
const US_STREET_TYPES = [
  'St', 'Ave', 'Blvd', 'Dr', 'Ln', 'Rd', 'Way', 'Pl', 'Ct', 'Terrace', 'Circle', 'Highway', 'Junction'
];

// 美国职业类别
const US_OCCUPATIONS: Record<string, string[]> = {
  'management': ['Manager', 'Director', 'CEO', 'President', 'Supervisor', 'Executive', 'Administrator'],
  'business': ['Accountant', 'Financial Analyst', 'Marketing Specialist', 'Sales Representative', 'Consultant'],
  'technology': ['Software Developer', 'System Administrator', 'IT Specialist', 'Database Administrator', 'Web Developer'],
  'healthcare': ['Doctor', 'Nurse', 'Physical Therapist', 'Dentist', 'Pharmacist', 'Medical Assistant'],
  'education': ['Teacher', 'Professor', 'Principal', 'Librarian', 'School Counselor', 'Tutor'],
  'legal': ['Lawyer', 'Judge', 'Paralegal', 'Legal Assistant', 'Attorney'],
  'service': ['Waiter/Waitress', 'Chef', 'Bartender', 'Hairstylist', 'Flight Attendant', 'Receptionist'],
  'construction': ['Carpenter', 'Electrician', 'Plumber', 'Construction Worker', 'Painter', 'Contractor']
};

// 美国学历
const US_EDUCATION_LEVELS = [
  'High School Diploma', 'Associate\'s Degree', 'Bachelor\'s Degree', 'Master\'s Degree', 'Doctorate', 'Professional Degree'
];

// 社交媒体平台
const SOCIAL_MEDIA_PLATFORMS = ['Twitter', 'Instagram', 'Facebook', 'LinkedIn', 'TikTok', 'Pinterest', 'Snapchat', 'Reddit'];

// 信用卡类型
const CREDIT_CARD_TYPES = ['Visa', 'MasterCard', 'American Express', 'Discover'];

// 随机生成中国身份证号
function generateChineseIdNumber(gender: Gender, birthDate: Date, region: string = '北京'): string {
  // 获取地区编码
  const regionCode = REGION_CODES[region] || '11';
  
  // 随机生成区县代码 (第3-4位)
  const areaCode = Math.floor(Math.random() * 100).toString().padStart(2, '0');
  
  // 生成出生日期码 YYYYMMDD
  const birthCode = birthDate.toISOString().slice(0, 10).replace(/-/g, '');
  
  // 生成顺序码 (第15-17位)
  // 其中第17位奇数表示男性，偶数表示女性
  let seq = Math.floor(Math.random() * 500);
  // 确保性别位正确
  if (gender === '男' && seq % 2 === 0) {
    seq += 1;
  } else if (gender === '女' && seq % 2 === 1) {
    seq += 1;
  }
  const sequenceCode = seq.toString().padStart(3, '0');
  
  // 组合前17位
  const idBase = regionCode + areaCode + birthCode + sequenceCode;
  
  // 计算校验位（第18位）
  const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  let sum = 0;
  for (let i = 0; i < 17; i++) {
    sum += parseInt(idBase[i]) * weights[i];
  }
  const remainder = sum % 11;
  const checkCode = '10X98765432'[remainder];
  
  return idBase + checkCode;
}

// 随机生成美国社会安全号码 (SSN)
function generateAmericanSSN(): string {
  // 生成三部分的SSN (XXX-XX-XXXX)
  const part1 = Math.floor(Math.random() * 900) + 100;
  const part2 = Math.floor(Math.random() * 90) + 10;
  const part3 = Math.floor(Math.random() * 9000) + 1000;
  
  return `${part1}-${part2}-${part3}`;
}

// 随机生成英国国家保险号码 (National Insurance Number)
function generateBritishNIN(): string {
  // 格式: AA 12 34 56 C
  // 随机生成两个字母 (除了 D, F, I, Q, U, V)
  const validLetters = 'ABCEGHJKLMNOPRSTWXYZ';
  const letter1 = validLetters[Math.floor(Math.random() * validLetters.length)];
  const letter2 = validLetters[Math.floor(Math.random() * validLetters.length)];
  
  // 随机生成6位数字
  const digits = Math.floor(Math.random() * 900000) + 100000;
  
  // 最后一个字母 (A, B, C, D)
  const endLetters = 'ABCD';
  const endLetter = endLetters[Math.floor(Math.random() * endLetters.length)];
  
  // 格式化为 AA 12 34 56 C
  const part1 = Math.floor(digits / 10000);
  const part2 = Math.floor((digits % 10000) / 100);
  const part3 = digits % 100;
  
  return `${letter1}${letter2} ${part1} ${part2} ${part3} ${endLetter}`;
}

// 随机生成日本个人编号 (マイナンバー)
function generateJapaneseMyNumber(): string {
  // 12位数字
  let number = '';
  for (let i = 0; i < 12; i++) {
    number += Math.floor(Math.random() * 10);
  }
  
  return number;
}

// 随机生成加拿大社会保险号码 (SIN)
function generateCanadianSIN(): string {
  // 格式: 123-456-789
  let digits = '';
  for (let i = 0; i < 9; i++) {
    digits += Math.floor(Math.random() * 10);
  }
  
  // 格式化为 XXX-XXX-XXX
  return `${digits.substring(0, 3)}-${digits.substring(3, 6)}-${digits.substring(6, 9)}`;
}

// 随机生成澳大利亚税号 (TFN)
function generateAustralianTFN(): string {
  // 8或9位数字
  const length = Math.random() > 0.5 ? 8 : 9;
  let number = '';
  for (let i = 0; i < length; i++) {
    number += Math.floor(Math.random() * 10);
  }
  
  // 格式化为 XXX XXX XXX
  if (length === 9) {
    return `${number.substring(0, 3)} ${number.substring(3, 6)} ${number.substring(6, 9)}`;
  } else {
    return `${number.substring(0, 3)} ${number.substring(3, 5)} ${number.substring(5, 8)}`;
  }
}

// 根据国家生成ID号码
function generateIdNumberByCountry(country: Country, gender: Gender, birthDate: Date, region?: string): string {
  switch(country) {
    case 'CN':
      return generateChineseIdNumber(gender, birthDate, region);
    case 'US':
      return generateAmericanSSN();
    case 'UK':
      return generateBritishNIN();
    case 'JP':
      return generateJapaneseMyNumber();
    case 'CA':
      return generateCanadianSIN();
    case 'AU':
      return generateAustralianTFN();
    default:
      return generateChineseIdNumber(gender, birthDate, region);
  }
}

// 随机生成护照号码
function generatePassportNumber(country: Country): string {
  let prefix = '';
  let length = 8;
  
  // 根据国家设置护照号码前缀和长度
  switch(country) {
    case 'CN':
      prefix = 'E';
      length = 8;
      break;
    case 'US':
      length = 9;
      break;
    case 'UK':
      prefix = Math.random() > 0.5 ? '5' : '6';
      length = 8;
      break;
    case 'JP':
      prefix = 'TK';
      length = 7;
      break;
    case 'CA':
      length = 8;
      break;
    case 'AU':
      prefix = 'P';
      length = 8;
      break;
  }
  
  // 生成随机数字
  let number = '';
  for (let i = 0; i < length; i++) {
    number += Math.floor(Math.random() * 10);
  }
  
  return prefix + number;
}

// 随机生成手机号
function generatePhoneNumber(country: Country): string {
  switch(country) {
    case 'CN': {
      const prefixes = ['130', '131', '132', '133', '134', '135', '136', '137', '138', '139', 
                      '150', '151', '152', '153', '155', '156', '157', '158', '159',
                      '176', '177', '178', '180', '181', '182', '183', '184', '185', '186', '187', '188', '189'];
      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      const suffix = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
      return prefix + suffix;
    }
    case 'US': {
      // 美国号码格式: (XXX) XXX-XXXX
      const areaCode = Math.floor(Math.random() * 900) + 100;
      const prefix = Math.floor(Math.random() * 900) + 100;
      const lineNumber = Math.floor(Math.random() * 9000) + 1000;
      return `(${areaCode}) ${prefix}-${lineNumber}`;
    }
    case 'UK': {
      // 英国号码格式: +44 XXXX XXXXXX
      const prefix = Math.floor(Math.random() * 9000) + 1000;
      const suffix = Math.floor(Math.random() * 900000) + 100000;
      return `+44 ${prefix} ${suffix}`;
    }
    case 'JP': {
      // 日本号码格式: +81 XX-XXXX-XXXX
      const part1 = Math.floor(Math.random() * 90) + 10;
      const part2 = Math.floor(Math.random() * 9000) + 1000;
      const part3 = Math.floor(Math.random() * 9000) + 1000;
      return `+81 ${part1}-${part2}-${part3}`;
    }
    case 'CA': {
      // 加拿大号码格式: (XXX) XXX-XXXX
      const areaCode = Math.floor(Math.random() * 900) + 100;
      const prefix = Math.floor(Math.random() * 900) + 100;
      const lineNumber = Math.floor(Math.random() * 9000) + 1000;
      return `(${areaCode}) ${prefix}-${lineNumber}`;
    }
    case 'AU': {
      // 澳大利亚号码格式: +61 XXX XXX XXX
      const part1 = Math.floor(Math.random() * 900) + 100;
      const part2 = Math.floor(Math.random() * 900) + 100;
      const part3 = Math.floor(Math.random() * 900) + 100;
      return `+61 ${part1} ${part2} ${part3}`;
    }
    default:
      return generatePhoneNumber('CN');
  }
}

// 随机生成电子邮件
function generateEmail(name: string, country: Country): string {
  const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'mail.com', 'protonmail.com'];
  const countryDomains: Record<Country, string[]> = {
    'CN': ['163.com', 'qq.com', '126.com', 'sina.com', 'sohu.com'],
    'US': ['gmail.com', 'yahoo.com', 'hotmail.com', 'aol.com'],
    'UK': ['gmail.com', 'yahoo.co.uk', 'hotmail.co.uk', 'outlook.com'],
    'JP': ['yahoo.co.jp', 'gmail.com', 'ezweb.ne.jp', 'docomo.ne.jp'],
    'CA': ['gmail.com', 'hotmail.ca', 'yahoo.ca', 'outlook.com'],
    'AU': ['gmail.com', 'bigpond.com', 'yahoo.com.au', 'outlook.com']
  };
  
  // 合并通用域名和国家特定域名
  const allDomains = [...domains, ...(countryDomains[country] || [])];
  const domain = allDomains[Math.floor(Math.random() * allDomains.length)];
  
  // 根据名字创建用户名
  const username = name.replace(/\s+/g, '.').toLowerCase();
  const randomNum = Math.floor(Math.random() * 10000);
  
  return `${username}${randomNum}@${domain}`;
}

// 随机生成地址
function generateAddress(country: Country, region?: string): string {
  switch(country) {
    case 'CN': {
      const availableRegions = Object.keys(CITIES);
      const selectedRegion = (region && availableRegions.includes(region)) ? region : availableRegions[Math.floor(Math.random() * availableRegions.length)];
      
      const districts = CITIES[selectedRegion];
      const district = districts[Math.floor(Math.random() * districts.length)];
      
      const streetNum = Math.floor(Math.random() * 200) + 1;
      const building = Math.floor(Math.random() * 20) + 1;
      const room = Math.floor(Math.random() * 500) + 1;
      
      return `${selectedRegion}市${district}某某路${streetNum}号${building}栋${room}室`;
    }
    case 'US': {
      const streetNumber = Math.floor(Math.random() * 9900) + 100;
      const streetName = US_STREET_NAMES[Math.floor(Math.random() * US_STREET_NAMES.length)];
      const streetType = US_STREET_TYPES[Math.floor(Math.random() * US_STREET_TYPES.length)];
      
      // 使用提供的州或随机选择一个州
      const state = region && US_STATES.includes(region) 
        ? region 
        : US_STATES[Math.floor(Math.random() * US_STATES.length)];
        
      const stateIndex = US_STATES.indexOf(state);
      const stateAbbr = US_STATE_ABBREVIATIONS[stateIndex];
      
      // 获取该州的城市或使用随机城市
      let city;
      if (US_CITIES[state]) {
        city = US_CITIES[state][Math.floor(Math.random() * US_CITIES[state].length)];
      } else {
        // 如果没有该州的城市数据，使用随机城市名
        const randomCities = ['Springfield', 'Franklin', 'Clinton', 'Georgetown', 'Salem', 'Madison'];
        city = randomCities[Math.floor(Math.random() * randomCities.length)];
      }
      
      const zipCode = Math.floor(Math.random() * 90000) + 10000;
      
      return `${streetNumber} ${streetName} ${streetType}, ${city}, ${stateAbbr} ${zipCode}`;
    }
    case 'UK': {
      const houseNumber = Math.floor(Math.random() * 300) + 1;
      const streets = ['High Street', 'Station Road', 'Church Lane', 'Mill Lane', 'Victoria Road'];
      const street = streets[Math.floor(Math.random() * streets.length)];
      
      const county = UK_COUNTIES[Math.floor(Math.random() * UK_COUNTIES.length)];
      const towns = ['Amberley', 'Blackpool', 'Cambridge', 'Dover', 'Exeter', 'Farnham'];
      const town = towns[Math.floor(Math.random() * towns.length)];
      
      // 生成英国邮编
      const postcodePrefixes = ['AB', 'B', 'CF', 'DY', 'EH', 'FK'];
      const postcodePrefix = postcodePrefixes[Math.floor(Math.random() * postcodePrefixes.length)];
      const postcodeNumber = Math.floor(Math.random() * 90) + 10;
      const postcodeEnd = `${Math.floor(Math.random() * 9)}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`;
      
      return `${houseNumber} ${street}, ${town}, ${county}, ${postcodePrefix}${postcodeNumber} ${postcodeEnd}`;
    }
    case 'JP': {
      const prefecture = JP_PREFECTURES[Math.floor(Math.random() * JP_PREFECTURES.length)];
      const city = '市';
      const chome = Math.floor(Math.random() * 30) + 1;
      const ban = Math.floor(Math.random() * 20) + 1;
      const go = Math.floor(Math.random() * 20) + 1;
      
      // 生成日本邮编
      const postalCode = `〒${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`;
      
      return `${postalCode} ${prefecture}${city}${chome}丁目${ban}番${go}号`;
    }
    case 'CA': {
      const streetNumber = Math.floor(Math.random() * 9900) + 100;
      const streetNames = ['Maple', 'Oak', 'Pine', 'Cedar', 'Birch', 'Spruce'];
      const streetName = streetNames[Math.floor(Math.random() * streetNames.length)];
      const streetTypes = ['St', 'Ave', 'Blvd', 'Dr', 'Crescent', 'Road'];
      const streetType = streetTypes[Math.floor(Math.random() * streetTypes.length)];
      
      const provinceIndex = Math.floor(Math.random() * CA_PROVINCES.length);
      const province = CA_PROVINCE_ABBREVIATIONS[provinceIndex];
      
      const cities = ['Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Ottawa', 'Edmonton'];
      const city = cities[Math.floor(Math.random() * cities.length)];
      
      // 生成加拿大邮编
      const postalCodeChar1 = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      const postalCodeNum1 = Math.floor(Math.random() * 10);
      const postalCodeChar2 = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      const postalCodeNum2 = Math.floor(Math.random() * 10);
      const postalCodeChar3 = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      const postalCodeNum3 = Math.floor(Math.random() * 10);
      
      const postalCode = `${postalCodeChar1}${postalCodeNum1}${postalCodeChar2} ${postalCodeNum2}${postalCodeChar3}${postalCodeNum3}`;
      
      return `${streetNumber} ${streetName} ${streetType}, ${city}, ${province} ${postalCode}`;
    }
    case 'AU': {
      const unitNumber = Math.floor(Math.random() * 100) + 1;
      const streetNumber = Math.floor(Math.random() * 300) + 1;
      const streetNames = ['High', 'Beach', 'King', 'Queen', 'George', 'Victoria'];
      const streetName = streetNames[Math.floor(Math.random() * streetNames.length)];
      const streetTypes = ['Street', 'Road', 'Avenue', 'Drive', 'Lane', 'Way'];
      const streetType = streetTypes[Math.floor(Math.random() * streetTypes.length)];
      
      const stateIndex = Math.floor(Math.random() * AU_STATES.length);
      const state = AU_STATE_ABBREVIATIONS[stateIndex];
      
      const suburbs = ['Brighton', 'Sunnybank', 'Chatswood', 'Parramatta', 'St Kilda', 'Fremantle'];
      const suburb = suburbs[Math.floor(Math.random() * suburbs.length)];
      
      const postcode = Math.floor(Math.random() * 9000) + 1000;
      
      return `Unit ${unitNumber}, ${streetNumber} ${streetName} ${streetType}, ${suburb}, ${state} ${postcode}`;
    }
    default:
      return generateAddress('CN', region);
  }
}

// 随机生成年龄在范围内的出生日期
function generateBirthDate(minAge: number = 18, maxAge: number = 70): Date {
  const now = new Date();
  const minYear = now.getFullYear() - maxAge;
  const maxYear = now.getFullYear() - minAge;
  
  const year = minYear + Math.floor(Math.random() * (maxYear - minYear));
  const month = Math.floor(Math.random() * 12);
  const day = Math.floor(Math.random() * 28) + 1; // 简化处理，避免月份天数问题
  
  return new Date(year, month, day);
}

// 生成随机姓名 (基于国家)
function generateName(gender: Gender, country: Country): string {
  // 获取对应国家的姓氏列表
  let surnames;
  let givenNames;
  
  switch(country) {
    case 'CN':
      surnames = CN_SURNAMES;
      givenNames = gender === '男' ? MALE_GIVEN_NAMES : FEMALE_GIVEN_NAMES;
      break;
    case 'US':
      surnames = US_SURNAMES;
      givenNames = gender === '男' ? US_MALE_GIVEN_NAMES : US_FEMALE_GIVEN_NAMES;
      break;
    case 'UK':
      surnames = UK_SURNAMES;
      givenNames = gender === '男' ? US_MALE_GIVEN_NAMES : US_FEMALE_GIVEN_NAMES; // 使用美国名作为英国名的近似
      break;
    case 'JP':
      surnames = JP_SURNAMES;
      // 简单起见，日本名字不区分性别，使用姓氏作为名字的一部分
      givenNames = JP_SURNAMES.slice(0, 20);
      break;
    case 'CA':
      surnames = CA_SURNAMES;
      givenNames = gender === '男' ? US_MALE_GIVEN_NAMES : US_FEMALE_GIVEN_NAMES; // 使用美国名作为加拿大名的近似
      break;
    case 'AU':
      surnames = AU_SURNAMES;
      givenNames = gender === '男' ? US_MALE_GIVEN_NAMES : US_FEMALE_GIVEN_NAMES; // 使用美国名作为澳大利亚名的近似
      break;
    default:
      surnames = CN_SURNAMES;
      givenNames = gender === '男' ? MALE_GIVEN_NAMES : FEMALE_GIVEN_NAMES;
  }
  
  // 随机选择姓氏和名字
  const surname = surnames[Math.floor(Math.random() * surnames.length)];
  const givenName = givenNames[Math.floor(Math.random() * givenNames.length)];
  
  // 根据国家格式化名字
  switch(country) {
    case 'CN':
      // 中国名: 姓+名
      // 随机决定是否生成双字名
      const isDoubleName = Math.random() > 0.6;
      if (isDoubleName) {
        const secondGivenName = givenNames[Math.floor(Math.random() * givenNames.length)];
        return surname + givenName + secondGivenName;
      }
      return surname + givenName;
    case 'JP':
      // 日本名: 姓 名 (通常不使用空格，但为了可读性添加)
      return surname + ' ' + givenName;
    default:
      // 西方名: 名 姓
      return givenName + ' ' + surname;
  }
}

// 获取国籍
function getNationality(country: Country): string {
  const nationalities: Record<Country, string> = {
    'CN': '中国',
    'US': '美国',
    'UK': '英国',
    'JP': '日本',
    'CA': '加拿大',
    'AU': '澳大利亚'
  };
  
  return nationalities[country] || '中国';
}

// 生成美国驾照号码
function generateUSDriversLicense(state: string): string {
  const stateAbbr = US_STATE_ABBREVIATIONS[US_STATES.indexOf(state)] || US_STATE_ABBREVIATIONS[Math.floor(Math.random() * US_STATE_ABBREVIATIONS.length)];
  
  switch(stateAbbr) {
    case 'CA': // 加利福尼亚州：1个字母+ 7个数字
      return `${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}`;
    case 'TX': // 德克萨斯州：8个数字
      return Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
    case 'FL': // 佛罗里达州：1个字母+ 12个数字
      return `${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0')}`;
    case 'NY': // 纽约州：9个数字
      return Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
    default: // 默认格式：2个字母+ 6个数字
      const letter1 = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      const letter2 = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      return `${letter1}${letter2}${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
  }
}

// 生成信用卡信息
function generateCreditCard(): CreditCardInfo {
  const cardType = CREDIT_CARD_TYPES[Math.floor(Math.random() * CREDIT_CARD_TYPES.length)];
  
  let prefix = '';
  let length = 16;
  
  switch(cardType) {
    case 'Visa':
      prefix = '4';
      length = 16;
      break;
    case 'MasterCard':
      prefix = `5${Math.floor(Math.random() * 5) + 1}`;
      length = 16;
      break;
    case 'American Express':
      prefix = `3${Math.floor(Math.random() * 2) + 4}`;
      length = 15;
      break;
    case 'Discover':
      prefix = '6011';
      length = 16;
      break;
  }
  
  // 生成剩余数字
  let cardNumber = prefix;
  const remaining = length - prefix.length;
  
  for (let i = 0; i < remaining; i++) {
    cardNumber += Math.floor(Math.random() * 10).toString();
  }
  
  // 生成过期日期 (1-12月，当前年份+1到当前年份+5)
  const currentYear = new Date().getFullYear();
  const month = Math.floor(Math.random() * 12) + 1;
  const year = currentYear + Math.floor(Math.random() * 5) + 1;
  const expiration = `${month.toString().padStart(2, '0')}/${(year % 100).toString()}`;
  
  // 生成CVV
  const cvvLength = cardType === 'American Express' ? 4 : 3;
  let cvv = '';
  for (let i = 0; i < cvvLength; i++) {
    cvv += Math.floor(Math.random() * 10).toString();
  }
  
  return {
    number: cardNumber,
    expiration,
    cvv,
    type: cardType
  };
}

// 生成社交媒体账号
function generateSocialMedia(name: string): SocialMediaInfo[] {
  const accounts: SocialMediaInfo[] = [];
  const platforms = [...SOCIAL_MEDIA_PLATFORMS];
  
  // 随机选择2-4个平台
  const numAccounts = Math.floor(Math.random() * 3) + 2;
  
  for (let i = 0; i < numAccounts && platforms.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * platforms.length);
    const platform = platforms[randomIndex];
    
    // 从剩余平台中移除已选择的平台
    platforms.splice(randomIndex, 1);
    
    // 创建用户名，不同平台有不同格式
    let username = name.toLowerCase().replace(/\s+/g, '');
    
    // 添加随机数字或特殊字符
    if (Math.random() > 0.5) {
      username += Math.floor(Math.random() * 1000);
    } else {
      const separators = ['_', '.', '-'];
      const separator = separators[Math.floor(Math.random() * separators.length)];
      const nameParts = name.split(' ');
      
      if (nameParts.length > 1) {
        username = `${nameParts[0].toLowerCase()}${separator}${nameParts[1].toLowerCase()}`;
        if (Math.random() > 0.7) {
          username += Math.floor(Math.random() * 100);
        }
      }
    }
    
    let url;
    switch(platform) {
      case 'Twitter':
        url = `https://twitter.com/${username}`;
        break;
      case 'Instagram':
        url = `https://instagram.com/${username}`;
        break;
      case 'Facebook':
        url = `https://facebook.com/${username}`;
        break;
      case 'LinkedIn':
        url = `https://linkedin.com/in/${username}`;
        break;
      case 'TikTok':
        url = `https://tiktok.com/@${username}`;
        break;
      case 'Pinterest':
        url = `https://pinterest.com/${username}`;
        break;
      case 'Reddit':
        url = `https://reddit.com/user/${username}`;
        break;
      case 'Snapchat':
        url = null; // Snapchat doesn't have public profile URLs
        break;
    }
    
    accounts.push({
      username,
      platform,
      url: url || undefined
    });
  }
  
  return accounts;
}

// 生成头像URL (使用一些免费的头像生成服务)
function generateAvatar(gender: Gender): string {
  const style = Math.floor(Math.random() * 3) + 1; // 不同的头像风格
  const seed = Math.floor(Math.random() * 1000); // 随机种子
  
  // 使用不同的免费头像生成服务
  const serviceType = Math.floor(Math.random() * 3);
  
  switch(serviceType) {
    case 0:
      // DiceBear Avatars
      const dicebearStyle = ['adventurer', 'adventurer-neutral', 'avataaars', 'big-ears', 'bottts', 'croodles', 'identicon', 'initials', 'micah'][Math.floor(Math.random() * 9)];
      return `https://avatars.dicebear.com/api/${dicebearStyle}/${seed}.svg`;
    case 1:
      // RoboHash (有趣的机器人头像)
      return `https://robohash.org/${seed}?set=set${style}`;
    case 2:
    default:
      // 基于性别的卡通头像 - 修复URL参数格式
      const genderParam = gender === '男' ? 'male' : 'female';
      // 使用更安全的URL构建方式
      const url = new URL('https://xsgames.co/randomusers/avatar.php');
      url.searchParams.append('g', genderParam);
      url.searchParams.append('random', seed.toString());
      return url.toString();
  }
}

// 主函数：生成虚假身份
export function generateRandomIdentity(options: GenerateIdentityOptions = {}): IdentityType {
  // 确定国家
  const country: Country = options.country || 'CN';
  
  // 确定性别
  const gender: Gender = options.gender || (Math.random() > 0.5 ? '男' : '女');
  
  // 确定年龄范围
  const minAge = options.age_min || 18;
  const maxAge = options.age_max || 70;
  
  // 确定地区
  const region = options.region;
  
  // 生成出生日期
  const birthDate = generateBirthDate(minAge, maxAge);
  
  // 生成姓名
  const name = generateName(gender, country);
  
  // 生成身份证号/ID
  const idNumber = generateIdNumberByCountry(country, gender, birthDate, region);
  
  // 生成护照号码
  const passportNumber = generatePassportNumber(country);
  
  // 生成地址
  const address = generateAddress(country, region);
  
  // 生成手机号
  const phone = generatePhoneNumber(country);
  
  // 生成邮箱
  const email = generateEmail(name, country);
  
  // 获取国籍
  const nationality = getNationality(country);
  
  // 生成职业
  let occupation;
  if (country === 'US' && options.occupation_category && US_OCCUPATIONS[options.occupation_category]) {
    // 使用指定的职业类别选择职业
    const careers = US_OCCUPATIONS[options.occupation_category];
    occupation = careers[Math.floor(Math.random() * careers.length)];
  } else {
    occupation = OCCUPATIONS[Math.floor(Math.random() * OCCUPATIONS.length)];
  }
  
  // 生成教育水平
  let education;
  if (country === 'US' && options.education_level && options.education_level !== 'random') {
    // 映射前端选项到具体的教育水平
    const educationMapping: Record<string, string> = {
      'high_school': 'High School Diploma',
      'associates': 'Associate\'s Degree',
      'bachelors': 'Bachelor\'s Degree',
      'masters': 'Master\'s Degree',
      'doctorate': 'Doctorate'
    };
    education = educationMapping[options.education_level] || US_EDUCATION_LEVELS[Math.floor(Math.random() * US_EDUCATION_LEVELS.length)];
  } else {
    education = EDUCATION_LEVELS[Math.floor(Math.random() * EDUCATION_LEVELS.length)];
  }
  
  // 生成美国驾照号码 (仅当国家是美国时)
  let driversLicense;
  if (country === 'US') {
    driversLicense = generateUSDriversLicense(region || 'California');
  }
  
  // 生成信用卡信息
  let creditCard;
  if (options.generate_credit_card !== false) {
    creditCard = generateCreditCard();
  }
  
  // 生成社交媒体账号
  let socialMedia;
  if (options.generate_social_media !== false) {
    socialMedia = generateSocialMedia(name);
  }
  
  // 生成头像URL
  let avatarUrl;
  if (options.generate_avatar !== false) {
    avatarUrl = generateAvatar(gender);
  }
  
  return {
    id: uuidv4(),
    name,
    gender,
    birth_date: birthDate.toISOString().split('T')[0],
    id_number: idNumber,
    address,
    phone,
    email,
    occupation,
    education,
    created_at: new Date().toISOString(),
    favorite: false,
    country,
    nationality,
    passport_number: passportNumber,
    drivers_license: driversLicense,
    credit_card: creditCard,
    social_media: socialMedia,
    avatar_url: avatarUrl
  };
}

// 批量生成虚假身份
export function generateMultipleIdentities(count: number, options: GenerateIdentityOptions = {}): IdentityType[] {
  const identities: IdentityType[] = [];
  
  for (let i = 0; i < count; i++) {
    identities.push(generateRandomIdentity(options));
  }
  
  return identities;
} 
