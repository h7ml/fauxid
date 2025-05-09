import { Country, CountryInfo } from "./types";

// 国家配置信息
export const COUNTRY_INFO: Record<Country, CountryInfo> = {
  CN: {
    code: 'CN',
    name: '中国',
    idNumberName: '身份证号'
  },
  US: {
    code: 'US',
    name: '美国',
    idNumberName: 'SSN'
  },
  UK: {
    code: 'UK',
    name: '英国',
    idNumberName: 'National Insurance Number'
  },
  JP: {
    code: 'JP',
    name: '日本',
    idNumberName: 'マイナンバー'
  },
  CA: {
    code: 'CA',
    name: '加拿大',
    idNumberName: 'SIN'
  },
  AU: {
    code: 'AU',
    name: '澳大利亚',
    idNumberName: 'TFN'
  }
};

// 美国各州
export const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 
  'Wisconsin', 'Wyoming'
];

// 美国各州缩写
export const US_STATE_ABBREVIATIONS = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA',
  'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT',
  'VA', 'WA', 'WV', 'WI', 'WY'
];

// 英国郡县
export const UK_COUNTIES = [
  'Avon', 'Bedfordshire', 'Berkshire', 'Buckinghamshire', 'Cambridgeshire', 'Cheshire', 
  'Cleveland', 'Cornwall', 'Cumbria', 'Derbyshire', 'Devon', 'Dorset', 'Durham', 
  'East Sussex', 'Essex', 'Gloucestershire', 'Hampshire', 'Herefordshire', 'Hertfordshire', 
  'Isle of Wight', 'Kent', 'Lancashire', 'Leicestershire', 'Lincolnshire', 'London', 
  'Merseyside', 'Middlesex', 'Norfolk', 'Northamptonshire', 'Northumberland', 'North Yorkshire', 
  'Nottinghamshire', 'Oxfordshire', 'Shropshire', 'Somerset', 'South Yorkshire', 'Staffordshire', 
  'Suffolk', 'Surrey', 'Tyne and Wear', 'Warwickshire', 'West Midlands', 'West Sussex', 
  'West Yorkshire', 'Wiltshire', 'Worcestershire'
];

// 日本各县
export const JP_PREFECTURES = [
  '東京都', '大阪府', '北海道', '京都府', '神奈川県', '愛知県', '福岡県', '兵庫県', '広島県', 
  '宮城県', '千葉県', '埼玉県', '静岡県', '茨城県', '栃木県', '群馬県', '岐阜県', '三重県', 
  '滋賀県', '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '山口県', '徳島県', '香川県', 
  '愛媛県', '高知県', '福井県', '山梨県', '長野県', '新潟県', '富山県', '石川県', '福島県', 
  '山形県', '秋田県', '岩手県', '青森県', '大分県', '宮崎県', '熊本県', '長崎県', '佐賀県', 
  '鹿児島県', '沖縄県'
];

// 加拿大各省
export const CA_PROVINCES = [
  'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland and Labrador',
  'Northwest Territories', 'Nova Scotia', 'Nunavut', 'Ontario', 'Prince Edward Island',
  'Quebec', 'Saskatchewan', 'Yukon'
];

// 加拿大各省缩写
export const CA_PROVINCE_ABBREVIATIONS = [
  'AB', 'BC', 'MB', 'NB', 'NL', 'NT', 'NS', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT'
];

// 澳大利亚各州和领地
export const AU_STATES = [
  'New South Wales', 'Victoria', 'Queensland', 'Western Australia', 
  'South Australia', 'Tasmania', 'Australian Capital Territory', 'Northern Territory'
];

// 澳大利亚各州和领地缩写
export const AU_STATE_ABBREVIATIONS = [
  'NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'
];

// 中国姓氏
export const CN_SURNAMES = [
  '张', '王', '李', '赵', '刘', '陈', '杨', '黄', '周', '吴',
  '徐', '孙', '马', '朱', '胡', '林', '郭', '何', '高', '罗',
  '郑', '梁', '谢', '宋', '唐', '许', '邓', '冯', '韩', '曹',
  '曾', '彭', '萧', '蔡', '潘', '田', '董', '袁', '于', '余',
  '叶', '蒋', '杜', '苏', '魏', '程', '吕', '丁', '沈', '任',
  '姚', '卢', '傅', '钟', '姜', '崔', '谭', '廖', '范', '汪',
  '陆', '金', '石', '戴', '贾', '韦', '夏', '邱', '方', '侯',
  '邹', '熊', '孟', '秦', '白', '江', '闫', '薛', '尹', '段',
];

// 美国常用姓氏
export const US_SURNAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia', 'Rodriguez', 'Wilson',
  'Martinez', 'Anderson', 'Taylor', 'Thomas', 'Hernandez', 'Moore', 'Martin', 'Jackson', 'Thompson', 'White',
  'Lopez', 'Lee', 'Gonzalez', 'Harris', 'Clark', 'Lewis', 'Robinson', 'Walker', 'Perez', 'Hall',
  'Young', 'Allen', 'Sanchez', 'Wright', 'King', 'Scott', 'Green', 'Baker', 'Adams', 'Nelson',
  'Hill', 'Ramirez', 'Campbell', 'Mitchell', 'Roberts', 'Carter', 'Phillips', 'Evans', 'Turner', 'Torres'
];

