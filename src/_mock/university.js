import { faker } from '@faker-js/faker';

// ----------------------------------------------------------------------

const UNIVERSITY_NAME = [
  'University of Economics and Business',
  'University of Education',
  'University of Languages and International Studies',
  'Hanoi University of Science',
  'University of Social Science and Humanity',
  'University of Engineering and Technology',
  'School of Law',
  'School of Medicine and Pharmacy',
  'School of International Studies',
  'School of Interdisciplinary Studies',
];

const UNIVERSITY_CODE = [
  'UEB',
  'UE',
  'ULIS',
  'HUS',
  'USSH',
  'UET',
  'SL',
  'SMP',
  'SIS',
  'VMSIS',
];

// ----------------------------------------------------------------------

const universities = [...Array(10)].map((_, index) => ({
    id: faker.datatype.uuid(),
    name: UNIVERSITY_NAME[index],
    code: UNIVERSITY_CODE[index],
    address: faker.address.streetAddress(),
  }));

export default universities;
