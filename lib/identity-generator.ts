import { Country, Gender, GenerateIdentityOptions, IdentityType } from "./types";
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
  const sequenceCode = Math.floor(Math.random() * 500).toString().padStart(3, '0');
  let seq = parseInt(sequenceCode);
  if (gender === '男' && seq % 2 === 0) {
    seq += 1;
  } else if (gender === '女' && seq % 2 === 1) {
    seq += 1;
  }
  
  // 组合前17位
  const idBase = regionCode + areaCode + birthCode + seq.toString().padStart(3, '0');
  
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
      const streetTypes = ['St', 'Ave', 'Blvd', 'Dr', 'Ln', 'Rd', 'Way', 'Pl'];
      const streetNames = ['Main', 'Oak', 'Pine', 'Maple', 'Cedar', 'Washington', 'Lincoln', 'Park'];
      
      const streetName = streetNames[Math.floor(Math.random() * streetNames.length)];
      const streetType = streetTypes[Math.floor(Math.random() * streetTypes.length)];
      const stateIndex = Math.floor(Math.random() * US_STATES.length);
      const state = US_STATES[stateIndex];
      const stateAbbr = US_STATE_ABBREVIATIONS[stateIndex];
      
      const zipCode = Math.floor(Math.random() * 90000) + 10000;
      const city = ['Springfield', 'Franklin', 'Clinton', 'Georgetown', 'Salem', 'Madison'][Math.floor(Math.random() * 6)];
      
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
  const occupation = OCCUPATIONS[Math.floor(Math.random() * OCCUPATIONS.length)];
  
  // 生成教育水平
  const education = EDUCATION_LEVELS[Math.floor(Math.random() * EDUCATION_LEVELS.length)];
  
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
    passport_number: passportNumber
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