// 英国常用姓氏
export const UK_SURNAMES = [
  'Smith', 'Jones', 'Williams', 'Taylor', 'Brown', 'Davies', 'Evans', 'Wilson', 'Thomas', 'Roberts',
  'Johnson', 'Lewis', 'Walker', 'Robinson', 'Wood', 'Thompson', 'White', 'Watson', 'Jackson', 'Wright',
  'Green', 'Harris', 'Cooper', 'King', 'Lee', 'Martin', 'Clarke', 'James', 'Morgan', 'Hughes',
  'Edwards', 'Hill', 'Moore', 'Clark', 'Harrison', 'Scott', 'Young', 'Morris', 'Hall', 'Ward',
  'Turner', 'Carter', 'Phillips', 'Mitchell', 'Patel', 'Adams', 'Campbell', 'Anderson', 'Allen', 'Cook'
];

// 日本常用姓氏
export const JP_SURNAMES = [
  '佐藤', '鈴木', '高橋', '田中', '渡辺', '伊藤', '山本', '中村', '小林', '加藤',
  '吉田', '山田', '佐々木', '山口', '松本', '井上', '木村', '林', '斎藤', '清水',
  '山崎', '阿部', '森', '池田', '橋本', '石川', '前田', '藤田', '後藤', '小川',
  '岡田', '村上', '長谷川', '近藤', '石井', '斉藤', '坂本', '遠藤', '藤井', '青木',
  '福田', '三浦', '西村', '藤原', '太田', '松田', '原田', '岡本', '中川', '中島'
];

// 加拿大常用姓氏 (混合英法)
export const CA_SURNAMES = [
  'Smith', 'Brown', 'Tremblay', 'Martin', 'Roy', 'Wilson', 'Gagnon', 'Johnson', 'MacDonald', 'Taylor',
  'Campbell', 'Anderson', 'Jones', 'Leblanc', 'Côté', 'Williams', 'Miller', 'Thompson', 'Gauthier', 'Young',
  'Van', 'Bouchard', 'Scott', 'Stewart', 'Morin', 'Li', 'Lee', 'Harris', 'Fortin', 'Gagné',
  'Clark', 'Johnston', 'Reid', 'Robinson', 'Thomas', 'Walker', 'Wright', 'Mitchell', 'Davis', 'Chen'
];

// 澳大利亚常用姓氏
export const AU_SURNAMES = [
  'Smith', 'Jones', 'Williams', 'Brown', 'Wilson', 'Taylor', 'Johnson', 'White', 'Martin', 'Anderson',
  'Thompson', 'Nguyen', 'Thomas', 'Walker', 'Harris', 'Lee', 'Ryan', 'Robinson', 'Kelly', 'King',
  'Davis', 'Wright', 'Evans', 'Roberts', 'Green', 'Baker', 'Campbell', 'Clarke', 'Cooper', 'Parker',
  'Morris', 'Mills', 'Mitchell', 'Young', 'Cook', 'Bell', 'Murphy', 'Bailey', 'Collins', 'Allen'
];

// 常见男性名字 (美国)
export const US_MALE_GIVEN_NAMES = [
  'James', 'John', 'Robert', 'Michael', 'William', 'David', 'Joseph', 'Richard', 'Thomas', 'Charles',
  'Christopher', 'Daniel', 'Matthew', 'Anthony', 'Mark', 'Donald', 'Steven', 'Andrew', 'Paul', 'Joshua',
  'Kenneth', 'Kevin', 'Brian', 'George', 'Timothy', 'Ronald', 'Jason', 'Edward', 'Jeffrey', 'Ryan',
  'Jacob', 'Gary', 'Nicholas', 'Eric', 'Jonathan', 'Stephen', 'Larry', 'Justin', 'Scott', 'Brandon'
];

// 常见女性名字 (美国)
export const US_FEMALE_GIVEN_NAMES = [
  'Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Sarah', 'Karen',
  'Lisa', 'Nancy', 'Betty', 'Sandra', 'Margaret', 'Ashley', 'Kimberly', 'Emily', 'Donna', 'Michelle',
  'Carol', 'Amanda', 'Dorothy', 'Melissa', 'Deborah', 'Stephanie', 'Rebecca', 'Laura', 'Sharon', 'Cynthia',
  'Kathleen', 'Amy', 'Shirley', 'Angela', 'Helen', 'Anna', 'Brenda', 'Pamela', 'Nicole', 'Samantha'
];

// 常见职业
export const OCCUPATIONS = [
  '教师', '工程师', '医生', '护士', '律师', '记者', '会计', '程序员',
  '设计师', '销售经理', '市场专员', '人力资源', '行政助理', '客服代表',
  '厨师', '司机', '保安', '清洁工', '农民', '学生', '自由职业者',
  'Teacher', 'Engineer', 'Doctor', 'Nurse', 'Lawyer', 'Journalist', 'Accountant', 'Programmer',
  'Designer', 'Sales Manager', 'Marketing Specialist', 'HR Consultant', 'Administrative Assistant', 
  'Customer Service', 'Chef', 'Driver', 'Security Guard', 'Cleaner', 'Farmer', 'Student', 'Freelancer'
];

// 教育程度
export const EDUCATION_LEVELS = [
  '小学', '初中', '高中', '中专', '大专', '本科', '硕士', '博士',
  'Elementary School', 'Middle School', 'High School', 'Vocational School', 
  'College', 'Bachelor\'s Degree', 'Master\'s Degree', 'Doctorate'
]; 
