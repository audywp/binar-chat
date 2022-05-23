const data = [
  {
    name: 'audy',
    age: 20,
    hobbies: ['tidur', 'scroll tiktok', 'makan', 'repeat'],
  },

  {
    name: 'akbar',
    age: 20,
    hobbies: ['tidur', 'scroll tiktok', 'makan', 'repeat'],
  },

  {
    name: 'hengky',
    age: 20,
    hobbies: ['tidur', 'scroll tiktok', 'makan', 'repeat'],
  },

  {
    name: 'mutiara',
    age: 20,
    hobbies: ['tidur', 'scroll tiktok', 'makan', 'repeat'],
  },

  {
    name: 'shobrina',
    age: 20,
    hobbies: ['tidur', 'scroll tiktok', 'makan', 'repeat'],
  },

  {
    name: "a'zham",
    age: 20,
    hobbies: ['tidur', 'scroll tiktok', 'makan', 'repeat'],
  },

  {
    name: 'rico',
    age: 20,
    hobbies: ['tidur', 'scroll tiktok', 'makan', 'repeat'],
  },
  {
    name: 'richman',
    age: 20,
    hobbies: ['tidur', 'scroll tiktok', 'makan', 'repeat'],
  },
];

const search = text => {
  if (!text) {
    return data;
  } else {
    return data
      .map(value => {
        if (value.name.toLowerCase().includes(text.toLowerCase())) {
          return value;
        } else {
          return null;
        }
      })
      .filter(val => val);
  }
};

console.log(search('a'));
console.log(search('e'));
console.log(search('m'));
console.log(search('aa'));
console.log(search('ri'));
